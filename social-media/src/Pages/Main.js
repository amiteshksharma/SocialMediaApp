import React from 'react'
import '../Css/Explore.css';
import Navigation from '../Components/Navigation';
import Tile from '../Components/Tile';
import Searchbar from '../Components/Searchbar';
import { withHistory } from 'react-router-dom';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Right: false,
            Post: [],
            MyLikes: [],
            Username: null,
            UsernamesList: [],
            isEmpty: false
        }

        this.createPost = this.createPost.bind(this);
    }

    componentDidMount() {
        Promise.all([
        fetch("http://localhost:5000/users/followerspost", {
            method: 'POST',
            body: JSON.stringify({
                currUser: sessionStorage.getItem('Email')
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(response => response.json()).then(data => {
            this.setState({ Post: data });
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
                this.setState({ MyLikes: data }, () => {
                    console.log(this.state.MyLikes);
                });

                setTimeout(() => {
                    this.setState({isEmpty: true})
                }, 1000);
            }).catch(error => {
                console.log("Error");
            }) 
        ]).then();
    }

    createPost() {
        this.props.history.push(`/create`);
    }

    displayUsernames(event) {
        let results = this.state.UsernamesList.filter((brand) => {
             return brand.toLowerCase().startsWith(event.query.toLowerCase());
        });
    
        this.setState({ Username: results });
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

                            {this.state.Post.length <= 7 && this.state.Post.length > 0 ? 
                                <section className="suggest-follow">
                                    <h1>You're feed looks a little empty, try adding users with the searchbar or through Explore</h1>
                                </section> 
                            : null}

                            {this.state.Post.length === 0 && this.state.isEmpty ? 
                                <section className="suggest-follow">
                                    <h1>You're feed is empty, try adding users with the searchbar or through Explore</h1>
                                </section> 
                            : null}

                        </div>
                    </section>

                    <section className="searchbar-section">
                        <Searchbar />
                    </section>
                </div>
            </div>
        )
    }
}

export default Main;