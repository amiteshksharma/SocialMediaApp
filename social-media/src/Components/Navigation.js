import React from 'react';
import { Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import '../Css/Navigation.css';

export default function Navigation(props) {
    const history = useHistory();

    const createPost = (e) => {
        history.push(`/create`);
    }

    const logout = () => {
        fetch("/users/logout")
            .then(response => response.text())
            .then(data => {
              if(data === 'True') {
                let path = `/`; 
                localStorage.clear();
                history.push(path);
              }     
          });
      }

      const profile = () => {
        const email = localStorage.getItem("Email");
        const name = localStorage.getItem("Name")
        history.push({
          pathname: `/profile/${name}`,
          query: '?user=user',
          state: { name: email}
        });
        window.location.reload(false);
      }
    
    return (
        <div className="navigation">
        <Nav defaultActiveKey={props.eventKey} className="flex-column" >
            <Nav.Link eventKey="1" onClick={(e) => history.push('/home')}>Home</Nav.Link>
            <Nav.Link eventKey="2" onClick={(e) => history.push('/explore')}>Explore</Nav.Link>
            <Nav.Link eventKey="3" onClick={(e) => history.push('/area')}>Area Search</Nav.Link>
            <Nav.Link eventKey="4" onClick={(e) => profile()}>Profile</Nav.Link>
            <Nav.Link eventKey="5" onClick={(e) => logout()}>Logout</Nav.Link>
            <Nav.Link eventKey="6" onClick={(e) => createPost()}>Create Post</Nav.Link>
        </Nav>
    </div>
    )
}