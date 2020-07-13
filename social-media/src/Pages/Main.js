import React from 'react'
import '../Css/Main.css';
import Navigation from '../Components/Navigation';
import Tile from '../Components/Tile';
import { withHistory } from 'react-router-dom';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Right: false,
            Post: [],
            MyLikes: []
        }

        this.createPost = this.createPost.bind(this);
    }

    componentDidMount() {
        Promise.all([
        fetch("http://localhost:5000/backend/loadposts")
        .then(response => response.json()).then(data => {
            console.log(data);    
            this.setState({ Post: data });
        }).catch(error => {
            console.log("Error");
        }),   
        
        fetch("http://localhost:5000/backend/mylikes", {
            method: 'POST',
            body: JSON.stringify({
                email: sessionStorage.getItem('Email'),
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.text()).then(data => {
                this.setState({ MyLikes: data}, () => {
                    console.log(this.state.MyLikes);
                });
            }).catch(error => {
                console.log("Error");
            }) 
        ]) .then(console.log("hello"));
    }

    createPost() {
        this.props.history.push(`/create`);
    }

    render() {
        return (
            <div className="homepage">
                <Navigation />
                <div className="container-main">
                    <section className="create-section" onClick={() => this.createPost()}>
                        <h1>Create Post</h1>
                    </section>
                    
                    <section className="content-section">
                        <div className="content-div">
                            {this.state.Post.map(post => {
                                return (
                                    <Tile Title={post.Title} Body={post.Body} Name={post.Name} Email={post.Email} isLiked={this.state.MyLikes}/>
                                )
                            })}
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default Main;