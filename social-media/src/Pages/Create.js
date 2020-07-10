import React from 'react';
import '../Css/Create.css';
import { Form, Button } from 'react-bootstrap';
class Create extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Title: '',
            Body: '',
            value: ''
        }

        this.submitPost = this.submitPost.bind(this);
    }

    submitPost() {
        fetch("http://localhost:5000/backend/create", {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.Title,
                body: this.state.Body
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.text()).then(data => {
            console.log(data);    
            this.setState({value: data});
            });
    }
    render() {
        return (
            <section className="post">
            {this.state.value}
                <div className="post-body">
                    <div className="title">
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Title</Form.Label>
                            <Form.Control as="textarea" rows="1" onChange={(e) => this.setState({Title: e.target.value})}/>
                        </Form.Group>
                    </div>

                    <div className="body">
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Body</Form.Label>
                            <Form.Control as="textarea" rows="13" onChange={(e) => this.setState({Body: e.target.value})}/>
                        </Form.Group>
                    </div>

                    <div className="create-button">
                        <Button as="input" type="button" value="Create" onClick={() => this.submitPost()}/>{' '}
                    </div>
                </div>
            </section>
        )
    }
}

export default Create;