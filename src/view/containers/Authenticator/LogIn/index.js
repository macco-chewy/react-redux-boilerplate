import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { Button, Form } from 'react-bootstrap';

import styles from './styles.module.css';

class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      loading: false,
      password: '',
    };

    this.firstInput = null;
  }

  reset = () => {
    this.setState({
      email: '',
      loading: false,
      password: '',
    });
    if (this.firstInput) {
      this.firstInput.focus();
    }
  };

  handleLogIn = async () => {
    // set loading
    await this.setState({ loading: true });

    const { email, password } = this.state;
    const { handleError, handleSuccess } = this.props;

    try {
      if (!email) {
        throw new Error('Invalid email');
      }

      // check password
      if (!password) {
        throw new Error('Invalid password.');
      }

      const user = await Auth.signIn(email, password);
      handleSuccess(user, { email, password });
    } catch (e) {
      this.reset();
      handleError(e, { email, password });
    }
  };

  render() {
    const { email, loading, password } = this.state;
    // console.log(email);
    return (
      <div className={styles.formContainer}>

        <Form>
          <Form.Group controlId="formGroupLoginEmail">
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
          <Form.Group controlId="formGroupLoginPassword">
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
        </Form>

        <Button disabled={loading} onClick={this.handleLogIn}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </div>
    );
  }
}

LogIn.propTypes = {
  handleError: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func.isRequired,
};

export default LogIn;
