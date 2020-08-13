import React from 'react';
import '../Css/Login.css';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'; 

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ModalShow: false,
      Email: '',
      Password: '',
      Validation: false,
      resetEmail: '',
      Sent: false
    }

    this.displayModal = this.displayModal.bind(this);
    this.loginRequest = this.loginRequest.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  loginRequest() {
    fetch("/users/login", {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.Email,
        password: this.state.Password
      }),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.json()).then(data => {
        if(data) {
          localStorage.setItem('Email', data.Email);
          localStorage.setItem('Name', data.Name);
          localStorage.setItem('State', data.State);
          this.props.history.push('/home');
        } else {
          this.setState({Validation: true});
        }
      }).catch(error => {
        console.log("Error");
      });
  }

  displayModal() {
    return (
      <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={this.state.ModalShow}
      onHide={() => this.setState({ ModalShow: false})}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            {this.state.Sent ? "Email sent!" : "Enter email to send password reset"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => this.setState({resetEmail: e.target.value})} />
            </Form.Group>
          </Form>
          <Modal.Footer>
          <Button variant="primary" onClick={() => this.resetPassword()}>
             Reset!
          </Button>
        </Modal.Footer>  
        </Modal.Body>
      </Modal>
    )
  }

  resetPassword() {
    if(this.state.resetEmail === '') {
      return;
    }

    fetch("/settings/reset", {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.resetEmail
      }),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.text()).then(data => {
        if(data) {
          this.setState({Sent: true});
          setTimeout(() => {
            this.setState({ModalShow: false, Sent: false});
          }, 1500);
        }
      }).catch(error => {
        console.log("Error");
      });
  }

  render() {
    return (
        <div className="Login">
          <div className="login-form">
            <Container>
              <Row>
                <Col md={{ span: 6, offset: 3}}>
                  <h2 style={{fontFamily: 'Lato, sans-serif', fontWeight: '600'}}>Login</h2>
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 6, offset: 3 }}>
                  <Form >
                    <Form.Group controlId="formGroupEmail">
                      <div><Form.Label style={{fontFamily: 'Merriweather, serif'}}>Email address</Form.Label></div>
                      <Form.Control type="email" placeholder="Enter email" isInvalid={this.state.Validation}
                      onChange={(e) => this.setState({ Email: e.target.value, Validation: false })}/>
                      <Form.Control.Feedback type="invalid">
                        Incorrect Email address
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                      <div><Form.Label style={{fontFamily: 'Merriweather, serif'}}>Password</Form.Label></div>
                      <Form.Control type="password" placeholder="Password" isInvalid={this.state.Validation}
                        onChange={(e) => this.setState({ Password: e.target.value, Validation: false })}
                      />
                      <Form.Control.Feedback type="invalid">
                        Incorrect Password
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 6, offset: 3}}>
                  <Button variant="primary" className="mt-2" size="lg" block
                  onClick={() => this.loginRequest()} style={{fontFamily: 'Lato, san-serif'}}>Login</Button>
                  {' '}
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 3, offset: 3}} xs={{span: 2, offset: 0}}>
                  <footer className="user-register"><button className="user-register-btn"
                  onClick={() => this.props.history.push('/signup')}>Not a user? Sign up</button></footer>
                </Col>
                
                <Col md={{ span: 3, offset: 1}} xs={{span: 2, offset: 6}}>
                  <footer className="forgot-password">
                    <button className="forgot-password-btn" onClick={() => this.setState({ ModalShow: true})}>Forgot Password?</button>
                  </footer>
                </Col>
              </Row>
            </Container>
          </div>

          {this.state.ModalShow ? this.displayModal() : null}
        </div>
      );
  }
}

export default Login;
