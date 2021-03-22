class CreateFeaturedTopics < ActiveRecord::Migration[5.2]
  def change
    create_table :featured_topics do |t|
      t.references :tag
      t.bigint :topic_id

      t.timestamps
    end
  end
end
