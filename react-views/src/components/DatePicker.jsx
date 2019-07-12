import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import moment from 'moment'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

class DatePicker extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            date: ""
        }
    }
    
    componentDidMount() {
        
        this.setState({
            date: moment().format("Do MMMM YYYY")
        });
        
    }
    
    addDay = () => {
        
        let nextDate = moment(this.state.date,"Do MMMM YYYY").add(1, 'days').format("Do MMMM YYYY");
        this.setState({
            
            date: nextDate
            
        });
        
    }
    
    subtractDay = () => {
        
        let nextDate = moment(this.state.date,"Do MMMM YYYY").subtract(1, 'days').format("Do MMMM YYYY");
        this.setState({
            
            date: nextDate
            
        });
        
    }
    
    render() {
        return (
                <Container>
                    <Row>
                      <Col lg={{size:6, offset: 3}} sm={{size: 12,offset: 0}} xs={{size: 12,offset: 0}} 
                          className="date-picker-col" >
                        
                          <Row>
                              <Col lg="2" sm="2" xs="2" className="text-left">
                                  <span><FaArrowLeft onClick={this.subtractDay} /></span>
                              </Col>
                              <Col lg="8" sm="8" xs="8" className="date-picker-date text-center">{this.state.date}</Col>
                              <Col lg="2" sm="2" xs="2" className="text-right">
                                  <span><FaArrowRight onClick={this.addDay} /></span>
                              </Col>
                          </Row>
                        
                      </Col>
                    </Row>
                </Container>
        );
    }

}

//Container.propTypes = {
//  fluid:  PropTypes.bool
//}
//
//Row.propTypes = {
//  noGutters: PropTypes.bool,
//  form: PropTypes.bool
//}
//
//const stringOrNumberProp = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
//const columnProps = PropTypes.oneOfType([
//  PropTypes.string,
//  PropTypes.number,
//  PropTypes.bool,
//  PropTypes.shape({
//    size: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
//    order: stringOrNumberProp,
//    offset: stringOrNumberProp
//  })
//]);
//
//Col.propTypes = {
//  xs: columnProps,
//  sm: columnProps,
//  md: columnProps,
//  lg: columnProps,
//  xl: columnProps,
//  widths: PropTypes.array,
//}

export default DatePicker;