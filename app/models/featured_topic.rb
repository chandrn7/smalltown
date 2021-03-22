# frozen_string_literal: true
# == Schema Information
#
# Table name: featured_topics
#
#  id         :bigint(8)        not null, primary key
#  tag_id     :bigint(8)
#  topic_id   :bigint(8)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class FeaturedTopic < ApplicationRecord
    belongs_to :tag, inverse_of: :featured_topic, required: true

    delegate :name, to: :tag, allow_nil: true
    validates_associated :tag, on: :create
    validates :name, presence: true, on: :create

    def name=(str)
        self.tag = Tag.find_or_create_by_names(str.strip)&.first
    end
    
end
