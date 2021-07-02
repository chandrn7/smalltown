# frozen_string_literal: true

class Scheduler::PostDigestScheduler
    include Sidekiq::Worker
  
    sidekiq_options retry: 0
  
    def perform
      return unless ENV['POST_DIGEST_ENABLED']
      
      time_limit = ENV['POST_DIGEST_DAY'] ? 7.days.ago : 1.day.ago
      status_ids = Status.with_public_visibility.where('created_at >= ?', time_limit).where(reply: false).pluck(:id).to_a.sample(10)
      if status_ids.length < 1
        return
      end

      User.emailable.select(:id).reorder(nil).find_in_batches do |users|
        PostDigestWorker.push_bulk(users) do |user|
          [user.id, status_ids]
        end
      end
    end
  end
  