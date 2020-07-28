import React, { useState } from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import '../Css/Main.css';
import { useHistory } from 'react-router-dom';

export default function DrawerItem(props) { 
  const email = sessionStorage.getItem('Email');
  const history = useHistory();
  
  const logout = () => {
    console.log("here");
    fetch("/users/logout")
        .then(response => response.text())
        .then(data => {
          console.log(data);
          if(data === 'True') {
            let path = `/`; 
            history.push(path);
          }
          
      });
  }

  const profile = () => {
    history.push(`/profile/${email}`);
    window.location.reload(false);
  }
  
  console.log(props.handler);
  return (
        <div
          className={'right'}
          role="presentation"
        >
          <IconButton onClick={props.handler}>
            <ChevronRightIcon />
          </IconButton>
          <Divider />
          <List>
              <ListItem button key={'Profile'} onClick={profile}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary={'Profile'} />
              </ListItem>
          </List>
          <Divider />
          <List>
          <List>
              <ListItem button key={'Logout'} onClick={logout}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary={'Logout'} />
              </ListItem>
          </List>
          </List>
        </div>
    )
}