import React from 'react';
import Navigation from '../Components/Navigation';
import Node from '../Components/Node';
import '../Css/Users.css';

class Users extends React.Component {
    render() {
        return (
            <div className="users">
            <Navigation />
                <div className="users-layout">
                    <div className="border-line">
                        <section className="user-div">
                            <div className="user-display">
                                <Node />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
} 

export default Users;