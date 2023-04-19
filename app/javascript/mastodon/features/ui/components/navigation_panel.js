import React from 'react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from 'mastodon/components/icon';
import { profile_directory, showTrends, completelySiloed, dmsEnabled, bookmarks, lists, relationships, homeEnabled, archiveMaxStatusId, mascot } from 'mastodon/initial_state';
import NotificationsCounterIcon from './notifications_counter_icon';
import FollowRequestsNavLink from './follow_requests_nav_link';
import ListPanel from './list_panel';
import TrendsContainer from 'mastodon/features/getting_started/containers/trends_container';

const NavigationPanel = () => (
  <div className='navigation-panel'>
    {mascot && <div className='navigation-panel__logo'>
      <Link to='/' className='column-link column-link--logo'> 
        <img alt='' className="logo" draggable='false' src={mascot} />
      </Link>
      <hr />
    </div>}

    { homeEnabled && <NavLink className='column-link column-link--transparent' to='/timelines/home' data-preview-title-id='column.home' data-preview-icon='home' ><Icon className='column-link__icon' id='home' fixedWidth /><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></NavLink>}
    <NavLink className='column-link column-link--transparent' to='/notifications' data-preview-title-id='column.notifications' data-preview-icon='bell' ><NotificationsCounterIcon className='column-link__icon' /><FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' /></NavLink>
    <FollowRequestsNavLink />
    <NavLink className='column-link column-link--transparent' to='/timelines/public/local' data-preview-title-id='column.community' data-preview-icon='users' ><Icon className='column-link__icon' id='users' fixedWidth /><FormattedMessage id='tabs_bar.local_timeline' defaultMessage='Local' /></NavLink>
    { !completelySiloed && <NavLink className='column-link column-link--transparent' exact to='/timelines/public' data-preview-title-id='column.public' data-preview-icon='globe' ><Icon className='column-link__icon' id='globe' fixedWidth /><FormattedMessage id='tabs_bar.federated_timeline' defaultMessage='Federated' /></NavLink>}
    { archiveMaxStatusId !== '' && <NavLink className='column-link column-link--transparent' to='/timelines/public/archive' data-preview-title-id='column.archive' data-preview-icon='archive' ><Icon className='column-link__icon' id='archive' fixedWidth /><FormattedMessage id='tabs_bar.archive_timeline' defaultMessage='Archive' /></NavLink>}
    <NavLink className='column-link column-link--transparent' to='/featured_topics'><Icon className='column-link__icon' id='hashtag' fixedWidth /><FormattedMessage id='navigation_bar.featured_topics' defaultMessage='Featured topics' /></NavLink>
    {dmsEnabled && <NavLink className='column-link column-link--transparent' to='/timelines/direct'><Icon className='column-link__icon' id='envelope' fixedWidth /><FormattedMessage id='navigation_bar.direct' defaultMessage='Direct messages' /></NavLink>}
    <NavLink className='column-link column-link--transparent' to='/favourites'><Icon className='column-link__icon' id='star' fixedWidth /><FormattedMessage id='navigation_bar.favourites' defaultMessage='Favourites' /></NavLink>
    {bookmarks && <NavLink className='column-link column-link--transparent' to='/bookmarks'><Icon className='column-link__icon' id='bookmark' fixedWidth /><FormattedMessage id='navigation_bar.bookmarks' defaultMessage='Bookmarks' /></NavLink>}
    {lists && <NavLink className='column-link column-link--transparent' to='/lists'><Icon className='column-link__icon' id='list-ul' fixedWidth /><FormattedMessage id='navigation_bar.lists' defaultMessage='Lists' /></NavLink>}
    {profile_directory && <NavLink className='column-link column-link--transparent' to='/directory'><Icon className='column-link__icon' id='address-book-o' fixedWidth /><FormattedMessage id='getting_started.directory' defaultMessage='Profile directory' /></NavLink>}

    {lists &&<ListPanel />}

    <hr />

    <a className='column-link column-link--transparent' href='/settings/preferences'><Icon className='column-link__icon' id='cog' fixedWidth /><FormattedMessage id='navigation_bar.preferences' defaultMessage='Preferences' /></a>
    {relationships && <a className='column-link column-link--transparent' href='/relationships'><Icon className='column-link__icon' id='users' fixedWidth /><FormattedMessage id='navigation_bar.follows_and_followers' defaultMessage='Follows and followers' /></a>}

    {showTrends && <div className='flex-spacer' />}
    {showTrends && <TrendsContainer />}
  </div>
);

export default withRouter(NavigationPanel);
