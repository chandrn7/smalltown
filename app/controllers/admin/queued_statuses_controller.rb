# frozen_string_literal: true

module Admin
  class QueuedStatusesController < BaseController
    helper_method :current_params

    PER_PAGE = 20

    def index
      authorize :status, :index?

      @statuses = Status.unscope(where: :pending).where(pending: true)

      @statuses = @statuses.preload(:media_attachments, :mentions).page(params[:page]).per(PER_PAGE)
      @form     = Form::StatusBatch.new
    end

    def create
      authorize :status, :update?

      @form         = Form::StatusBatch.new(form_status_batch_params.merge(current_account: current_account, action: action_from_button))
      flash[:alert] = I18n.t('admin.statuses.failed_to_execute') unless @form.save

      redirect_to admin_queued_statuses_path(current_params)
    rescue ActionController::ParameterMissing
      flash[:alert] = I18n.t('admin.statuses.no_status_selected')

      redirect_to admin_queued_statuses_path(current_params)
    end

    private

    def form_status_batch_params
      params.require(:form_status_batch).permit(:action, :email_collection => [:text, :send_email_notification], status_ids: [])
    end

    def current_params
      page = (params[:page] || 1).to_i

      {
        media: params[:media],
        page: page > 1 && page,
      }.select { |_, value| value.present? }
    end

    def action_from_button
      if params[:nsfw_on]
        'nsfw_on'
      elsif params[:delete]
        'delete'
      elsif params[:disable_replies]
        'disable_replies'
      elsif params[:approve]
        'approve'
      end
    end
  end
end
  