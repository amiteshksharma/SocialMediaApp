import React, { useState, useEffect } from 'react'; 
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import '../Css/Favorite.css';

export default function Favorite(props) {

    const [favorite, setFavorite] = useState({Favorite: true});
    const [likes, setLikes] = useState({Likes: 0});

    const checkIsLiked = () => {
        const getMyLikes = JSON.parse(sessionStorage.getItem('mylikes'));
        const parseMyLikes = JSON.parse(getMyLikes);
        if(parseMyLikes === undefined) {
            return;
        }
        
        if(parseMyLikes.includes(props.Title)) {
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
            console.log(data); 
            setLikes({Likes: data.Likes});
            
        }).catch(error => {
            console.log("Error");
        });    
    }

    const like = () => {
        fetch("/backend/postlike", {
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

    const unlike = () => {
        console.log("here");
        fetch("/backend/unlike", {
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
        <section>
        <div className="display-likes">
            {likes.Likes <= 0 ? <p>{props.Likes}</p> : <p>{likes.Likes}</p>}
        </div>
        <div className="favorite-icon" onClick={() => setFavorite({Favorite: !favorite.Favorite})}>
            {favorite.Favorite ? 
                <FavoriteBorderIcon style={{fontSize: 'calc(1.5vw)'}} className="favorite" onClick={like}/> 
                : 
                <FavoriteIcon style={{fontSize: 'calc(1.5vw)'}} className="favorited" onClick={unlike}/> 
            }
        </div>
        </section>
    )
}