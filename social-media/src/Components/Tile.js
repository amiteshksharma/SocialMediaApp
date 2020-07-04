import React, { useState } from 'react';
import '../Css/Tile.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

export default function Tile() {
    const [favorite, setFavorite] = useState({Favorite: true});
    
    return (
        <div className="tile-container">
            <section className="tile-author">
                <AccountCircleIcon color="secondary" style={{fontSize: 'calc(2vw)'}} /> 
                <h6 className="profile-link"><a href="#">Amitesh Sharma</a></h6>
                <div className="favorite-icon" onClick={() => setFavorite({Favorite: !favorite.Favorite})}>
                    {favorite.Favorite ? <FavoriteBorderIcon color="secondary" style={{fontSize: 'calc(2vw)'}}/> 
                    : <FavoriteIcon color="secondary" style={{fontSize: 'calc(2vw)'}}/> }
                </div>
            </section>

            <section className="title-section">
                <div className="title">
                    <h3>Why America is not the best country</h3>
                </div>
            </section>

            <section className="summary-section">
                <div className="summary">
                    <h3>The reason this country is not good is for a number of reasons... and in this
                    blog I will explain to you why this is</h3>
                </div>
            </section>
        </div>
    )
}