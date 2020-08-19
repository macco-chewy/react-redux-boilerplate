import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { Button, ButtonGroup } from 'react-bootstrap';

import ChangePassword from './ChangePassword';
import CompleteMFA from './CompleteMFA';
import ConfirmEmail from './ConfirmEmail';
import LogIn from './LogIn';
import SignUp from './SignUp';

import styles from './styles.module.css';

function DisplayResolver(props) {
  const {
    displayIndex, displayModeOverride, handleError, handleSuccess, loginDetails,
  } = props;

  // check for override display
  if (displayModeOverride) {
    switch (displayModeOverride) {
      case 'ConfirmEmail':
        return (
          <ConfirmEmail
            handleError={handleError}
            handleSuccess={handleSuccess}
            loginDetails={loginDetails}
          />
        );
      case 'ChangePassword':
        return (
          <ChangePassword
            handleError={handleError}
            handleSuccess={handleSuccess}
            loginDetails={loginDetails}
          />
        );
      case 'CompleteMFA':
        return (
          <CompleteMFA
            handleError={handleError}
            handleSuccess={handleSuccess}
            loginDetails={loginDetails}
          />
        );
      default:
        console.warn(`Unhandled override mode: ${displayModeOverride}`);
        break;
    }
  }

  switch (displayIndex) {
    case 0:
      return <LogIn handleError={handleError} handleSuccess={handleSuccess} />;
    case 1:
      return <SignUp handleError={handleError} handleSuccess={handleSuccess} />;
    default:
      console.warn(`Unhandled display index: ${displayIndex}`);
      break;
  }
}

class Authenticator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayIndex: 0,
      displayModeOverride: '',
      errorMessage: '',
      initialized: false,
      loginDetails: null,
      user: null,
    };
    this.displayButtons = ['Log in'];
  }

  async componentDidMount() {
    try {
      this.handleSuccess(await Auth.currentAuthenticatedUser({ bypassCache: true }));
    } catch (e) {
      // console.warn(e);
    }
    this.setState({ initialized: true });
  }

  setDisplay = (index) => {
    if (index !== this.state.displayIndex) {
      this.setState({ displayIndex: index, displayModeOverride: '', errorMessage: '' });
    }
  };

  handleError = (e, loginDetails = {}) => {
    if (!e.code) {
      // validation error
      this.setState({ errorMessage: e.message });
    } else {
      // cognito error
      switch (e.code) {
        case 'NotAuthorizedException':
        case 'UserNotFoundException':
          this.setState({ errorMessage: 'Inavlid username or password.  Please try again.' });
          break;

        case 'UsernameExistsException':
          this.setState({ errorMessage: 'The provided email is already in use.' });
          break;

        case 'InvalidParameterException':
          this.setState({ errorMessage: 'Invalid input. Please try again.' });
          break;

        case 'UserNotConfirmedException':
          this.setState({ displayModeOverride: 'ConfirmEmail', loginDetails, errorMessage: '' });
          break;

        case 'CodeMismatchException':
          this.setState({ errorMessage: 'Invalid code. Please try again.' });
          break;

        case 'PasswordResetRequiredException':
          this.setState({ displayModeOverride: 'ChangePassword', loginDetails, errorMessage: '' });
          break;

        default:
          console.warn(`Unhandled cognito error code: ${e.code}`);
          this.setState({ errorMessage: 'Unknown error creating user. Please try again.' });
          break;
      }
    }
  };

  handleSuccess = (user, loginDetails = {}) => {
    const newState = {
      errorMessage: '',
      loginDetails: { ...loginDetails, user },
    };

    // ensure user is confirmed
    if (user.userConfirmed === false) {
      this.setState({ ...newState, displayModeOverride: 'ConfirmEmail' });

      // check for new password
    } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      this.setState({ ...newState, displayModeOverride: 'ChangePassword' });

      // check for mfa
    } else if (
      (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA')
      && user.signInUserSession === null
    ) {
      this.setState({ ...newState, displayModeOverride: 'CompleteMFA' });

      // check for mfa setup
    } else if (user.challengeName === 'MFA_SETUP') {
      this.setState({ ...newState, displayModeOverride: 'ConfigureMFA' });

      // allow access
    } else {
      this.setState({ user });
    }
  };

  render() {
    const {
      displayIndex,
      displayModeOverride,
      errorMessage,
      initialized,
      loginDetails,
      user,
    } = this.state;

    // if we're not initialized
    if (!initialized) {
      return null;
    }

    // if no user is set
    if (!user) {
      return (
        <div className={styles.sectionContainer}>
          <ButtonGroup aria-label="Basic example">
            <Button disabled={displayIndex === 0} onClick={() => this.setDisplay(0)}>Log in</Button>
            <Button disabled={displayIndex === 1} onClick={() => this.setDisplay(1)}>Sign up</Button>
          </ButtonGroup>

          {!errorMessage ? null : <div className={styles.errorMessage}>{errorMessage}</div>}
          <DisplayResolver
            displayIndex={displayIndex}
            displayModeOverride={displayModeOverride}
            handleError={this.handleError}
            handleSuccess={this.handleSuccess}
            loginDetails={loginDetails}
          />
        </div>
      );
    }

    // return the authenticated display
    return this.props.children;
  }
}

Authenticator.propTypes = {
  children: PropTypes.any,
};

export default Authenticator;
