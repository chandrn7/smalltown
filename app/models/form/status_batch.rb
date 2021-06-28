# frozen_string_literal: true

class Form::StatusBatch
  include ActiveModel::Model
  include AccountableConcern
  include Authorization

  attr_accessor :status_ids, :action, :current_account, :email_collection, :target_account
  attr_reader :warning

  def save
    case action
    when 'nsfw_on', 'nsfw_off'
      change_sensitive(action == 'nsfw_on')
    when 'delete', 'restore'
      delete_or_restore_statuses(action == 'delete')
    when 'disable_replies', 'enable_replies'
      change_replies(action == 'disable_replies')
    when 'approve'
      approve_statuses
    end
  end

  private

  def change_sensitive(sensitive)
    media_attached_status_ids = MediaAttachment.where(status_id: status_ids).pluck(:status_id)

    ApplicationRecord.transaction do
      Status.where(id: media_attached_status_ids).reorder(nil).find_each do |status|
        status.update!(sensitive: sensitive)
        log_action :update, status
      end
    end
    
    if send_email_notification?
      process_warning!
      process_email!
    end
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  def delete_or_restore_statuses(delete_statuses)
    ApplicationRecord.transaction do
      if delete_statuses
        Status.where(id: status_ids).reorder(nil).find_each do |status|
          status.discard
          Tombstone.find_or_create_by(uri: status.uri, account: status.account, by_moderator: true)
          log_action :destroy, status
        end
      else
        Status.with_discarded.where(id: status_ids).reorder(nil).find_each do |status|
          status.undiscard
          tombstone = Tombstone.find_by(uri: status.uri, account: status.account, by_moderator: true)
          tombstone&.destroy!
          log_action :restore, status
        end
      end
    end
    
    if send_email_notification?
      process_warning!
      process_email!
    end
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  def change_replies(replies_disabled)
    ApplicationRecord.transaction do
      Status.where(id: status_ids).reorder(nil).find_each do |status|
        if replies_disabled
          ConversationRepliesDisabled.find_or_create_by!(conversation_id: status.conversation_id)
        else 
          disabled = ConversationRepliesDisabled.find_by(conversation_id: status.conversation_id)
          disabled&.destroy!
        end
        log_action :update, status
      end
    end
    
    if send_email_notification?
      process_warning!
      process_email!
    end
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  def approve_statuses
    ApplicationRecord.transaction do
      Status.unscope(where: :pending).where(id: status_ids).reorder(nil).find_each do |status|
        status.update!(pending: false)
        if status.local?
          PostStatusService.new.postprocess_status(status)
        else
          ActivityPub::Activity.distribute(status)
        end
        log_action :update, status
      end
    end

    if send_email_notification?
      process_warning!
      process_email!
    end
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  def process_warning!
    authorize(target_account, :warn?)

    @warning = AccountWarning.create!(target_account: target_account,
                                      account: current_account,
                                      action: action,
                                      text: get_email_text)

    # A log entry is only interesting if the warning contains
    # custom text from someone. Otherwise it's just noise.

    log_action(:create, warning) if warning.text.present?
  end

  def process_email!
    UserMailer.warning(target_account.user, warning, status_ids).deliver_later!
  end

  def get_email_text
    if email_collection[:text]
      return email_collection[:text]
    end
    return ""
  end

  def send_email_notification?
    ActiveModel::Type::Boolean.new.cast(email_collection[:send_email_notification])
  end
end
