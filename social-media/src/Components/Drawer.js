import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CreateIcon from '@material-ui/icons/Create';
import ExploreIcon from '@material-ui/icons/Explore';
import PublicIcon from '@material-ui/icons/Public';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  list: {
    width: 250,
    height: 'calc(100vh)',
    backgroundColor: 'rgb(21, 32, 43)',
    color: 'white'
  },
  line: {
    backgroundColor: 'white'
  },
  icon: {
    color: 'white'
  },
  fullList: {
    width: 'auto',
  },
  button: {
      backgroundColor: 'rgb(38, 119, 196)',
      fontWeight: '600',
      color: 'white',
      padding: 'calc(3vw)',
      borderRadius: 'calc(50%)',
      position: 'fixed',
      right: 'calc(3vw)',
      bottom: 'calc(3vw)',
      boxShadow: '4px 4px 10px black'
  }
});

export default function Drawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

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

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({left: open});
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
          <ListItem button key={'home'} onClick={(e) => history.push('/home')} >
            <ListItemIcon className={clsx(classes.icon)}><HomeIcon /></ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItem>
          <ListItem button key={'explore'} onClick={(e) => history.push('/explore')}>
            <ListItemIcon className={clsx(classes.icon)}><ExploreIcon /></ListItemIcon>
            <ListItemText primary={'Explore'} />
          </ListItem>
          <ListItem button key={'area'} onClick={(e) => history.push('/area')}>
            <ListItemIcon className={clsx(classes.icon)}><PublicIcon /></ListItemIcon>
            <ListItemText primary={'Area Search'} />
          </ListItem>
          <ListItem button key={'profile'} onClick={(e) => profile()}>
            <ListItemIcon className={clsx(classes.icon)}><PersonOutlineIcon /></ListItemIcon>
            <ListItemText primary={'Profile'} />
          </ListItem>
          <ListItem button key={'post'} onClick={(e) => createPost()}>
            <ListItemIcon className={clsx(classes.icon)}><CreateIcon /></ListItemIcon>
            <ListItemText primary={'Create Post'} />
          </ListItem>
      </List>
      <Divider className={clsx(classes.line)}/>
      <List>
          <ListItem button key={'logout'} onClick={(e) => logout()}>
            <ListItemIcon className={clsx(classes.icon)}><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItem>
      </List>
    </div>
  );

  return (
    <div>
        <React.Fragment key={'left'}>
          <Button className={clsx(classes.button)} 
            onClick={toggleDrawer(true)}><DashboardIcon style={{fontSize: 'calc(10vw)'}}/></Button>
          <SwipeableDrawer
            anchor={'left'}
            open={state.left}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            {list('left')}
          </SwipeableDrawer>
        </React.Fragment>
    </div>
  );
}