import React from 'react';
import { FormattedMessage } from 'react-intl';

const RegenerationIndicator = () => (
  <div className='regeneration-indicator'>

    <div className='regeneration-indicator__label'>
      <FormattedMessage id='regeneration_indicator.label' tagName='strong' defaultMessage='Loading&hellip;' />
      <FormattedMessage id='regeneration_indicator.sublabel' defaultMessage='Your home feed is being prepared!' />
    </div>
  </div>
);

export default RegenerationIndicator;
