import React from 'react';
import '../Css/Profile.css';
import Background from '../Images/Background.jpg';
import Navigation from '../Components/Navigation';
import Searchbar from '../Components/Searchbar';
import SimpleMenu from '../Components/MenuItem';
import ProfileIcon from '../Images/download.png';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Tile from '../Components/Tile';
import { Form } from 'react-bootstrap';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Posts: [],
            Email: this.props.match.params.email,
            MyLikes: [],
            Follower: false,
            Following: 0,
            Followers: 0,
            ReadOnly: true,
            Bio: '',
            Profile: {},
            Anchor: null
        }

        this.followClick = this.followClick.bind(this);
        this.unfollowClick = this.unfollowClick.bind(this);
        this.redirectFollows = this.redirectFollows.bind(this);
        this.saveBio = this.saveBio.bind(this);
    }

    followClick() {
        fetch(`http://localhost:5000/users/follow`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: sessionStorage.getItem('Email'),
                profileEmail: this.state.Email
            })
        }).then(response => response.text()).then(data => {
                console.log(data);
                this.setState({Follower: data})
            })
    }

    unfollowClick() {
        fetch(`http://localhost:5000/users/unfollow`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: sessionStorage.getItem('Email'),
                profileEmail: this.state.Email
            })
        }).then(response => response.text()).then(data => {
                console.log(data);
                this.setState({Follower: false})
            })
    }

    componentDidMount() {
        const email = this.props.match.params.email
        Promise.all([
            fetch(`http://localhost:5000/backend/posts/${email}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
                }).then(response => response.json()).then(data => {
                console.log(data);
                console.log(typeof data);
                this.setState({ Posts: data });    
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
            }),

            fetch("http://localhost:5000/settings/information", {
                method: 'POST',
                body: JSON.stringify({
                    email: this.state.Email,
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                this.setState({Profile: data});
            }).catch(error => {
                    console.log("Error");
            }),

            fetch("http://localhost:5000/backend/followlist", {
                method: 'POST',
                body: JSON.stringify({
                    email: sessionStorage.getItem('Email'),
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                if(data.includes(this.state.Email)) {
                    console.log(data);
                    this.setState({Follower: true});
                }
            }).catch(error => {
                console.log("Error");
            }),

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
                this.setState({Following: data.length});
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
                this.setState({Followers: data.length});
            }).catch(error => {
                console.log("Error");
            })
        ])
    }

    redirectFollows(tab) {
        if(tab === 'followers') {
            console.log("here");
            this.props.history.push(`/profile/${this.state.Email}/followers`);
        } else {
            this.props.history.push(`/profile/${this.state.Email}/following`);    
        }
    }

    saveBio(e) {
        console.log(this.state.ReadOnly);
        this.setState({ReadOnly: !this.state.ReadOnly}, () => {
            if(this.state.ReadOnly) {
                fetch("http://localhost:5000/settings/bio", {
                method: 'POST',
                body: JSON.stringify({
                    email: this.state.Email,
                    bio: this.state.Bio
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                console.log(data);
            }).catch(error => {
                console.log("Error");
            })
            }
        })   
    }

    render() {
        const getCurrentEmail = sessionStorage.getItem("Email");
        return (
            <div className="profile">
                <div className="profile-layout">
                    <section className="profile-navbar">
                        <Navigation eventKey="4" />
                    </section>

                    <div className="border-line-profile">
                        <section className="image-background">
                            <img src={Background} alt="Background" />
                            <div className="profile-icon">
                                <img src={ProfileIcon} width="160vw" height="150vh" alt="Profile icon" />
                            </div>
                        </section>

                        <section className="biography">
                            <div className="profile-name">
                                <h2>{this.state.Profile.Name}</h2>
                                {this.state.Email !== sessionStorage.getItem('Email') ? null : 
                                <CreateIcon style={{marginLeft: 'calc(1vw)', cursor: 'pointer'}} className="edit-profile" 
                                onClick={(e) => this.saveBio()}/>}
                                {this.state.Email === getCurrentEmail ? 
                                    <div className="menu-icon">
                                        <SimpleMenu />
                                    </div> : 
                                    (this.state.Follower ?
                                        <button className="followed-button" onClick={() => this.unfollowClick()}>
                                            Followed <CheckIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="checked-icon" />
                                        </button> 
                                        : 
                                        <button className="follow-button" onClick={() => this.followClick()}>
                                            Follow <AddIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="plus-icon" />
                                        </button> 
                                    )  
                                }
                            </div>
                            
                            <div className="description">
                                <p>
                                    <Form.Control plaintext={this.state.ReadOnly} readOnly={this.state.ReadOnly} defaultValue={this.state.Profile.Bio} 
                                        as="textarea" rows="4" style={{width: 'calc(20vw)', color: 'white', backgroundColor: 'rgb(21, 32, 43)'}} 
                                        onChange={(e) => this.setState({Bio: e.target.value})}
                                        maxLength="210"
                                    />  
                                </p>
                            </div>

                            <div className="followers">
                                <h2 onClick={() => this.redirectFollows("followers")}>{this.state.Followers} Followers</h2>
                                <span>|</span>
                                <h2 onClick={() => this.redirectFollows("following")}>{this.state.Following} Following</h2>   
                            </div>
                        </section>

                        <section className="post-div">
                            <div className="post-display">
                                {this.state.Posts.map(post => {
                                    return (
                                        <Tile Title={post.Title} Body={post.Body} Name={post.Name} isLiked={this.state.MyLikes} Email={post.Email}/>
                                    )
                                })}  
                            </div>
                        </section>
                    </div>

                    <section className="searchbar-profile">
                        <Searchbar />
                    </section>
                </div>
            </div>
        )
    }
}

export default Profile;