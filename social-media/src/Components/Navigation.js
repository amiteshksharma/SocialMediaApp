import React, { useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import PersonIcon from '@material-ui/icons/Person';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import DrawerItem from '../Components/DrawerItem';
import '../Css/Navigation.css';

export default function Navigation() {
    const [right, setRight] = useState({Right: false});

    const handler = () => {
        setRight({Right: false});    
    }
    
    return (
        <div className="navigation">
        <Navbar bg="dark" variant="dark" className="w-100 pb-1 pt-1 justify-content-center">
            <div className="navigation-links">
                <Nav className="mr-5">
                    <Nav.Link href="/home">Home</Nav.Link>
                    <Nav.Link href="#features">Find Friends</Nav.Link>
                    <Nav.Link href="/explore">Explore</Nav.Link>
                    <Nav.Link href="#features">Notifications</Nav.Link>
                    <Nav.Link href="#pricing">Contact</Nav.Link>
                </Nav>
            </div>
            <Navbar.Brand href="#home" className="ml-auto pb-2">
                <PersonIcon onClick={() => setRight({ Right: true})}/>          
            </Navbar.Brand>
        </Navbar>

        <SwipeableDrawer
            anchor={'right'}
            open={right.Right}
            onClose={() => setRight({ Right: false})}
            onOpen={() => setRight({ Right: true})}
        >
            {<DrawerItem handler={handler}/>}
        </SwipeableDrawer>
        </div>
    )
}