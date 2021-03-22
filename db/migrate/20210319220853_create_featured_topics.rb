class CreateFeaturedTopics < ActiveRecord::Migration[5.2]
  def change
    create_table :featured_topics do |t|
      t.references :tag, foreign_key: { on_delete: :cascade }

      t.timestamps
    end
  end
end
