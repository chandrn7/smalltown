require Rails.root.join('lib', 'mastodon', 'migration_helpers')
class AddTimelinePinnedToStatuses < ActiveRecord::Migration[6.1]
  include Mastodon::MigrationHelpers

  disable_ddl_transaction!

  def up
    safety_assured { add_column_with_default :statuses, :timeline_pinned, :boolean, default: false, allow_null: false }
  end

  def down
    remove_column :statuses, :timeline_pinned
  end
end
