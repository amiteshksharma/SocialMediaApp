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
                <AccountCircleIcon color="light" style={{fontSize: 'calc(2vw)'}} onClick={routeChange} /> 
                <h6 className="profile-link"><a href={`/profile/${props.Name}`}>{props.Name}</a></h6>
                <Favorite Title={props.Title} Email={props.Email} />
            </section>

            <div onClick={(e) => handleClick(e)}>
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
        </div>
    )
}