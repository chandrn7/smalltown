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

      if @admin_settings.save
        flash[:notice] = I18n.t('generic.changes_saved_msg')
        check_private_accounts(settings_params)
        redirect_to edit_admin_settings_path
      else
        render :edit
      end
    end

    private

    def settings_params
      params.require(:form_admin_settings).permit(*Form::AdminSettings::KEYS)
    end

    def check_private_accounts(params)
      ApplicationRecord.transaction do
        if params[:allow_private_accounts]
          if !Setting.allow_private_accounts
            Account.where(locked: true).reorder(nil).find_each do |account|
              account.update!(locked: false)
            end
          end
        end
      end

      true
    rescue ActiveRecord::RecordInvalid
      false
    end
    
  end
end
