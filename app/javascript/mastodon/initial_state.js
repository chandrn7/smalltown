const element = document.getElementById('initial-state');
const initialState = element && JSON.parse(element.textContent);

const getMeta = (prop) => initialState && initialState.meta && initialState.meta[prop];

export const reduceMotion = getMeta('reduce_motion');
export const autoPlayGif = getMeta('auto_play_gif');
export const displayMedia = getMeta('display_media');
export const expandSpoilers = getMeta('expand_spoilers');
export const unfollowModal = getMeta('unfollow_modal');
export const boostModal = getMeta('boost_modal');
export const deleteModal = getMeta('delete_modal');
export const me = getMeta('me');
export const searchEnabled = getMeta('search_enabled');
export const invitesEnabled = getMeta('invites_enabled');
export const repository = getMeta('repository');
export const source_url = getMeta('source_url');
export const version = getMeta('version');
export const mascot = getMeta('mascot');
export const profile_directory = getMeta('profile_directory');
export const isStaff = getMeta('is_staff');
export const forceSingleColumn = !getMeta('advanced_layout');
export const useBlurhash = getMeta('use_blurhash');
export const usePendingItems = getMeta('use_pending_items');
export const showTrends = getMeta('trends');
export const title = getMeta('title');
export const cropImages = getMeta('crop_images');
export const disableSwiping = getMeta('disable_swiping');
export const showStaffBadge = getMeta('show_staff_badge');
export const completelySiloed = getMeta('completely_siloed');
export const whitelistMode = getMeta('whitelist_mode');
export const dmsEnabled = getMeta('dms_enabled');
export const featuredTopics = getMeta('featured_topics');
export const support_url = getMeta('support_url');
export const android_icon = getMeta('android_icon');
export const bookmarks = getMeta('bookmarks');
export const lists = getMeta('lists');
export const relationships = getMeta('relationships');
export const statusQueueEnabled = getMeta('status_queue')
export const homeEnabled = getMeta('home_enabled')
export const reblogsEnabled = getMeta('reblogs_enabled')
export const shareEnabled = getMeta('share_enabled')
export const archiveMinStatusId = getMeta('archive_min_status_id')
export const archiveMaxStatusId = getMeta('archive_max_status_id')
export const welcomeMessage = getMeta('welcome_message')
export const tutorial = getMeta('tutorial')

export default initialState;
