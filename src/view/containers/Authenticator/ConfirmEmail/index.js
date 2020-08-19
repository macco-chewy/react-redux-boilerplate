import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { Button, Form } from 'react-bootstrap';

import styles from './styles.module.css';

class ConfirmEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmationCode: '',
      loading: false,
    };

    this.firstInput = null;
  }

  reset = () => {
    this.setState({
      confirmationCode: '',
      loading: false,
    });
    if (this.firstInput) {
      this.firstInput.focus();
    }
  };

  handleConfirmationCode = async () => {
    await this.setState({ loading: true });

    const { confirmationCode } = this.state;
    const { handleError, handleSuccess, loginDetails } = this.props;
    const { email, password } = loginDetails;

    try {
      // check confirmationCode
      if (!confirmationCode) {
        throw new Error('Invalid code.');
      }

      const result = await Auth.confirmSignUp(email, confirmationCode, {});

      if (result.toUpperCase() !== 'SUCCESS') {
        throw new Error('Unhandled confirmation error.  Please try again');
      }

      const user = await Auth.signIn(email, password);
      handleSuccess(user, { email, password });
    } catch (e) {
      if (e.code) {
        // validation error
        this.reset();
      }
      handleError(e);
    }
  };

  render() {
    const { confirmationCode, loading } = this.state;
    return (
      <div className={styles.sectionContainer}>
        <div>
          You must confirm your email address. We have sent you a confirmation code to the email
          address you provided. Please enter the confirmation code below.
        </div>
        <div className={styles.formContainer}>

          <Form>
            <Form.Group controlId="formGroupNewPassword">
              <Form.Label>Confirmation Code</Form.Label>
              <Form.Control
                type="number"
                ref={(c) => {
                  this.firstInput = c;
                }}
                placeholder="111111"
                value={confirmationCode}
                onChange={
                  // update confirmationCode state
                  (e) => this.setState({ confirmationCode: e.target.value })
                }
              />
            </Form.Group>
          </Form>

          <Button disabled={loading} onClick={this.handleConfirmationCode}>
            {loading ? 'Confirming...' : 'Confirm'}
          </Button>
        </div>
      </div>
    );
  }
}

ConfirmEmail.propTypes = {
  handleError: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func.isRequired,
  loginDetails: PropTypes.object.isRequired,
};

export default ConfirmEmail;
