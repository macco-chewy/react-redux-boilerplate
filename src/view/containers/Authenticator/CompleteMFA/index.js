import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { Button, Form } from 'react-bootstrap';

import styles from './styles.module.css';

class CompleteMFA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      loading: false,
    };

    this.firstInput = null;
  }

  reset = () => {
    this.setState({
      code: '',
      loading: false,
    });
    if (this.firstInput) {
      this.firstInput.focus();
    }
  };

  handleCompleteMFA = async () => {
    await this.setState({ loading: true });

    const { code } = this.state;
    const { handleError, handleSuccess, loginDetails } = this.props;
    let { user } = loginDetails;

    try {
      // check password
      if (!code || code.length < 6) {
        throw new Error('Invalid password.');
      }

      user = await Auth.confirmSignIn(user, code, 'SMS_MFA');
      delete loginDetails.user;
      handleSuccess(user, loginDetails);
    } catch (e) {
      if (e.code) {
        // validation error
        this.reset();
      }
      handleError(e);
    }
  };

  render() {
    const {
      code, loading,
    } = this.state;
    const {
      user,
    } = this.props.loginDetails;

    return (
      <div className={styles.sectionContainer}>
        <div>
          MFA is required.  Please enter the code sent to
          {user.challengeParam.CODE_DELIVERY_DESTINATION}
          below.
        </div>

        <Form>
          <Form.Group controlId="formGroupNewPassword">
            <Form.Label>MFA Code</Form.Label>
            <Form.Control
              type="number"
              ref={(c) => {
                this.firstInput = c;
              }}
              placeholder="111111"
              value={code}
              onChange={
                // update email state
                (value) => this.setState({ code: value })
              }
            />
          </Form.Group>
        </Form>

        <Button disabled={loading} onClick={this.handleCompleteMFA}>
          {loading ? 'Confirming...' : 'Confirm'}
        </Button>
      </div>
    );
  }
}

CompleteMFA.propTypes = {
  handleError: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func.isRequired,
  loginDetails: PropTypes.object.isRequired,
};

export default CompleteMFA;
