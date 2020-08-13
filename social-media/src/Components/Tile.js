import React from 'react';
import '../Css/Tile.css';
import Favorite from './Favorite.js';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Media } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default function Tile(props) {
    const history = useHistory();

    console.log(props);
    
    const routeChange = (e) => {  
        history.push({
            pathname: `/profile/${props.Name}`,
            state: { name: props.Email}
        });
    }

    const handleClick = (e) => {
        history.push({
            pathname: `/post/${props.Name}/${props.Title}`,
            search: '?post=post',
            state: { name: props.Email, title: props.Title}
        });
    }
    
    return (
        <div className="tile-container" >
            <section className="tile-author">
                <Media>
                    <img
                        style={{borderRadius: '50%'}}
                        width={45}
                        height={45}
                        className="mr-3"
                        src={props.Icon}
                        alt="Generic placeholder"
                        onClick={routeChange}
                    />
                </Media>
                <h6 className="profile-link" onClick={routeChange}>{props.Name}</h6>
                <Favorite Title={props.Title} Email={props.Email} myLikes={props.isLiked} />
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
