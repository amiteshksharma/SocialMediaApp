import React from 'react';
import '../Css/Post.css';
import Navigation from '../Components/Navigation';
import Favorite from '../Components/Favorite';
import { Media, Form, Button } from 'react-bootstrap';
import ProfileIcon from '../Images/download.png';

class Post extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Post: {
                name: '',
                post: {
                    Title: '',
                    Body: ''
                }
            },
            Comment: ''
        }

        this.enterComment = this.enterComment.bind(this);
    }

    componentDidMount() {
        const getEmail = this.props.match.params.email;
        const getTitle = this.props.match.params.title;

        fetch("http://localhost:5000/backend/getpost", {
            method: 'POST',
            body: JSON.stringify({
                email: getEmail,
                title: getTitle
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.json()).then(data => {
                console.log(data);
                this.setState({Post: data});
                console.log(data.post.Title)
                console.log(this.state.Post.post.Title );
            }).catch(error => {
                console.log("Error");
            }) 
    }

    enterComment() {
        const getEmail = this.props.match.params.email;
        const getTitle = this.props.match.params.title;

        fetch("http://localhost:5000/backend/comment", {
            method: 'POST',
            body: JSON.stringify({
                email: getEmail,
                title: getTitle,
                userEmail: sessionStorage.getItem('Email'),
                comments: this.state.Comment
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.text()).then(data => {
                console.log(data);
                this.setState({Comment: ''});
            }).catch(error => {
                console.log("Error");
            }) 
    }

    render() {
        return (
            <div className="postpage">
                <div className="post-container">
                    <section className="create-section">
                        <Navigation />
                    </section>

                    <section className="post-section">
                        <section className="post-style">
                            <div className="user-information-post">
                                <Media>
                                    <img
                                        width={64}
                                        height={64}
                                        className="mr-3"
                                        src={ProfileIcon}
                                        alt="Generic placeholder"
                                    />
                                    <Media.Body>
                                        <h3 className="userinfo-name">{this.state.Post.name}</h3>
                                    </Media.Body>
                                </Media>

                                <div className="fav-icon">
                                    <Favorite Title={this.props.match.params.title} Email={this.props.match.params.email} />
                                </div>
                            </div>

                            <div className="post-title">
                                <h1>{this.state.Post.post.Title}</h1>
                            </div>

                            <hr />

                            <div className="post-paragraph">
                                <h1>{this.state.Post.post.Body}</h1>
                            </div>
                        </section>
                    </section>

                    <section className='comment-section'>
                        <div className="comment-header">
                            <h1>Comments</h1>
                            <hr />
                        </div>

                        <div className="comment-box">
                            <Form.Control  placeHolder={"Enter comment..."}
                                value={this.state.Comment}
                                as="textarea" rows="4" 
                                style={{width: 'calc(18vw)', color: 'white', backgroundColor: 'rgb(21, 32, 43)', marginLeft: 'calc(1.2vw)'}} 
                                onChange={(e) => this.setState({Comment: e.target.value})}
                                maxLength="350"
                            /> 
                            <Button variant="dark" onClick={() => this.enterComment()}>Comment</Button>{' '}
                            <hr style={{width: 'calc(95%)'}}/> 
                        </div>

                        <div className="comment-tile">
                            <h1>Amitesh Sharma</h1>
                            <p>This is a great comment and I really think it ties into the what the post is saying</p>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default Post;