import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import { expandArchiveTimeline } from '../../actions/timelines';
import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import { connectArchiveStream } from '../../actions/streaming';
import { archiveMaxStatusId } from '../../initial_state';


const messages = defineMessages({
  title: { id: 'column.archive', defaultMessage: 'Archive timeline' },
});

const mapStateToProps = (state) => {
  const timelineState = state.getIn(['timelines', `archive`]);

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ArchiveTimeline extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    shouldUpdateScroll: PropTypes.func,
    columnId: PropTypes.string,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    multiColumn: PropTypes.bool,
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('ARCHIVE'));
    }
  }

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  componentDidMount () {
    const { dispatch } = this.props;
    const maxId = archiveMaxStatusId;

    dispatch(expandArchiveTimeline({ maxId }));
    this.disconnect = dispatch(connectArchiveStream({ maxId }));
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  setRef = c => {
    this.column = c;
  }

  handleLoadMore = maxId => {
    const { dispatch } = this.props;

    dispatch(expandArchiveTimeline({ maxId }));
  }

  render () {
    const { intl, shouldUpdateScroll, hasUnread, columnId, multiColumn } = this.props;
    const pinned = !!columnId;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='archive'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        >
        </ColumnHeader>

        <StatusListContainer
          trackScroll={!pinned}
          scrollKey={`archive_timeline-${columnId}`}
          timelineId={`archive`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.archive' defaultMessage='The archive timeline is empty.' />}
          shouldUpdateScroll={shouldUpdateScroll}
          bindToDocument={!multiColumn}
        />
      </Column>
    );
  }

}
