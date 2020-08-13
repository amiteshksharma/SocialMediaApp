import React from 'react';
import '../Css/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBlog, faSearch, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col } from 'react-bootstrap';


class Home extends React.Component {
    constructor(props) {
        super(props)
    }

    
    render() {
        return (
            <div className="Home">
                <div className="navbar-home">
                    <p onClick={() => this.props.history.push('/signup')}>Signup</p>
                    <p onClick={() => this.props.history.push('/login')}>Login</p>
                </div>
                <section className="top-section">
                    <div className="top-slogan">
                        <h1>Blogger's spot</h1>
                        <p>Blogging made easy. One spot for all your Blogging needs.</p>
                    </div>    
                </section>

                <Container fluid style={{marginTop: 'calc(4vh)'}}>
                    <Row style={{marginTop: 'calc(2vh)'}}>
                        <Col xs={12} md={4}>
                            <div className="icon-div">
                                <h1 className="feature-header">Blog</h1>
                                <div className="icon-background">
                                    <FontAwesomeIcon style={{fontSize: window.innerWidth <= 760 ? 'calc(5vw)' : 'calc(1.5vw)'}} icon={faBlog}/>
                                </div>
                                <div className="feature-text"><p>Don't have the time to start a blog site? Register and begin blogging with two simple clicks!</p></div>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="icon-div">
                                <h1 className="feature-header">Search</h1>
                                <div className="icon-background">
                                    <FontAwesomeIcon style={{fontSize: window.innerWidth <= 760 ? 'calc(5vw)' : 'calc(1.5vw)'}} icon={faSearch}/>
                                </div>
                            </div>
                            <div className="feature-text"><p>Find any user through searching, exploring, or even by region. Connecting with users is made easy with Blogger's spot.
                                 Finding and following has never been made easier</p></div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="icon-div">
                                <h1 className="feature-header">Connect</h1>
                                <div className="icon-background">
                                    <FontAwesomeIcon style={{fontSize: window.innerWidth <= 760 ? 'calc(5vw)' : 'calc(1.5vw)'}} icon={faUserFriends}/>
                                </div>
                            </div>
                            <div className="feature-text"><p>Make friends by following others and supporting their blogs. Connect with other bloggers to further develop your own blog spot</p></div>
                        </Col>
                    </Row>
                </Container>
            </div>  
        )
    }
}

export default Home;