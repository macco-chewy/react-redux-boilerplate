import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { Auth } from 'aws-amplify';

import styles from './styles.module.css';

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmPassword: '',
      loading: false,
      password: '',
    };

    this.firstInput = null;
  }

  reset = () => {
    this.setState({
      confirmPassword: '',
      loading: false,
      password: '',
    });
    if (this.firstInput) {
      this.firstInput.focus();
    }
  };

  handleChangePassword = async () => {
    await this.setState({ loading: true });

    const { password, confirmPassword } = this.state;
    const { handleError, handleSuccess, loginDetails } = this.props;
    let { user } = loginDetails;

    try {
      // check password
      if (!password) {
        throw new Error('Invalid password.');
      }

      // check confirmation
      if (!confirmPassword) {
        throw new Error('Please confirm password.');
      }

      // check passwords
      if (confirmPassword !== password) {
        throw new Error('Passwords do not match.');
      }

      user = await Auth.completeNewPassword(user, password, {});
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
      confirmPassword, loading, password,
    } = this.state;
    return (
      <div className={styles.sectionContainer}>
        <div>Password reset is required.  Please enter your new password below.</div>

        <Form>
          <Form.Group controlId="formGroupNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              ref={(c) => {
                this.firstInput = c;
              }}
              placeholder="p@ssw0d123"
              value={password}
              onChange={
                // update password state
                (e) => this.setState({ password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formGroupConfirmNewPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={
                // update password state
                (e) => this.setState({ confirmPassword: e.target.value })
              }
            />
          </Form.Group>
        </Form>

        <Button disabled={loading} onClick={this.handleChangePassword}>
          {loading ? 'Updating...' : 'Change password'}
        </Button>
      </div>
    );
  }
}

ChangePassword.propTypes = {
  handleError: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func.isRequired,
  loginDetails: PropTypes.object.isRequired,
};

export default ChangePassword;
