# frozen_string_literal: true

class Api::V1::Accounts::ListsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read, :'read:lists' }
  before_action :require_user!
  before_action :set_account
  before_action :require_lists!

  def index
    @lists = @account.suspended? ? [] : @account.lists.where(account: current_account)
    render json: @lists, each_serializer: REST::ListSerializer
  end

  private

  def set_account
    @account = Account.find(params[:account_id])
  end

  def require_lists!
    not_found if !Setting.lists
  end
end
