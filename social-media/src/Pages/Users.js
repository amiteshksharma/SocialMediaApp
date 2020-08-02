import React from 'react';
import Navigation from '../Components/Navigation';
import Node from '../Components/Node';
import Searchbar from '../Components/Searchbar';
import '../Css/Users.css';

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Email: this.props.location.state.name,
            Name: this.props.location.state.user,
            Followers: [],
            Following: [],
            UserFollowing: []
        }
    }

    componentDidMount() {
        Promise.all([
            fetch("/backend/loadprofile", {
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

            fetch("/backend/loadprofile", {
                method: 'POST',
                body: JSON.stringify({
                    email: sessionStorage.getItem('Email'),
                    follow: 'following'
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                console.log("Here: ", data);
                this.setState({UserFollowing: data});
            }).catch(error => {
                console.log("Error");
            }),

            fetch("/backend/loadprofile", {
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
        console.log(this.props.location);
        console.log(this.state.Email);
        return (
            <div className="users">
                <div className="users-layout">
                    <section className="create-section">
                        <Navigation eventKey="4" />
                    </section>

                    <div className="profile-goback">
                        <button onClick={() => this.props.history.push({
                            pathname: `/profile/${this.state.Name}`,
                            search: '?profile=profile',
                            state: { name: this.state.Email}
                        })}> 
                            <i className="pi pi-caret-left" style={{fontSize: 'calc(1.1rem)', paddingRight: 'calc(0.3vw)'}}></i>Return to profile
                        </button>
                    </div>

                    <div className="border-line">
                        <section className="user-section">
                            <div className="user-tab">
                                <button onClick={() => this.props.history.push(`/profile/${this.state.Name}/followers`)}>Followers</button>
                                <button onClick={() => this.props.history.push(`/profile/${this.state.Name}/following`)}>Following</button>
                            </div>
                        </section>
                        <section className="user-div">
                            <div className="user-display">
                                {this.props.match.params.follow === 'followers' ? 
                                    this.state.Followers.map(follower => {
                                        let isFollowing = false;
                                        if(follower === sessionStorage.getItem('Email')) {
                                            isFollowing = "ME"
                                        } else if(this.state.Followers .length === 0) {
                                            isFollowing = "No Followers";
                                        } else if(this.state.Followers.includes(follower)) {
                                            isFollowing = true;
                                        }

                                        return <Node user={follower} email={follower} following={isFollowing}/> }) 
                                    : 
                                    
                                    this.state.Following.map(following => {
                                        let isFollowing = false;
                                        if(following === sessionStorage.getItem('Email')) {
                                            isFollowing = "ME"
                                        } else if(this.state.Followers.length === 0) {
                                            isFollowing = "No Followers";
                                        } else if(this.state.UserFollowing.includes(following)) {
                                            isFollowing = true;
                                        }
                                        return ( <Node user={this.state.Email} email={following} following={isFollowing} /> )
                                }) }
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