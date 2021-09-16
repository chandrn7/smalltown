# frozen_string_literal: true

class PublicTimelinesController < ApplicationController
  layout 'public'

  PAGE_SIZE     = 20

  before_action :authenticate_user!, if: -> { !Setting.timeline_preview && request.format == :html }
  before_action :require_user!, if: -> { !Setting.timeline_preview && request.format == :rss }
  before_action :require_enabled!
  before_action :set_body_classes
  before_action :set_instance_presenter
  before_action :set_statuses

  def show 
    respond_to do |format|
      format.html do
        expires_in 0, public: true
      end

      format.rss do
        expires_in 0, public: true
        render xml: RSS::PublicTimelineSerializer.render(@statuses)
      end
    end
  end

  private

  def require_enabled!
    not_found unless Setting.timeline_preview || current_user&.staff?
  end

  def current_resource_owner
    @current_user ||= User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end

  def current_user
    current_resource_owner || super
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Record not found' }, status: 404
  end

  def require_user!
    if !current_user
      render json: { error: 'This method requires an authenticated user' }, status: 422
    elsif !current_user.confirmed?
      render json: { error: 'Your login is missing a confirmed e-mail address' }, status: 403
    elsif !current_user.approved?
      render json: { error: 'Your login is currently pending approval' }, status: 403
    elsif !current_user.functional?
      render json: { error: 'Your login is currently disabled' }, status: 403
    else
      update_user_sign_in
    end
  end

  def set_body_classes
    @body_classes = 'with-modals'
  end

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end

  def set_statuses
    case request.format&.to_sym
    when :rss
      @statuses = cache_collection(public_statuses, Status)
    end
  end

  def public_statuses
    public_feed.get(PAGE_SIZE)
  end

  def public_feed
    PublicFeed.new(nil, local: true)
  end
end
