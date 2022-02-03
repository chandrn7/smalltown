# frozen_string_literal: true

module Admin
  class SettingsController < BaseController
    def edit
      authorize :settings, :show?

      @admin_settings = Form::AdminSettings.new
    end

    def update
      authorize :settings, :update?
      
      @admin_settings = Form::AdminSettings.new(settings_params)
      
      prev_archive_status_id = ''
      if settings_params[:archive_status_id]
        prev_archive_status_id = Setting.archive_status_id
      end

      if @admin_settings.save
        flash[:notice] = I18n.t('generic.changes_saved_msg')
        if settings_params[:allow_private_accounts]
          check_private_accounts
        end
        if settings_params[:archive_status_id]
          change_archive_replies(prev_archive_status_id)
        end
        redirect_to edit_admin_settings_path
      else
        render :edit
      end
    end

    private

    def settings_params
      params.require(:form_admin_settings).permit(*Form::AdminSettings::KEYS)
    end

    def check_private_accounts
      ApplicationRecord.transaction do
        if !Setting.allow_private_accounts
          Account.where(locked: true).reorder(nil).find_each do |account|
            account.update!(locked: false)
          end
        end
      end

      true
    rescue ActiveRecord::RecordInvalid
      false
    end

    def change_archive_replies(prev_archive_status_id)
      ApplicationRecord.transaction do
        if prev_archive_status_id != ''
          Status.where("id <= ?", prev_archive_status_id).find_each do |status|
            disabled = ConversationRepliesDisabled.find_by(conversation_id: status.conversation_id)
            disabled&.destroy!
            log_action :update, status
          end
        end
        
        if Setting.archive_status_id != ''
          Status.where("id <= ?", Setting.archive_status_id).find_each do |status|
            ConversationRepliesDisabled.find_or_create_by!(conversation_id: status.conversation_id)
            log_action :update, status
          end
        end
      end

      true
    rescue ActiveRecord::RecordInvalid
      false
    end
    
  end
end
