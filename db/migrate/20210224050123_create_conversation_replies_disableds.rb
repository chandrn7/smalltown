class CreateConversationRepliesDisableds < ActiveRecord::Migration[5.2]
  def change
    create_table :conversation_replies_disableds do |t|
      t.bigint :conversation_id, null: false
    end
    
    add_index :conversation_replies_disableds, :conversation_id, unique: true
  end
end
