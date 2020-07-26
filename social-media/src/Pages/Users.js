import React from 'react';
import Navigation from '../Components/Navigation';
import Node from '../Components/Node';
import Searchbar from '../Components/Searchbar';
import '../Css/Users.css';

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Email: this.props.match.params.email,
            Followers: [],
            Following: []
        }
    }

    componentDidMount() {
        Promise.all([
            fetch("http://localhost:5000/backend/loadprofile", {
                method: 'POST',
                body: JSON.stringify({
                    email: this.state.Email,
                    follow: 'following'
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                console.log(data);
                this.setState({Following: data});
            }).catch(error => {
                console.log("Error");
            }),

            fetch("http://localhost:5000/backend/loadprofile", {
                method: 'POST',
                body: JSON.stringify({
                    email: this.state.Email,
                    follow: 'followers'
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                console.log(data);
                this.setState({Followers: data});
            }).catch(error => {
                console.log("Error");
            })
        ])
    }

    render() {
        console.log(this.props.match.params.follow);
        console.log(this.state.Following);
        return (
            <div className="users">
                <div className="users-layout">
                    <section className="create-section">
                        <Navigation eventKey="4" />
                    </section>

                    <div className="profile-goback">
                        <button onClick={() => this.props.history.push(`/profile/${this.props.match.params.email}`)}> 
                            <i className="pi pi-caret-left" style={{fontSize: 'calc(1.1rem)', paddingRight: 'calc(0.3vw)'}}></i>Return to profile
                        </button>
                    </div>

                    <div className="border-line">
                        <section className="user-section">
                            <div className="user-tab">
                                <button onClick={() => this.props.history.push(`/profile/${this.state.Email}/followers`)}>Followers</button>
                                <button onClick={() => this.props.history.push(`/profile/${this.state.Email}/following`)}>Following</button>
                            </div>
                        </section>
                        <section className="user-div">
                            <div className="user-display">
                                {this.props.match.params.follow === 'followers' ? 
                                    this.state.Followers.map(follower => {
                                        let isFollowing = false;
                                        if(follower === sessionStorage.getItem('Email')) {
                                            isFollowing = "ME"
                                        } else if(this.state.Following.length === 0) {
                                            isFollowing = "No Followers";
                                        } else if(this.state.Following.includes(follower)) {
                                            isFollowing = true;
                                        }

                                        return <Node user={follower} email={follower} following={isFollowing}/> }) 
                                    : 
                                    
                                    this.state.Following.map(following => (
                                        <Node user={this.state.Email} email={following} following={true} />
                                    )) }
                            </div>
                        </section>
                    </div>

                    <section className="searchbar-section">
                        <Searchbar />
                    </section>
                </div>
            </div>
        )
    }
} 

export default Users;