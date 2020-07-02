import React from 'react'
import '../Css/Main.css';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Right: false
        }
    }
    list = () => (
        <div
          className={'right'}
          role="presentation"
          onClick={() => this.setState({ Right: false})}
        >
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
      );

    render() {
        return (
            <div className="homepage">
                <div className="sidebar">
                    <h1>BAR</h1>
                    <button onClick={() => this.setState({ Right: true})}>Click me</button>
                </div>   
                <SwipeableDrawer
                    anchor={'right'}
                    open={this.state.Right}
                    onClose={() => this.setState({ Right: false})}
                    onOpen={() => this.setState({ Right: true})}
                >
                    {this.list('right')}
                </SwipeableDrawer>
            </div>
        )
    }
}

export default Main;