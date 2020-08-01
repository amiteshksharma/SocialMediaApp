import React, {useEffect, useState} from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckIcon from '@material-ui/icons/Check';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import '../Css/Node.css';

export default function Node(props) {

    const [name, setName] = useState({Name: ''});
    const [email, setEmail] = useState({Email: ''});
    const [bio, setBio] = useState({Bio: ''})
    const [follower, setFollower] = useState({Following: false});
    const history = useHistory();

    useEffect(() => {
        fetch("/users/username", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: props.email
            })
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            setName({Name: data.Name});
            setBio({Bio: data.Bio});
            setEmail({Email: data.Email})
            fetch("/backend/followlist", {
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

        if(props.getName) {
            setName({Name: props.getName})
        }
    }, []);

    const followClick = () => {
        fetch(`/users/follow`, {
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
        fetch(`/users/unfollow`, {
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

    const profile = () => {
        history.push({
           pathname: `/profile/${name.Name}`,
           query: '?user=user',
           state: { name: email.Email}
        })
    }

    const button = () => {
        if(props.showFollow) {
            return;
        }

        const val = props.following === 'ME' ? null :
            <section className="followed-button-section">
                {(props.following !== 'No Followers' && props.following) || follower.Follower ? 
                <button className="followed-button-node" onClick={() => unfollowClick()}>
                    Followed <CheckIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="checked-icon" />
                </button> : 
                <button className="follow-button-node" onClick={() => followClick()}>
                    Follow <AddIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="plus-icon" />
                </button> }
            </section>   
            
        return val;
    }
    
    return (
        <div className="node-container">
            <section className="information" onClick={() => profile()}>
                <AccountCircleIcon color="primary" style={{fontSize: 'calc(2.5vw)'}} />
                <h2>{props.name ? props.name : name.Name}</h2>
            </section>

            <section className="bio" onClick={() => profile()}>
                <h4>{props.bio ? props.bio : bio.Bio}</h4>
            </section>

            {/* {props.following === 'ME' ? null : 
            <section className="followed-button-section">
                {(props.following !== 'No Followers' && props.following) || follower.Follower ? 
                <button className="followed-button-node" onClick={() => unfollowClick()}>
                    Followed <CheckIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="checked-icon" />
                </button> : 
                <button className="follow-button-node" onClick={() => followClick()}>
                    Follow <AddIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="plus-icon" />
                </button> }
            </section>} */}
            {button()}

        </div>
    )
}