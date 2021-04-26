require 'rails_helper'

describe Scheduler::StatusCleanupScheduler do
  subject { described_class.new }
  
  let!(:alice)  { Fabricate(:account, user: Fabricate(:user)) }
  let!(:old_status) { Fabricate(:status, account: alice, deleted_at: 15.days.ago)}
  let!(:new_status) { Fabricate(:status, account: alice, deleted_at: 1.hour.ago) }


  it 'removes old deleted statuses' do
    subject.perform

    expect(Status.find_by(id: old_status.id)).to be_nil
    expect(Status.with_discarded.find_by(id: old_status.id)).to be_nil

    expect(Status.find_by(id: new_status.id)).to be_nil
    expect(Status.with_discarded.find_by(id: new_status.id)).to_not be_nil
  end
end