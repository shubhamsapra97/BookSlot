import React, {Component} from 'react';
import $ from "jquery";
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import Header from './Header.jsx';
import Login from './Login.jsx';

class Display extends Component {
    
    constructor(props) {
        super(props);
       
    }
    
    componentDidMount() {
        
        
        
    }
    
    render() {
        return (
            <React.Fragment>
                <Header />
                <Container>
                    <Login />
                </Container>
            </React.Fragment>
        );
    }

}

export default Display;