# frozen_string_literal: true

class Scheduler::StatusCleanupScheduler
    include Sidekiq::Worker
  
    sidekiq_options lock: :until_executed, retry: 0
  
    def perform
      clean_discarded_statuses!
    end
  
    private
  
    def clean_discarded_statuses!
      RemovalWorker.push_bulk(Status.with_discarded.discarded.where('deleted_at <= ?', 14.days.ago).pluck(:id)) { |status_id| [status_id, { immediate: true }] }
    end
  end
  