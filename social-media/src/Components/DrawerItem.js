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

export default function DrawerItem(props) { 
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
              <ListItem button key={'Profile'} onClick={() => console.log("clicked")}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary={'Profile'} />
              </ListItem>
          </List>
          <Divider />
          <List>
          <List>
              <ListItem button key={'Logout'} onClick={() => console.log("clicked")}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary={'Logout'} />
              </ListItem>
          </List>
          </List>
        </div>
    )
}