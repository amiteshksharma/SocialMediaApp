import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Modal, Container, Row, Col, Spinner } from 'react-bootstrap';
import State from './StatesSignup';

export default function SimpleMenu(props) {
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [icon, setIcon] = React.useState({Icon: {}});
  const [image, setImage] = React.useState({Image: {}})
  const [name, setName] = React.useState({Name: localStorage.getItem('Name')});
  const [state, setState] = React.useState({State: localStorage.getItem('State')})
  const [loading, setLoading] = React.useState({Loading: false});
  const anchorRef = React.useRef(null);
  
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
    setModal(true);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  async function saveProfile() {
    setLoading({Loading: true});
    let getIconFile = icon.Icon;
    let getImageFile = image.Image;
    let getNameUpdate = 'both';

    if(localStorage.getItem('Name') !== name.Name) {
      localStorage.setItem('Name', name.Name);
    }

    if(localStorage.getItem('State') !== state.State) {
      localStorage.setItem('State', state.State);
    }

    if(!getIconFile.name) {
      getIconFile = props.Profile.Icon;
      getNameUpdate = 'icon'
    }

    if(!getImageFile.name) {
      getImageFile = props.Profile.Image;
      getNameUpdate='image';
    }

    const formData = new FormData();
    formData.append('email', localStorage.getItem('Email'));
    formData.append('name', name.Name);
    formData.append('state', state.State);
    formData.append('image', getImageFile);
    formData.append('image', getIconFile);
    formData.append('label', getNameUpdate);

    fetch("/settings/updateprofile", {
      method: 'POST',
      body: formData
    }).then(response => response.json()).then(data => {
        setTimeout(() => {
          setLoading({Loading: false});
          window.location.reload(false);
        }, 3500);
    }).catch(error => {
        console.log("Error");
    })
  }

  const setUserState = (state) => {
    setState({State: state});
  }

  return (
    <div>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <MoreHorizIcon fontSize="large" />
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose}>My Profile</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <Modal show={modal} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={{ span: 5 }}>Profile picture</Col>
              <Col md={{ span: 6 }}>
                <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={(e) => setIcon({Icon: e.target.files[0]})}/>
              </Col>
            </Row>
            <br/>
            <br/>
            <Row>
              <Col md={{ span: 5 }}>Background Image</Col>
              <Col md={{ span: 6 }}>
                <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={(e) => setImage({Image: e.target.files[0]})}/>
              </Col>
            </Row>

            <Row style={{marginTop: 'calc(5vh)'}}>
              <Col md={{ span: 5 }}>Display Name</Col>
              <Col md={{ span: 6 }}>
                <input type="email" value={name.Name} onChange={(e) => setName({Name: e.target.value})}/>
              </Col>
            </Row>

            <Row style={{marginTop: 'calc(5vh)'}}>
              <Col md={{ span: 5 }}>Select State</Col>
              <Col md={{ span: 6 }}>
                  <State selected={setUserState} default={state.State}/>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="primary" onClick={() => saveProfile()}>
            {loading.Loading ? <Spinner animation="border" role="status" /> : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
  </div>
  );
}