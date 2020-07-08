import React from 'react'
import '../Css/Main.css';
import Navigation from '../Components/Navigation';
import Tile from '../Components/Tile';
import { withHistory } from 'react-router-dom';
import { auth } from '../firebase';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Right: false
        }

        this.createPost = this.createPost.bind(this);
    }

    createPost() {
        this.props.history.push(`/create`);
    }

    render() {
        return (
            <div className="homepage">
                <Navigation />
                <div className="container-main">
                    <section className="create-section" onClick={() => this.createPost()}>
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