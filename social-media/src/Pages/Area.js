import React from 'react'
import '../Css/Area.css';
import Navigation from '../Components/Navigation';
import Tile from '../Components/Tile';
import Searchbar from '../Components/Searchbar';
import { withHistory } from 'react-router-dom';
import PublicIcon from '@material-ui/icons/Public';
import { Nav } from 'react-bootstrap';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Right: false,
            Post: [],
            MyLikes: [],
            Username: null,
            UsernamesList: [],
            isEmpty: false
        }
    }

    componentDidMount() {
        Promise.all([
        fetch("http://localhost:5000/users/followerspost", {
            method: 'POST',
            body: JSON.stringify({
                currUser: sessionStorage.getItem('Email')
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(response => response.json()).then(data => {
            this.setState({ Post: data });
        }),
        
        fetch("http://localhost:5000/backend/mylikes", {
            method: 'POST',
            body: JSON.stringify({
                email: sessionStorage.getItem('Email'),
            }),
            headers: {
                'Content-type': 'application/json'
            }
            }).then(response => response.text()).then(data => {
                this.setState({ MyLikes: data }, () => {
                    console.log(this.state.MyLikes);
                    sessionStorage.setItem('mylikes', JSON.stringify(this.state.MyLikes));
                });

                setTimeout(() => {
                    this.setState({isEmpty: true})
                }, 1000);
            }).catch(error => {
                console.log("Error");
            }) 
        ]).then();
    }

    displayUsernames(event) {
        let results = this.state.UsernamesList.filter((brand) => {
             return brand.toLowerCase().startsWith(event.query.toLowerCase());
        });
    
        this.setState({ Username: results });
    }

    render() {
        return (
            <div className="area-page">
                <div className="container-area">
                    <section className="create-section">
                        <Navigation eventKey="3" />
                    </section>
                    
                    <section className="content-section">
                        <div className="content-div">
                            <div className="area-header">
                                <PublicIcon style={{marginTop: 'calc(0.7vh)'}} fontSize="large" />
                                <h2>Global Explore</h2>
                            </div>
                            {this.state.Post.map(post => {
                                return (
                                    <Tile Title={post.Title} Body={post.Body} Name={post.Name} Email={post.Email} isLiked={this.state.MyLikes}/>
                                )
                            })}
                        </div>
                    </section>

                    <section className="searchbar-main">
                        <Searchbar />
                    </section>
                </div>
            </div>
        )
    }
}

export default Main;