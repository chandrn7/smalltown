import React from 'react';
import PropTypes from 'prop-types';
import ReactSwipeableViews from 'react-swipeable-views';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { closeOnboarding } from '../../actions/onboarding';
import logoTransparent from '../../../images/logo_transparent.svg';
import { disableSwiping, mascot, title, welcomeMessage } from 'mastodon/initial_state';

const FrameWelcome = ({ onNext }) => (
  <div className='introduction__frame'>
    {mascot && <div className='introduction__illustration' style={{ background: `url(${logoTransparent}) no-repeat center center / auto 80%` }}>
      <img src={mascot} alt='' />
    </div>}

    <div className={'introduction__text introduction__text--centered' + (mascot ? " has-image" : "")}>
      <h3><FormattedMessage id='introduction.welcome.headline' defaultMessage='First steps' /></h3>
      <p><FormattedMessage id='introduction.welcome.text' defaultMessage="Welcome! In a few moments, you'll be able to participate in the conversation on {title}." values={{ title: <code>{title}</code> }} /></p>
    </div>

    <div className={'introduction__action' + (mascot ? "" : " no-image")}>
      <button className='button' onClick={onNext}><FormattedMessage id='introduction.welcome.action' defaultMessage="Let's go!" /></button>
    </div>
  </div>
);

FrameWelcome.propTypes = {
  onNext: PropTypes.func.isRequired,
};

const FrameFederation = ({ onNext }) => (
  <div className='introduction__frame'>
    <div className='introduction__text introduction__text--centered'>
      <h3><FormattedMessage id='introduction.welcome.message' defaultMessage='Overview' /></h3>
      <p className='rich-formatting' dangerouslySetInnerHTML={{__html: welcomeMessage || "This is a space for connecting with your commmunity online! Be respectful."}}/>
    </div>

    <div className='introduction__action no-image'>
      <button className='button' onClick={onNext}><FormattedMessage id='introduction.federation.action' defaultMessage='Next' /></button>
    </div>
  </div>
);

FrameFederation.propTypes = {
  onNext: PropTypes.func.isRequired,
};

const FrameInteractions = ({ onNext }) => (
  <div className='introduction__frame'>

     <div className='introduction__text introduction__text--centered'>
      <h3><FormattedMessage id='introduction.interactions.headline' defaultMessage='Quick Tips' /></h3>
    </div>

    <div className='introduction__text introduction__text--columnized'>
      <div>
        <h3><FormattedMessage id='introduction.interactions.reply.headline' defaultMessage='Reply' /></h3>
        <p><FormattedMessage id='introduction.interactions.reply.text' defaultMessage="You can reply to other people's and your own posts, which will chain them together in a conversation." /></p>
      </div>

      <div>
        <h3><FormattedMessage id='introduction.interactions.favourite.headline' defaultMessage='Favourite' /></h3>
        <p><FormattedMessage id='introduction.interactions.favourite.text' defaultMessage='You can save a post for later, and let the author know that you liked it, by favouriting it.' /></p>
      </div>
    </div>

    <div className='introduction__action no-image'>
      <button className='button' onClick={onNext}><FormattedMessage id='introduction.interactions.action' defaultMessage='Finish tutorial!' /></button>
    </div>
  </div>
);

FrameInteractions.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default @connect(state => ({ domain: state.getIn(['meta', 'domain']) }))
class Introduction extends React.PureComponent {

  static propTypes = {
    domain: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    currentIndex: 0,
  };

  componentWillMount () {
    this.pages = [
      <FrameWelcome onNext={this.handleNext} />,
      <FrameFederation onNext={this.handleNext} />,
      <FrameInteractions onNext={this.handleFinish} />,
    ];
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleDot = (e) => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    e.preventDefault();
    this.setState({ currentIndex: i });
  }

  handlePrev = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: Math.max(0, currentIndex - 1),
    }));
  }

  handleNext = () => {
    const { pages } = this;

    this.setState(({ currentIndex }) => ({
      currentIndex: Math.min(currentIndex + 1, pages.length - 1),
    }));
  }

  handleSwipe = (index) => {
    this.setState({ currentIndex: index });
  }

  handleFinish = () => {
    this.props.dispatch(closeOnboarding());
  }

  handleKeyUp = ({ key }) => {
    switch (key) {
    case 'ArrowLeft':
      this.handlePrev();
      break;
    case 'ArrowRight':
      this.handleNext();
      break;
    }
  }

  render () {
    const { currentIndex } = this.state;
    const { pages } = this;

    return (
      <div className='introduction'>
        <ReactSwipeableViews index={currentIndex} onChangeIndex={this.handleSwipe} disabled={disableSwiping} className='introduction__pager'>
          {pages.map((page, i) => (
            <div key={i} className={classNames('introduction__frame-wrapper', { 'active': i === currentIndex })}>{page}</div>
          ))}
        </ReactSwipeableViews>

        <div className='introduction__dots'>
          {pages.map((_, i) => (
            <div
              key={`dot-${i}`}
              role='button'
              tabIndex='0'
              data-index={i}
              onClick={this.handleDot}
              className={classNames('introduction__dot', { active: i === currentIndex })}
            />
          ))}
        </div>
      </div>
    );
  }

}
