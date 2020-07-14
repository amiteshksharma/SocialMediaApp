import React, { useState, useEffect } from 'react';
import '../Css/Tile.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useHistory } from 'react-router-dom';

export default function Tile(props) {
    const [favorite, setFavorite] = useState({Favorite: true});
    const [likes, setLikes] = useState({Likes: 0});
    const history = useHistory();

    const checkIsLiked = () => {
        if(props.isLiked === undefined) {
            return;
        }
        
        if(props.isLiked.includes(props.Title)) {
            setFavorite({ Favorite: false});
        }   
    }

    const routeChange = () => { 
        let path = `/profile/${props.Name}`; 
        history.push(path);
    }

    const like = () => {
        fetch("http://localhost:5000/backend/postlike", {
        method: 'POST',
        body: JSON.stringify({
            currentEmail: sessionStorage.getItem('Email'),
            email: props.Email,
            title: props.Title
        }),
        headers: {
            'Content-type': 'application/json'
        }
        }).then(response => response.text()).then(data => {
            console.log(data);    
            loadTotalLikes();
            console.log("here");
        }).catch(error => {
            console.log("Error");
        });
    }

    const loadTotalLikes = () => {
        fetch("http://localhost:5000/backend/loadlikes", {
        method: 'POST',
        body: JSON.stringify({
            email: props.Email,
            title: props.Title
        }),
        headers: {
            'Content-type': 'application/json'
        }
        }).then(response => response.json()).then(data => {
            console.log(data); 
            setLikes({Likes: data.Likes});
            
        }).catch(error => {
            console.log("Error");
        });    
    }

    const unlike = () => {
        console.log("here");
        fetch("http://localhost:5000/backend/unlike", {
        method: 'POST',
        body: JSON.stringify({
            currEmail: sessionStorage.getItem('Email'),
            email: props.Email,
            title: props.Title
        }),
        headers: {
            'Content-type': 'application/json'
        }
        }).then(response => response.text()).then(data => {
            console.log(data);    
            loadTotalLikes();
            console.log("here");
        }).catch(error => {
            console.log("Error");
        });
    }

    useEffect(() => {
        checkIsLiked();
        loadTotalLikes();
    }, []);
    
    return (
        <div className="tile-container">
            <section className="tile-author">
                <AccountCircleIcon color="primary" style={{fontSize: 'calc(2vw)'}} onClick={routeChange} /> 
                <h6 className="profile-link"><a href={`/profile/${props.Name}`}>{props.Name}</a></h6>
                <div className="display-likes">
                    {likes.Likes <= 0 ? <p>{props.Likes}</p> : <p>{likes.Likes}</p>}
                </div>
                <div className="favorite-icon" onClick={() => setFavorite({Favorite: !favorite.Favorite})}>
                    {favorite.Favorite ? <FavoriteBorderIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="favorite" onClick={like}/> 
                    : <FavoriteIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="favorited" onClick={unlike}/> }
                </div>
            </section>

            <section className="title-section">
                <div className="title">
                    <h3>{props.Title}</h3>
                </div>
            </section>

            <section className="summary-section">
                <div className="summary">
                    <h3>{props.Body}</h3>
                </div>
            </section>
        </div>
    )
}