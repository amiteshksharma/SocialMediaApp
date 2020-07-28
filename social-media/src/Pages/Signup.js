import React from 'react';
import '../Css/Login.css';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'; 

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Email: '',
      Password: '',
      Loading: false
    }

    this.signUpRequest = this.signUpRequest.bind(this);
  }

  signUpRequest() {
    console.log(this.state.Email);
    console.log(this.state.Password);
    console.log(this.state.Name);
    this.setState({ Loading: true});
    fetch("/users/register", {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.Name,
        email: this.state.Email,
        password: this.state.Password
      }),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.json()).then(data => {
        this.setState({Loading: false})
        console.log(data);    
        sessionStorage.setItem('Email', data.Email);
        sessionStorage.setItem('Uid', data.Uid);
        sessionStorage.setItem('Name', data.Name);
        this.props.history.push('/home');
        console.log("here"); 
      }).catch(error => {
        console.log(error);
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
                  <Form>
                    <Form.Group controlId="formGroupEmail">
                      <div><Form.Label>Name</Form.Label></div>
                      <Form.Control type="text" placeholder="Enter name" 
                      onChange={(e) => this.setState({ Name: e.target.value})}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupEmail">
                      <div><Form.Label>Email address</Form.Label></div>
                      <Form.Control type="email" placeholder="Enter email" 
                      onChange={(e) => this.setState({ Email: e.target.value})}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                      <div><Form.Label>Password</Form.Label></div>
                      <Form.Control type="password" placeholder="Password" 
                        onChange={(e) => this.setState({ Password: e.target.value })}
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 6, offset: 3}}>
                  <Button variant="primary" className="mt-2" size="lg" block
                  onClick={() => this.signUpRequest()}>{this.state.Loading ? <Spinner animation="border" role="status"/> : "Sign up" }</Button>
                  {' '}
                </Col>
              </Row>

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
