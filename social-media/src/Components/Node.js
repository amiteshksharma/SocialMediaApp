import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckIcon from '@material-ui/icons/Check';
import '../Css/Node.css';

export default function Node(props) {
    
    return (
        <div className="node-container">
            <section className="information">
                <AccountCircleIcon color="primary" style={{fontSize: 'calc(2.5vw)'}} />
                <h2>Amitesh Sharma</h2>
            </section>

            <section className="bio">
                <h4>This is a bio that I use for no reason and I am writing filing text to see how this looks and I don'tk now what to say</h4>
            </section>

            <section className="followed-button-section">
                <button className="followed-button-node" >
                    Followed <CheckIcon color="primary" style={{marginBottom: 'calc(0.4vh)'}} className="checked-icon" />
                </button> 
            </section>

        </div>
    )
}