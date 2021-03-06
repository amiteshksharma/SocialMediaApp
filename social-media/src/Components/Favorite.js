import React, { useState, useEffect } from 'react'; 
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import '../Css/Favorite.css';

export default function Favorite(props) {

    const [favorite, setFavorite] = useState({Favorite: true});
    const [likes, setLikes] = useState({Likes: 0});

    const checkIsLiked = () => {
        const myLikes = props.myLikes;
        if(myLikes === undefined) {
            return;
        }
        
        if(myLikes.includes(props.Title)) {
            setFavorite({ Favorite: false});
        }   
    }

    const loadTotalLikes = () => {
        fetch("/backend/loadlikes", {
        method: 'POST',
        body: JSON.stringify({
            email: props.Email,
            title: props.Title
        }),
        headers: {
            'Content-type': 'application/json'
        }
        }).then(response => response.json()).then(data => {
            setLikes({Likes: data.Likes});
            
        }).catch(error => {
            console.log("Error");
        });    
    }

    const like = () => {
        fetch("/backend/postlike", {
        method: 'POST',
        body: JSON.stringify({
            currentEmail: localStorage.getItem('Email'),
            email: props.Email,
            title: props.Title
        }),
        headers: {
            'Content-type': 'application/json'
        }
        }).then(response => response.text()).then(data => { 
            loadTotalLikes();
        }).catch(error => {
            console.log("Error");
        });
    }

    const unlike = () => {
        fetch("/backend/unlike", {
        method: 'POST',
        body: JSON.stringify({
            currEmail: localStorage.getItem('Email'),
            email: props.Email,
            title: props.Title
        }),
        headers: {
            'Content-type': 'application/json'
        }
        }).then(response => response.text()).then(data => {  
            loadTotalLikes();
        }).catch(error => {
            console.log("Error");
        });
    }

    useEffect(() => {
        checkIsLiked();
        loadTotalLikes();
    }, []);

    return (
        <section>
        <div className="display-likes">
            {likes.Likes <= 0 ? <p>{props.Likes}</p> : <p>{likes.Likes}</p>}
        </div>
        <div className="favorite-icon" onClick={() => setFavorite({Favorite: !favorite.Favorite})}>
            {favorite.Favorite ? 
                <FavoriteBorderIcon style={{fontSize: window.innerWidth <= 760 ? 'calc(7vw)' : 'calc(1.5vw)'}} className="favorite" onClick={like}/> 
                : 
                <FavoriteIcon style={{fontSize: window.innerWidth <= 760 ? 'calc(7vw)' : 'calc(1.5vw)'}} className="favorited" onClick={unlike}/> 
            }
        </div>
        </section>
    )
}