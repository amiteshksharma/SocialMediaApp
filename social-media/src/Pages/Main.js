import React from 'react'
import '../Css/Main.css';
import Navigation from '../Components/Navigation';
import Tile from '../Components/Tile';

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
                <div className="container-main">
                    <section className="create-section">
                        <h1>Create Post</h1>
                    </section>
                    
                    <section className="content-section">
                        <div className="content-div">
                            <Tile />
                            <Tile />
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default Main;