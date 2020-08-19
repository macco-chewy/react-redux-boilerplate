import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { Button, Form } from 'react-bootstrap';

import styles from './styles.module.css';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmPassword: '',
      email: '',
      loading: false,
      password: '',
    };

    this.firstInput = null;
  }

  reset = () => {
    this.setState({
      confirmPassword: '',
      email: '',
      loading: false,
      password: '',
    });
    if (this.firstInput) {
      this.firstInput.focus();
    }
  };

  handleSignUp = async () => {
    await this.setState({ loading: true });

    const { email, password, confirmPassword } = this.state;
    const { handleError, handleSuccess } = this.props;

    try {
      // check email
      if (!email) {
        throw new Error('Invalid email.');
      }

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

      // create the user
      await Auth.signUp({ username: email, password, attributes: { email } });

      // attempt to sign in
      const user = await Auth.signIn(email, password);
      handleSuccess(user, { email, password });
    } catch (e) {
      if (e.code) {
        // validation error
        this.reset();
      }
      handleError(e, { email, password });
    }
  };

  render() {
    const {
      confirmPassword, email, loading, password,
    } = this.state;
    return (
      <div className={styles.formContainer}>

        <Form>
          <Form.Group controlId="formGroupSignupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              ref={(c) => {
                this.firstInput = c;
              }}
              placeholder="my@email.com"
              value={email}
              onChange={
                // update email state
                (e) => this.setState({ email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formGroupSignupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="p@55w0rd"
              value={password}
              onChange={
                // update email state
                (e) => this.setState({ password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formGroupSignupConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="p@55w0rd"
              value={confirmPassword}
              onChange={
                // update email state
                (e) => this.setState({ confirmPassword: e.target.value })
              }
            />
          </Form.Group>

          <Button disabled={loading} onClick={this.handleSignUp}>
            {loading ? 'Signing up...' : 'Sign up'}
          </Button>
        </Form>
      </div>
    );
  }
}

SignUp.propTypes = {
  handleError: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func.isRequired,
};

export default SignUp;
