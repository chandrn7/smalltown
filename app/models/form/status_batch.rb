# frozen_string_literal: true

class Form::StatusBatch
  include ActiveModel::Model
  include AccountableConcern

  attr_accessor :status_ids, :action, :current_account

  def save
    case action
    when 'nsfw_on', 'nsfw_off'
      change_sensitive(action == 'nsfw_on')
    when 'delete'
      delete_statuses
    when 'disable_replies', 'enable_replies'
      change_replies(action == 'disable_replies')
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

    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  def delete_statuses
    Status.where(id: status_ids).reorder(nil).find_each do |status|
      status.discard
      RemovalWorker.perform_async(status.id, immediate: true)
      Tombstone.find_or_create_by(uri: status.uri, account: status.account, by_moderator: true)
      log_action :destroy, status
    end

    true
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
    
    true
  rescue ActiveRecord::RecordInvalid
    false
  end
end
