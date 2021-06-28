require Rails.root.join('lib', 'mastodon', 'migration_helpers')
class AddPendingToStatuses < ActiveRecord::Migration[6.1]
  include Mastodon::MigrationHelpers

  disable_ddl_transaction!

  def up
    safety_assured { add_column_with_default :statuses, :pending, :boolean, default: false, allow_null: false }
  end

  def down
    remove_column :statuses, :pending
  end
end
