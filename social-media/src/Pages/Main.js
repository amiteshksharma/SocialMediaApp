import React from 'react'
import '../Css/Main.css';
import Navigation from '../Components/Navigation';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Right: false
        }
    }

    render() {
        return (
            <div className="homepage">
                <Navigation />
            </div>
        )
    }
}

export default Main;