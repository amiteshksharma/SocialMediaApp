import React from 'react';
import '../Css/Login.css';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Button } from 'react-bootstrap'; 

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }

    this.callAPI = this.callAPI.bind(this);
  }
  callAPI = () => {
    fetch("http://localhost:5000/backend")
        .then(res => res.text())
        .then(res => this.setState({ value: res }));
  
  }

  componentDidMount() {
    this.callAPI(); 
  }

  render() {
    return (
        <div className="Login">
        {this.state.value}
          <div className="login-form">
            <Container>
              <Row>
                <Col md={{ span: 6, offset: 3}}>
                  <h2>LOGIN</h2>
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 6, offset: 3 }}>
                  <Form>
                    <Form.Group controlId="formGroupEmail">
                      <div><Form.Label>Email address</Form.Label></div>
                      <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                      <div><Form.Label>Password</Form.Label></div>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 6, offset: 3}}>
                  <Button as="input" type="button" value="Login" className="w-100 mt-3"/>{' '}
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 6, offset: 5}}>
                  <footer className="forgot-password">Forgot Password?</footer>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      );
  }
}

export default Login;
