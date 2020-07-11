import React, { useState } from 'react';
import '../Css/Tile.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useHistory } from 'react-router-dom';

export default function Tile(props) {
    const [favorite, setFavorite] = useState({Favorite: true});
    const history = useHistory();
    console.log();

    const routeChange = () =>{ 
        let path = `/profile/${props.Name}`; 
        history.push(path);
    }
    
    return (
        <div className="tile-container">
            <section className="tile-author">
                <AccountCircleIcon color="primary" style={{fontSize: 'calc(2vw)'}} onClick={routeChange} /> 
                <h6 className="profile-link"><a href={`/profile/${props.Name}`}>{props.Name}</a></h6>
                <div className="favorite-icon" onClick={() => setFavorite({Favorite: !favorite.Favorite})}>
                    {favorite.Favorite ? <FavoriteBorderIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="favorite"/> 
                    : <FavoriteIcon color="primary" style={{fontSize: 'calc(2vw)'}} className="favorited" /> }
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