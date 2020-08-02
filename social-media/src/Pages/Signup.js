import React from 'react';
import '../Css/Login.css';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'; 
import { Redirect } from 'react-router';
import State from '../Components/StatesSignup';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Email: '',
      Password: '',
      State: 'AL',
      Loading: false,
      Validated: false,
      PasswordError: false,
      Redirect: false,
      Display: false,
      ErrorMessage: ''
    }

    this.signUpRequest = this.signUpRequest.bind(this);
    this.setUserState = this.setUserState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  signUpRequest(event) {
    console.log(event);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({Validated: true});

  }

  setUserState(value) {
    this.setState({State: value}, () => console.log(this.state.State));
  }

  handleSubmit(event) {
    console.log(event);
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({Validated: true});
    }

    if(this.state.Password.length < 6 && this.state.Password.length >= 0) {
      this.setState({PasswordError: true});
      return;
    } else {
      this.setState({PasswordError: false}); 
    }

    this.setState({Validated: true, Loading: true});
    fetch("/users/register", {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.Name,
        email: this.state.Email,
        password: this.state.Password,
        state: this.state.State
      }),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.json()).then(data => {
        if(data.Error) {
          event.preventDefault();
          this.setState({Display: true, Loading: false, ErrorMessage: data.Error});
        } else {
          this.setState({Loading: false, Redirect: true}) 
          sessionStorage.setItem('Email', data.Email);
          sessionStorage.setItem('Name', data.Name);
          this.props.history.push('/home');
        }
      }).catch(error => {
        console.log(error);
        this.setState({Loading: false});
      });
  }

  render() {
    return (
        <div className="Login">
          <div className="login-form">
            <Container>
              <Row>
                <Col md={{ span: 6, offset: 3}}>
                   <h2>SIGN UP</h2>
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 6, offset: 3 }}>
                  <Form noValidate validated={this.state.Validated} onSubmit={(event) => this.handleSubmit(event)}>
                    <Form.Group controlId="formGroupEmail">
                      <div><Form.Label>Name</Form.Label></div>
                      <Form.Control type="text" placeholder="Enter name" required
                      onChange={(e) => this.setState({ Name: e.target.value, Display: false})}
                      maxLength="35"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your name.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group controlId="formGroupEmail">
                      <div><Form.Label>State</Form.Label></div>
                      <State selected={this.setUserState} />
                      <Form.Control.Feedback type="invalid">
                        Please select your State
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formGroupEmail">
                      <div><Form.Label>Email address</Form.Label></div>
                      <Form.Control type="email" placeholder="Enter email" required 
                      onChange={(e) => this.setState({ Email: e.target.value, Display: false })}
                      maxLength="35"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your email.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formGroupPassword">
                      <div><Form.Label>Password</Form.Label></div>
                      <Form.Control type="password" placeholder="Password" required
                      maxLength="35" isInvalid={this.state.PasswordError}
                        onChange={(e) => this.setState({ Password: e.target.value, Display: false }, () => {
                          if(this.state.Password.length < 6 && this.state.Password.length >= 0) {
                            this.setState({PasswordError: true});
                          } else {
                            this.setState({PasswordError: false}); 
                          }
                        })}
                      />
                      
                      {this.state.PasswordError ? <Form.Control.Feedback type="invalid">
                        Make sure your password is 6 characters long
                      </Form.Control.Feedback> : <Form.Control.Feedback type="invalid">
                        Please type in your password.
                      </Form.Control.Feedback>}
                    </Form.Group>

                    <Button variant="primary" className="mt-2" size="lg" block type="submit"
                    >{this.state.Loading ? <Spinner animation="border" role="status"/> : "Sign up" }</Button>
                  </Form>
                </Col>
              </Row>

              {this.state.Display ? 
              <div className="error-display">
                <p>{this.state.ErrorMessage}</p>
              </div> : null}

              <Row>
                <Col md={{ span: 3, offset: 6}}>
                  <footer className="user-login"><button className="user-login-btn"
                  onClick={() => this.props.history.push('/')}>Already a user? Login</button></footer>
                </Col>
              </Row>

            </Container>
          </div>
        </div>
      );
  }
}

export default Login;
