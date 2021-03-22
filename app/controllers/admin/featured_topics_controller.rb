# frozen_string_literal: true

module Admin
  class FeaturedTopicsController < BaseController
    before_action :set_featured_topics, only: :index
    before_action :set_featured_topic, except: [:index, :create]

    def index
      @featured_topic = FeaturedTopic.new
    end

    def create
      @featured_topic = FeaturedTopic.new(featured_topic_params)

      if @featured_topic.save
      redirect_to admin_featured_topics_path
      else
      set_featured_topics

      render :index
      end
    end

    def destroy
      @featured_topic.destroy!
      redirect_to admin_featured_topics_path
    end

    private

    def set_featured_topic
      @featured_topic = FeaturedTopic.find(params[:id])
    end

    def set_featured_topics
      @featured_topics = FeaturedTopic.order(created_at: :desc).reject(&:new_record?)
    end

    def featured_topic_params
      params.require(:featured_topic).permit(:name)
    end
  end
end
