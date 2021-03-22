import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../../components/loading_indicator';
import Column from '../ui/components/column';
import ColumnBackButtonSlim from '../../components/column_back_button_slim';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ColumnLink from '../ui/components/column_link';
import ColumnSubheading from '../ui/components/column_subheading';
import ScrollableList from '../../components/scrollable_list';
import { featuredTopics } from 'mastodon/initial_state';

const messages = defineMessages({
  heading: { id: 'column.featured_topics', defaultMessage: 'Featured topics' },
  subheading: { id: 'featured_topics.subheading', defaultMessage: 'Featured topics' },
});

export default @injectIntl
class FeaturedTopics extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
  };

  render () {
    const { intl, shouldUpdateScroll, multiColumn } = this.props;

    if (!featuredTopics) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='empty_column.featured_topics' defaultMessage="There aren't any featured topics yet. When your instance staff creates one, it will show up here." />;

    return (
      <Column bindToDocument={!multiColumn} icon='hashtag' heading={intl.formatMessage(messages.heading)}>
        <ColumnBackButtonSlim />

        <ScrollableList
          scrollKey='featured_topics'
          shouldUpdateScroll={shouldUpdateScroll}
          emptyMessage={emptyMessage}
          prepend={<ColumnSubheading text={intl.formatMessage(messages.subheading)} />}
          bindToDocument={!multiColumn}
        >
          {featuredTopics.map(featuredTopic =>
            <ColumnLink key={featuredTopic.tag_id} to={`/timelines/tag/${featuredTopic.name}`} icon='hashtag' text={featuredTopic.name} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
