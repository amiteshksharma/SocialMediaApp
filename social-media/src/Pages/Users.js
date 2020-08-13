import React from 'react';
import Navigation from '../Components/Navigation';
import Node from '../Components/Node';
import Searchbar from '../Components/Searchbar';
import Drawer from '../Components/Drawer';
import '../Css/Users.css';

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Email: '',
            Name: '',
            Followers: [],
            Following: [],
            UserFollowing: []
        }
        
        this.setData = this.setData.bind(this);
        this.fetchAllData = this.fetchAllData.bind(this);
    }

    setData() {
        if(this.props.location.state) {
            localStorage.setItem('profileEmail', JSON.stringify(this.props.location.state.name));
            localStorage.setItem('profileName', JSON.stringify(this.props.location.state.user));
            this.setState({Name: this.props.location.state.user, Email: this.props.location.state.name}, () => {
                this.fetchAllData();
            });
        } else {
            const getEmail = localStorage.getItem('profileEmail');
            const getName = localStorage.getItem('profileName');
            this.setState({Name: JSON.parse(getName), Email: JSON.parse(getEmail)}, () => {
                this.fetchAllData();
            });
        }
    }

    fetchAllData() {
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
                this.setState({Following: data});
            }).catch(error => {
                console.log("Error");
            }),

            fetch("/backend/loadprofile", {
                method: 'POST',
                body: JSON.stringify({
                    email: localStorage.getItem('Email'),
                    follow: 'following'
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
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
                this.setState({Followers: data});
            }).catch(error => {
                console.log("Error");
            })
        ])
    }

    componentDidMount() {
        this.setData();
    }

    render() {
        return (
            <div className="users">
                <div className="users-layout">
                    {window.innerWidth <= 760 ? null : 
                    <section className="create-section">
                        <Navigation eventKey="4" />
                    </section>}

                    {window.innerWidth <= 760 ? null : 
                    <div className="profile-goback">
                        <button onClick={() => this.props.history.push({
                            pathname: `/profile/${this.state.Name}`,
                            search: '?profile=profile',
                            state: { name: this.state.Email}
                        })}> 
                            <i className="pi pi-caret-left" style={{fontSize: 'calc(1.1rem)', paddingRight: 'calc(0.3vw)'}}></i>Return to profile
                        </button>
                    </div>}

                    <div className="border-line">
                        <section className="user-section">
                            <div className="user-tab">
                                <button onClick={() => {
                                    this.props.history.push(`/profile/${this.state.Name}/followers`);
                                    this.setState({Followers: []}, () => this.componentDidMount());
                                    }}>Followers</button>
                                <button onClick={() => {
                                    this.props.history.push(`/profile/${this.state.Name}/following`);
                                    this.setState({Following: []}, () => this.componentDidMount());
                                    }}>Following</button>
                            </div>
                        </section>
                        <section className="user-div">
                            <div className="user-display">
                                {this.props.match.params.follow === 'followers' ? 
                                    this.state.Followers.map(follower => {
                                        let isFollowing = false;
                                        if(follower === localStorage.getItem('Email')) {
                                            isFollowing = "ME"
                                        } else if(this.state.Followers.length === 0) {
                                            isFollowing = "No Followers";
                                        } else if(this.state.UserFollowing.includes(follower)) {
                                            isFollowing = true;
                                        }

                                        return <Node user={follower} email={follower} following={isFollowing}/> }) 
                                    : 
                                    
                                    this.state.Following.map(following => {
                                        let isFollowing = false;
                                        if(following === localStorage.getItem('Email')) {
                                            isFollowing = "ME"
                                        } else if(this.state.Followers.length === 0) {
                                            isFollowing = "No Followers";
                                        } else if(this.state.UserFollowing.includes(following)) {
                                            isFollowing = true;
                                        }
                                        return ( <Node user={following} email={following} following={isFollowing} /> )
                                }) }
                            </div>
                        </section>
                    </div>

                    {window.innerWidth ? null : 
                    <section className="searchbar-section">
                        <Searchbar />
                    </section>}

                    {window.innerWidth <= 760 ? <Drawer /> : null}
                </div>
            </div>
        )
    }
} 

export default Users;