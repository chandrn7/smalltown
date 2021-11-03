# Smalltown: a Mastodon fork

Mastodon is a **free, open-source social network server** based on ActivityPub. This is *not* the official version of Mastodon; this is a separate version (i.e. a fork). For more information on Mastodon, you can see the [official website](https://joinmastodon.org) and the [upstream repo](https://github.com/tootsuite/mastodon).

__Smalltown__ is designed for civic communities looking to run their own social networks, though any community that is well-defined and has a purpose may find it useful. It is intended for sites that use Mastodon’s [limited federation mode](https://docs.joinmastodon.org/admin/config/#limited_federation_mode) (federation whitelist) and are either completely siloed or federate with a few, trusted sites.

Some of our changes are wanted by the Mastodon project, others are not—we will do our best to merge relevant changes to Mastodon.

Please [check out our wiki](https://github.com/chandrn7/civic-logic/wiki) for a list of Smalltown-exclusive features. Some but not all of them are covered in this document.

## Support this project

Much of the work on this project was inspired by [Darius Kazemi's](https://tinysubversions.com) work on [Hometown](https://github.com/hometown-fork/hometown) and [runyourown.social](https://runyourown.social). Please consider [pledging Darius Kazemi's Patreon](https://www.patreon.com/tinysubversions) which supports his open source projects.

This project also couldn't exist without Mastodon so please consider [supporting the Mastodon project](https://www.patreon.com/mastodon) too.

## Installation

Please see [this article in the wiki](https://github.com/chandrn7/smalltown/wiki/How-to-set-up-a-site-that-runs-Smalltown) for instructions on how to set up a site that runs Smalltown.

## Single Sign On with Facebook, Google, Twitter, and OpenID

Mastodon allows admins to set up Single Sign On (SSO) with frameworks including SAML, LDAP, PAM, and CAS. However, it does not support SSO through major platforms like Facebook, Google, and Twitter, nor through the [OpenID](https://openid.net/connect/) framework. Most people have an identity with Facebook, Google, or Twitter—allowing SSO through them makes life easier for both users and admins. Similarly, OpenID is widely used by organizations large and small—supporting OpenID  makes it easier for users to sign up through through an organization where they already have an identity, like their local newspaper.

To configure your Smalltown site to use these options, you just have to set a few environment variables. [Check out more detailed documentation about how to use this feature on the wiki](https://github.com/chandrn7/smalltown/wiki/SSO-with-Facebook,-Google,-Twitter,-and-OpenID).

## More customization through the admin dashboard

Mastodon allows for some site functionality to be configured through the admin dashboard. This makes it easier for admins to make changes without technical know-how. 

Smalltown extends this customization, allowing admins to customize additional functionality through the dashboard. Some examples:
* Whether to allow direct messages
* Whether to allow private posts and accounts
* Whether to include bookmarks and lists
* Uploading custom icons and favicons

[For a full list and detailed documentation check out the wiki](https://github.com/chandrn7/civic-logic/wiki).

## Post queue

On Smalltown, admins can turn a post queue on and off. All posts submitted while the queue is on must be approved by site staff before they appear on timelines. 

Some sites are run by one or two people. They can't always find time to moderate, especially during off hours like at night. Turning a post queue on can help them safely moderate their site, allowing them to review posts before they appear on timelines. A post queue is also useful for sites that want to limit discussion to certain time periods—like a network that wants to encourage discussion outside of working hours. A post queue can also be a pro-social feature, slowing down discussion and encouraging thoughtfulness and reflection by users.

[For more detailed documentation check out the wiki](https://github.com/chandrn7/smalltown/wiki/Post-queue).

## Post digest

On Smalltown, admins can send a post digest daily or weekly with a selection of recent posts. Sometimes people don't want to have to check a site frequently to get updates from their network. A post digest can help people stay on top of what's happening without the need to constantly refresh their Smalltown tab. It can also help people have a healthier relationship with their social media, enabling them to take control of their attention.

[For more detailed documentation check out the wiki](https://github.com/chandrn7/smalltown/wiki/Post-digest).

## Featured topics

It can be difficult to find posts that you’re interested in, especially if you’re new to a social network. The “Featured topics” page lets site staff highlight different hashtags that they think may be relevant to a wide range of people.

[For more detailed documentation check out the wiki](https://github.com/chandrn7/civic-logic/wiki/Featured-topics).

## Restore deleted posts

Sometimes moderators make mistakes. Unfortunately, Mastodon doesn’t allow moderators to restore posts that have been deleted. We think being able to restore posts is an important accountability mechanism that can increase trust and transparency between users and moderators. Smalltown allows site staff to restore posts up to 14 days after they’ve been deleted.

[For more detailed documentation check out the wiki](https://github.com/chandrn7/civic-logic/wiki/Restore-deleted-posts).

## UI Changes

Mastodon comes with a lot of Mastodon related branding. We removed much of the Mastodon branding, allowing admins to have more control over the branding on their site, and reducing confusion for users who aren’t able to distinguish between Mastodon the software project and the various sites that run on top of Mastodon. Some examples: 
* Changed the word “toot” to “post” 
* Removed elephant images
* Replaced “Mastodon” with the site name in much of the copy

We also simplified the UI. Mastodon comes with a lot of features for power users, but this can be overwhelming for less technically savvy users. Some examples:
* We removed verified links
* We removed many of the footer links and some functionality on the /about landing pages
* We enabled admins to remove personal “featured hashtags”, bookmarks, lists, and the advanced “relationships” page

[For a full list of UI changes and detailed documentation check out the wiki](https://github.com/chandrn7/civic-logic/wiki).

## License

Copyright (C) 2016-2021 Eugen Rochko & other Mastodon contributors (see [AUTHORS.md](AUTHORS.md))

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
