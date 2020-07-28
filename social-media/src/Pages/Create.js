import React from 'react';
import '../Css/Create.css';
import { Form, Button, Spinner } from 'react-bootstrap';
class Create extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Title: '',
            Body: '',
            Loading: false,
            TitleError: 'white',
            BodyError: 'white',
            isTitleError: false,
            isBodyError: false
        }

        this.submitPost = this.submitPost.bind(this);
        this.renderErrorMessage = this.renderErrorMessage.bind(this);
    }

    submitPost() {
        this.setState({Loading: true});
        let isError = false;
        if(this.state.Title === '') {
            console.log(this.state.Title);
            this.setState({TitleError: "red", isTitleError: true});
            isError = true;
        }
        
        if(this.state.Body === '') {
            this.setState({BodyError: "red", isBodyError: true, Loading: false});
            return;
        }

        if(isError) {
            this.setState({Loading: false})
            return;
        }

        fetch("/backend/create", {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.Title,
                body: this.state.Body
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.text()).then(data => {
                this.setState({Loading: false});
                this.props.history.push('/home');
            });
    }

    renderErrorMessage() {
        if(this.state.isTitleError === false && 
            this.state.isBodyError === false) {
            console.log("here");
            return;
        }

        let titleErr = ''
        let bodyErr = '';

        if(this.state.isTitleError) {
            titleErr = 'Please fill out the title textfield'
        }

        if(this.state.isBodyError) {
            bodyErr = 'Please fill out the body textfield'
        }

        return (
            <div className="error-div">
                <h1>{titleErr}</h1>
                <h1>{bodyErr}</h1>
            </div>
        )
    }

    render() {
        return (
            <section className="post">
            {this.renderErrorMessage()}
                <div className="post-body">
                    <div className="title-create" style={{color: this.state.TitleError}}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Title</Form.Label>
                            <Form.Control as="textarea" rows="1" 
                                onChange={(e) => this.setState({Title: e.target.value, TitleError: 'white', isTitleError: false})}
                                maxLength={"70"}
                            />
                        </Form.Group>
                    </div>

                    <div className="body-create" style={{color: this.state.BodyError}}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Your Post</Form.Label>
                            <Form.Control as="textarea" rows="14" 
                                onChange={(e) => this.setState({Body: e.target.value, BodyError: 'white', isBodyError: false})}/>
                        </Form.Group>
                    </div>

                    <div className="create-button">
                        <Button className="w-50" onClick={() => this.submitPost()} size="lg">
                            {this.state.Loading ? <Spinner animation="border" variant="light" /> : "Create"}
                        </Button>
                    </div>
                </div>
            </section>
        )
    }
}

export default Create;