# frozen_string_literal: true

module Admin
  class StatusesController < BaseController
    helper_method :current_params

    before_action :set_account

    PER_PAGE = 20

    def index
      authorize :status, :index?

      @statuses = @account.statuses.with_discarded.where(visibility: [:public, :unlisted, :private])

      if params[:media]
        @statuses.merge!(Status.joins(:media_attachments).merge(@account.media_attachments.reorder(nil)).group(:id))
      end

      @statuses = @statuses.preload(:media_attachments, :mentions).page(params[:page]).per(PER_PAGE)
      @form     = Form::StatusBatch.new
    end

    def show
      authorize :status, :index?

      @statuses = @account.statuses.with_discarded.where(id: params[:id])
      authorize @statuses.first, :show?

      @form = Form::StatusBatch.new
    end

    def create
      authorize :status, :update?

      @form         = Form::StatusBatch.new(form_status_batch_params.merge(current_account: current_account, action: action_from_button))
      @form.target_account  = @account
      flash[:alert] = I18n.t('admin.statuses.failed_to_execute') unless @form.save

      redirect_to admin_account_statuses_path(@account.id, current_params)
    rescue ActionController::ParameterMissing
      flash[:alert] = I18n.t('admin.statuses.no_status_selected')

      redirect_to admin_account_statuses_path(@account.id, current_params)
    end

    private

    def form_status_batch_params
      params.require(:form_status_batch).permit(:action, :email_collection => [:text, :send_email_notification], status_ids: [])
    end

    def set_account
      @account = Account.find(params[:account_id])
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
      elsif params[:nsfw_off]
        'nsfw_off'
      elsif params[:delete]
        'delete'
      elsif params[:disable_replies]
        'disable_replies'
      elsif params[:enable_replies]
        'enable_replies'
      elsif params[:restore]
        'restore'
      elsif params[:timeline_pin]
        'timeline_pin'
      elsif params[:timeline_unpin]
        'timeline_unpin'
      end
    end
  end
end
