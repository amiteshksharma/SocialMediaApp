import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Modal, Container, Row, Col, Form } from 'react-bootstrap';

export default function SimpleMenu() {
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [icon, setIcon] = React.useState({Icon: {}});
  const [image, setImage] = React.useState({Image: {}})
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

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async function saveProfile() {
    const getIconFile = icon.Icon;
    const getImageFile = image.Image;

    const formData = new FormData();
    formData.append('email', localStorage.getItem('Email'));
    formData.append('name', localStorage.getItem('Name'));
    formData.append('state', localStorage.getItem('State'));
    formData.append('image', getImageFile);
    formData.append('icon', getIconFile);

    fetch("/settings/updateprofile", {
      method: 'POST',
      body: formData
    }).then(response => response.json()).then(data => {
        console.log(data);
    }).catch(error => {
        console.log("Error");
    })
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
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose}>My Profile</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <Modal show={modal} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
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
          </Container>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="primary" onClick={() => saveProfile()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  </div>
  );
}