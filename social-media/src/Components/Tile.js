import React, { useState } from 'react';
import '../Css/Tile.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useHistory } from 'react-router-dom';

export default function Tile(props) {
    const [favorite, setFavorite] = useState({Favorite: true});
    const history = useHistory();

    const routeChange = () =>{ 
        let path = `/profile`; 
        history.push(path);
    }
    
    return (
        <div className="tile-container">
            <section className="tile-author">
                <AccountCircleIcon color="primary" style={{fontSize: 'calc(2vw)'}} onClick={routeChange} /> 
                <h6 className="profile-link"><a href="/profile">Amitesh Sharma</a></h6>
                <div className="favorite-icon" onClick={() => setFavorite({Favorite: !favorite.Favorite})}>
                    {favorite.Favorite ? <FavoriteBorderIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="favorite"/> 
                    : <FavoriteIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="favorited" /> }
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
                    blog I will explain to you why this is, and it is because</h3>
                </div>
            </section>
        </div>
    )
}