import React, {Component} from 'react';
import { IoIosCube } from "react-icons/io";

class Header extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="header-div">
            
                <IoIosCube className="header-logo" />
                <span className="header-title">Planguru</span>
                
            </div>
        );
    }

}

export default Header;