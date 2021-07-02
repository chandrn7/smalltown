# frozen_string_literal: true

class PostDigestWorker
    include Sidekiq::Worker
  
    sidekiq_options queue: 'mailers'
  
    attr_reader :user
  
    def perform(user_id, status_ids)
      @user = User.find(user_id)
      deliver_post_digest(status_ids) if @user.allows_post_digest_emails?
    end
  
    private
  
    def deliver_post_digest(status_ids)
      UserMailer.post_digest(user, status_ids).deliver_now!
    end
  end