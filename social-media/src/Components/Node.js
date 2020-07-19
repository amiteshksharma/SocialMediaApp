import React, {useEffect, useState} from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { useParams } from "react-router-dom";
import '../Css/Node.css';

export default function Node(props) {

    const [name, setName] = useState({Name: ''});
    const [follower, setFollower] = useState({Following: false});

    useEffect(() => {
        fetch("http://localhost:5000/users/username", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: props.email
            })
        }).then(response => response.json())
        .then(data => {
            setName({Name: data.Name});
            fetch("http://localhost:5000/backend/followlist", {
                method: 'POST',
                body: JSON.stringify({
                    email: sessionStorage.getItem('Email'),
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                console.log(data);
                if(data.includes(props.user)) {
                    console.log(data);
                    setFollower({Follower: true});
                }
            }).catch(error => {
                console.log("Error");
            })
        })
    }, []);

    const followClick = () => {
        fetch(`http://localhost:5000/users/follow`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: sessionStorage.getItem('Email'),
                profileEmail: props.user
            })
        }).then(response => response.text()).then(data => {
                console.log(data);
                setFollower({Follower: data});
            })
    }

    const unfollowClick = () => {
        fetch(`http://localhost:5000/users/unfollow`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: sessionStorage.getItem('Email'),
                profileEmail: props.user
            })
        }).then(response => response.text()).then(data => {
                console.log(data);
                setFollower({Follower: false})
            })
    }
    
    return (
        <div className="node-container">
            <section className="information">
                <AccountCircleIcon color="primary" style={{fontSize: 'calc(2.5vw)'}} />
                <h2>{name.Name}</h2>
            </section>

            <section className="bio">
                <h4>This is a bio that I use for no reason and I am writing filing text to see how this looks and I don'tk now what to say</h4>
            </section>

            {props.following === 'ME' ? null : 
            <section className="followed-button-section">
                {(props.following !== 'No Followers' && props.following) || follower.Follower ? 
                <button className="followed-button-node" onClick={() => unfollowClick()}>
                    Followed <CheckIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="checked-icon" />
                </button> : 
                <button className="follow-button-node" onClick={() => followClick()}>
                    Follow <AddIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="plus-icon" />
                </button> }
            </section>}

        </div>
    )
}