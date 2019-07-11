import React, {Component} from 'react';
import $ from "jquery";
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import DatePicker from './DatePicker.jsx';

class Display extends Component {
    
    constructor(props) {
        super(props);
       
    }
    
    componentDidMount() {
        
        
        
    }
    
    render() {
        return (
            <Container>
                <DatePicker />
            </Container>
        );
    }

}

Container.propTypes = {
  fluid:  PropTypes.bool
}

Row.propTypes = {
  noGutters: PropTypes.bool,
  form: PropTypes.bool
}

const stringOrNumberProp = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
const columnProps = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
  PropTypes.shape({
    size: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
    order: stringOrNumberProp,
    offset: stringOrNumberProp
  })
]);

Col.propTypes = {
  xs: columnProps,
  sm: columnProps,
  md: columnProps,
  lg: columnProps,
  xl: columnProps,
  widths: PropTypes.array,
}

export default Display;