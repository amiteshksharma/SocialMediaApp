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
                    <Row style={{marginTop: 'calc(0vh)'}}>
                        <Col>Blog</Col>
                        <Col>Search</Col>
                        <Col>Connect</Col>
                    </Row>
                    <Row style={{marginTop: 'calc(2vh)'}}>
                        <Col>
                            <div className="icon-div">
                                <div className="icon-background">
                                    <FontAwesomeIcon icon={faBlog}/>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="icon-div">
                                <div className="icon-background">
                                    <FontAwesomeIcon icon={faSearch}/>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="icon-div">
                                <div className="icon-background">
                                    <FontAwesomeIcon icon={faUserFriends}/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 'calc(3vh)'}}>
                        <Col><div><p>Don't have the time to start a blog site? Register and begin blogging with two simple clicks!</p></div></Col>
                        <Col><div><p>Find any user through searching, exploring, or even by region. Connecting with users is made easy with Blogger's spot.
                        Finding and following has never been made easier</p></div></Col>
                        <Col><div><p>Make friends by following others and supporting their blogs. Connect with other bloggers to further develop your own blog spot</p></div></Col>
                    </Row>
                </Container>
            </div>  
        )
    }
}

export default Home;