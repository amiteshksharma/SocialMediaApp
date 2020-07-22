import React, { useState, useEffect } from 'react';
import '../Css/Tile.css';
import Favorite from './Favorite.js';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';

export default function Tile(props) {
    const history = useHistory();


    const routeChange = () => { 
        let path = `/profile/${props.Name}`; 
        history.push(path);
    }

    const handleClick = (e) => {
        console.log(props);
        console.log("here")
        history.push(`/post/${props.Email}/${props.Title}`);
    }
    
    return (
        <div className="tile-container" >
            <section className="tile-author">
                <AccountCircleIcon color="primary" style={{fontSize: 'calc(2vw)'}} onClick={routeChange} /> 
                <h6 className="profile-link"><a href={`/profile/${props.Name}`}>{props.Name}</a></h6>
                {/* <div className="display-likes">
                    {likes.Likes <= 0 ? <p>{props.Likes}</p> : <p>{likes.Likes}</p>}
                </div> */}
                {/* <div className="favorite-icon" onClick={() => setFavorite({Favorite: !favorite.Favorite})}>
                    {favorite.Favorite ? <FavoriteBorderIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="favorite" onClick={like}/> 
                    : <FavoriteIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="favorited" onClick={unlike}/> }
                </div> */}
                <Favorite Title={props.Title} Email={props.Email} />
            </section>

            <section className="title-section" onClick={(e) => handleClick(e)}>
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