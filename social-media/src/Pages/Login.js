import React from 'react';
import '../Css/Login.css';
import Form from 'react-bootstrap/Form';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'; 

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      ModalShow: false,
      Email: '',
      Password: ''
    }

    this.callAPI = this.callAPI.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.loginRequest = this.loginRequest.bind(this);
  }
  callAPI = () => {
    fetch("http://localhost:5000/users")
        .then(res => res.json())
        .then(res => {
          this.setState({value: res[1].Body});
          console.log(res);
      });
  
  }

  loginRequest() {
    console.log(this.state.Email);
    console.log(this.state.Password);
    fetch("http://localhost:5000/users/login", {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.Email,
        password: this.state.Password
      }),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.text()).then(data => {
      console.log(data);    
      this.setState({value: data});
      let path = `/home`;
      this.props.history.push(path);
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
          <Modal.Title id="contained-modal-title-vcenter">
            Enter email to send password reset
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
            consectetur ac, vestibulum at eros.
          </p>
        </Modal.Body>
      </Modal>
    )
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
                  onClick={() => this.loginRequest()}>Login</Button>
                  {' '}
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 6, offset: 5}}>
                  <footer className="forgot-password"><button className="forgot-password-btn" onClick={() => this.setState({ ModalShow: true})}>Forgot Password?</button></footer>
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
