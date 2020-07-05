import React from 'react';
import '../Css/Profile.css';
import Image from '../Images/Background.jpg';
import Navigation from '../Components/Navigation';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Tile from '../Components/Tile';
import { Button } from 'react-bootstrap';

class Profile extends React.Component {
    render() {
        return (
            <div className="profile">
            <Navigation />
                <div className="profile-layout">
                    <div className="border-line">
                        <section className="image-background">
                            <img src={Image} alt="Background" />
                            <div className="icon-div">
                                <AccountCircleIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="profile-icon"/> 
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

                                <CreateIcon style={{marginLeft: 'calc(1vw)', cursor: 'pointer'}} onClick={() => console.log("Clicked")}/>
                            </div>

                            <div className="followers">
                                <h2>20 Followers</h2>
                                <span></span>
                                <h2>100 Following</h2>   
                            </div>
                        </section>

                        <section className="post-div">
                            <div className="post-display">
                                <Tile />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;