# frozen_string_literal: true
# == Schema Information
#
# Table name: conversation_replies_disableds
#
#  id              :bigint(8)        not null, primary key
#  conversation_id :bigint(8)        not null
#
class ConversationRepliesDisabled < ApplicationRecord
    belongs_to :conversation
end
