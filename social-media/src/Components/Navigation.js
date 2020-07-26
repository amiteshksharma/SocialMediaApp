import React, { useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import DrawerItem from '../Components/DrawerItem';
import '../Css/Navigation.css';

export default function Navigation(props) {
    const [right, setRight] = useState({Right: false});
    const history = useHistory();

    const handler = () => {
        setRight({Right: false});    
    }

    const createPost = (e) => {
        history.push(`/create`);
    }
    
    return (
        <div className="navigation">
        <Nav defaultActiveKey={props.eventKey} className="flex-column" >
            <Nav.Link eventKey="1" onClick={(e) => history.push('/home')}>Home</Nav.Link>
            <Nav.Link eventKey="2" onClick={(e) => history.push('/explore')}>Explore</Nav.Link>
            <Nav.Link eventKey="3" onClick={(e) => history.push('/area')}>Area Search</Nav.Link>
            <Nav.Link eventKey="4" onClick={(e) => setRight({Right: true})}>Profile</Nav.Link>
            <Nav.Link eventKey="5" onClick={(e) => createPost()}>Create Post</Nav.Link>
        </Nav>

        <SwipeableDrawer
            anchor={'left'}
            open={right.Right}
            onClose={() => setRight({ Right: false})}
            onOpen={() => setRight({ Right: true})}
        >
            {<DrawerItem handler={handler}/>}
        </SwipeableDrawer>
    </div>
    )
}