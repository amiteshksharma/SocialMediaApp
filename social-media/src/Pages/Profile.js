import React from 'react';
import '../Css/Profile.css';
import Background from '../Images/Background.jpg';
import Navigation from '../Components/Navigation';
import ProfileIcon from '../Images/download.png';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Tile from '../Components/Tile';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Posts: []
        }

        this.loadTiles = this.loadTiles.bind(this);
    }

    loadTiles() {
        this.state.Posts.map(post => {
            console.log(post.Title);
            return (
                <li>
                    <Tile Title={post.Title} Body={post.Body}/>
                </li>
            )
        })
    }

    componentDidMount() {
        const email = this.props.match.params.email
        fetch(`http://localhost:5000/backend/posts/${email}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            console.log(typeof data);
            this.setState({ Posts: data });    
        });
    }
    render() {
        return (
            <div className="profile">
            <Navigation />
                <div className="profile-layout">
                    <div className="border-line">
                        <section className="image-background">
                            <img src={Background} alt="Background" />
                            <div className="profile-icon">
                                <img src={ProfileIcon} width="160vw" height="150vh" alt="Profile icon" />
                            </div>
                        </section>

                        <section className="biography">
                            <div className="name">
                                <h2>Amitesh Sharma</h2>
                                <button className="follow-button">
                                    Follow <AddIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="plus-icon" />
                                </button>
                            </div>
                            
                            <div className="description">
                                <p>
                                Welcome to my homepage! this is where the magic happens, and I really am excited
                                To share my stories with the world here.    
                                </p>

                                <CreateIcon style={{marginLeft: 'calc(1vw)', cursor: 'pointer'}} className="edit-profile" onClick={() => console.log("Clicked")}/>
                            </div>

                            <div className="followers">
                                <h2>20 Followers</h2>
                                <span></span>
                                <h2>100 Following</h2>   
                            </div>
                        </section>

                        <section className="post-div">
                            <div className="post-display">
                                {this.state.Posts.map(post => {
                                    return (
                                        <Tile Title={post.Title} Body={post.Body}/>
                                    )
                                })}  
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;