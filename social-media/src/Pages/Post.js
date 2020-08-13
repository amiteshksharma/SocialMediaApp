import React from 'react';
import '../Css/Post.css';
import Navigation from '../Components/Navigation';
import Favorite from '../Components/Favorite';
import { Media, Form, Button } from 'react-bootstrap';
import Drawer from '../Components/Drawer';
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
            Comment: '',
            CommentPost: []
        }

        this.enterComment = this.enterComment.bind(this);
        this.compareObjects = this.compareObjects.bind(this);
    }

    componentDidMount() {
        const getEmail = this.props.location.state.name;
        const getTitle = this.props.location.state.title;

        Promise.all([
            fetch("/backend/getpost", {
            method: 'POST',
            body: JSON.stringify({
                email: getEmail,
                title: getTitle
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.json()).then(data => {
                this.setState({Post: data});
            }).catch(error => {
                console.log("Error");
            }),

            fetch("/backend/getcomment", {
            method: 'POST',
            body: JSON.stringify({
                email: getEmail,
                title: getTitle
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.json()).then(data => {
                this.setState({CommentPost: data});
            }).catch(error => {
                console.log("Error");
            })
        ])
    }

    enterComment() {
        const getEmail = this.props.location.state.name;
        const getTitle = this.props.location.state.title;

        fetch("/backend/comment", {
            method: 'POST',
            body: JSON.stringify({
                email: getEmail,
                title: getTitle,
                userEmail: localStorage.getItem('Email'),
                comments: this.state.Comment
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.text()).then(data => {
                this.setState({Comment: ''});
                this.componentDidMount();
            }).catch(error => {
                console.log("Error");
            }) 
    }

    compareObjects(objOne, objTwo) {
        let objectsAreSame = true;
        for(let obj in objOne) {
            if(objOne[obj].Comment !== objTwo[obj].Comment) {
                objectsAreSame = false;
                break;
            }
        }
        return objectsAreSame;
    }

    render() {
        return (
            <div className="postpage">
                <div className="post-container">
                    {window.innerWidth <= 760 ? null : 
                    <section className="create-section">
                        <Navigation />
                    </section>}

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
                                    <Favorite Title={this.props.location.state.title} Email={this.props.location.state.name} />
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
                                style={{width: window.innerWidth <= 760 ? 'calc(78vw)': 'calc(18vw)', 
                                color: 'white', backgroundColor: 'rgb(21, 32, 43)', marginLeft: window.innerWidth <= 760 ? 'calc(10vw)': 'calc(1.2vw)',
                                marginBottom: window.innerWidth <= 760 ? 'calc(2vw)': null}} 
                                onChange={(e) => this.setState({Comment: e.target.value})}
                                maxLength="275"
                            /> 
                            <Button variant="dark" onClick={() => this.enterComment()}>Comment</Button>{' '}
                            <hr style={{width: 'calc(95%)'}}/> 
                        </div>

                        {this.state.CommentPost.map(comment => {
                            return (
                                <div className="comment-tile">
                                    <h1>{comment.Name}</h1>
                                    <p>{comment.Comment}</p>
                                </div>
                            )
                        })}
                    </section>
                </div>
                {window.innerWidth <= 760 ? <Drawer /> : null}
            </div>
        )
    }
}

export default Post;