import React from 'react'
import '../Css/Area.css';
import Navigation from '../Components/Navigation';
import Node from '../Components/Node';
import Searchbar from '../Components/Searchbar';
import States from '../Components/States';
import Drawer from '../Components/Drawer';
import PublicIcon from '@material-ui/icons/Public';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Right: false,
            Post: [],
            MyLikes: [],
            GetStates: [],
            Username: null,
            UsernamesList: [],
            isEmpty: false
        }

        this.states = this.states.bind(this);
    }

    componentDidMount() {
        Promise.all([
            fetch("/backend/mylikes", {
                method: 'POST',
                body: JSON.stringify({
                    email: localStorage.getItem('Email'),
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.text()).then(data => {
                this.setState({ MyLikes: data }, () => {
                    localStorage.setItem('mylikes', JSON.stringify(this.state.MyLikes));
                });

                setTimeout(() => {
                    this.setState({isEmpty: true})
                }, 1000);
            }).catch(error => {
                console.log("Error");
            }),
        ]).then();
    }

    displayUsernames(event) {
        let results = this.state.UsernamesList.filter((brand) => {
             return brand.toLowerCase().startsWith(event.query.toLowerCase());
        });
    
        this.setState({ Username: results });
    }

    states(value) {
        this.setState({GetStates: value}, () => console.log(this.state.GetStates));
    } 

    render() {
        return (
            <div className="area-page">
                <div className="container-area">
                {window.innerWidth <= 760 ? null : 
                    <section className="create-section">
                        <Navigation eventKey="3" />
                    </section>}
                    
                    <section className="area-section">
                        <div className="area-div">
                            <div className="area-header">
                                <PublicIcon style={{marginTop: 'calc(0.7vh)'}} fontSize="large" />
                                <h2>Area Explore</h2>
                                <States selected={this.states}/>
                            </div>
                            {this.state.GetStates.map(post => {
                                return (
                                    <Node email={post.Email} name={post.Name} bio={post.Bio} showFollow={true} icon={post.Icon} />
                                )
                            })}
                        </div>
                    </section>

                    {window.innerWidth <= 760 ? null : 
                    <section className="searchbar-section">
                        <Searchbar />
                    </section>}

                    {window.innerWidth <= 760 ? <Drawer /> : null}
                </div>
            </div>
        )
    }
}

export default Main;