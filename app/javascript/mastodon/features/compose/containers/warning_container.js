import React from 'react';
import { connect } from 'react-redux';
import Warning from '../components/warning';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { statusQueueEnabled, title } from '../../../initial_state';

const buildHashtagRE = () => {
  try {
    const HASHTAG_SEPARATORS = '_\\u00b7\\u200c';
    const ALPHA = '\\p{L}\\p{M}';
    const WORD = '\\p{L}\\p{M}\\p{N}\\p{Pc}';
    return new RegExp(
      '(?:^|[^\\/\\)\\w])#((' +
      '[' + WORD + '_]' +
      '[' + WORD + HASHTAG_SEPARATORS + ']*' +
      '[' + ALPHA + HASHTAG_SEPARATORS + ']' +
      '[' + WORD + HASHTAG_SEPARATORS +']*' +
      '[' + WORD + '_]' +
      ')|(' +
      '[' + WORD + '_]*' +
      '[' + ALPHA + ']' +
      '[' + WORD + '_]*' +
      '))', 'iu',
    );
  } catch {
    return /(?:^|[^\/\)\w])#(\w*[a-zA-Z·]\w*)/i;
  }
};

const APPROX_HASHTAG_RE = buildHashtagRE();

const mapStateToProps = state => ({
  directMessageWarning: state.getIn(['compose', 'privacy']) === 'direct',
  queueWarning: statusQueueEnabled,
});

const WarningWrapper = ({ directMessageWarning, queueWarning }) => {
  if (directMessageWarning) {
    const message = (
      <span>
        <FormattedMessage id='compose_form.direct_message_warning' defaultMessage='This post will only be sent to all the mentioned users.' /> <a href='/terms' target='_blank'><FormattedMessage id='compose_form.direct_message_warning_learn_more' defaultMessage='Learn more' /></a>
      </span>
    );

    return <Warning message={message} />;
  }
  
  if(queueWarning){
    return <Warning message={<FormattedMessage id='compose_form.queue_warning' defaultMessage="{title} is currently queuing posts. That means this post won't show up on timelines until it's approved by site staff." values={{ title: <span>{title}</span> }} />} />;
  }

  return null;
};

WarningWrapper.propTypes = {
  needsLockWarning: PropTypes.bool,
  hashtagWarning: PropTypes.bool,
  directMessageWarning: PropTypes.bool,
};

export default connect(mapStateToProps)(WarningWrapper);
