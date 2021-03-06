import React from 'react'
import '../Css/Main.css';
import Navigation from '../Components/Navigation';
import Tile from '../Components/Tile';
import Searchbar from '../Components/Searchbar';
import Drawer from '../Components/Drawer';
import ExploreIcon from '@material-ui/icons/Explore';

class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Right: false,
            Post: [],
            MyLikes: []
        }

        this.createPost = this.createPost.bind(this);
    }

    componentDidMount() {
        Promise.all([
        fetch("/backend/loadposts")
        .then(response => response.json()).then(data => {  
            this.setState({ Post: data });
        }).catch(error => {
            console.log("Error");
        }),   
        
        fetch("/backend/mylikes", {
            method: 'POST',
            body: JSON.stringify({
                email: localStorage.getItem('Email'),
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.json()).then(data => {
                this.setState({ MyLikes: data });
            }).catch(error => {
                console.log("Error");
            }) 
        ]) .then(console.log("hello"));
    }

    createPost() {
        this.props.history.push(`/create`);
    }

    render() {
        return (
            <div className="explorepage">
                <div className="container-explore">
                    {window.innerWidth <= 760 ? null : 
                    <section className="create-section">
                        <Navigation eventKey="2" />
                    </section>}
                    
                    <section className="explore-section">
                        <div className="explore-content-div">
                            <div className="explore-header">
                                <ExploreIcon style={{marginTop: 'calc(0.7vh)'}} fontSize="large" />
                                <h2>Explore</h2>
                            </div>
                            {this.state.Post.map(post => {
                                if(post.Email === localStorage.getItem('Email')) {
                                    return;
                                } else {
                                    return (
                                        <Tile Title={post.Title} Body={post.Body} Name={post.Name} Email={post.Email} isLiked={this.state.MyLikes}
                                            Icon={post.Icon}
                                        />
                                    )
                                }
                            })}
                        </div>
                    </section>

                    <section className="searchbar-section">
                        <Searchbar />
                    </section>

                    {window.innerWidth <= 760 ? <Drawer /> : null}
                </div>
            </div>
        )
    }
}

export default Explore;