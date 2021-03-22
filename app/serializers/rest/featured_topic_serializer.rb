# frozen_string_literal: true

class REST::FeaturedTopicSerializer < ActiveModel::Serializer
    include RoutingHelper
  
    attributes :id, :tag_id, :name
  
    def id
      object.id.to_s
    end

    def tag_id
      object.tag_id.to_s
    end
  end
  