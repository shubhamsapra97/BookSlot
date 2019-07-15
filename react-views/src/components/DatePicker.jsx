import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import moment from 'moment';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// For Date Navigation in Schedule
class DatePicker extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            date: ""
        }
    }
    
    componentDidMount() {
        
        // set initial date as current
        this.setState({
            date: moment().format("Do MMMM YYYY")
        });
        
    }
    
    // on next date arrow click
    addDay = () => {
        
        let nextDate = moment(this.state.date,"Do MMMM YYYY").add(1, 'days').format("Do MMMM YYYY");
        this.setState({
            
            date: nextDate
            
        },() => {
            
            this.props.filterBookedSlots(this.state.date);
            
        });
        
    }
    
    // on previous date arrow click
    subtractDay = () => {
        
        let currentDate = moment();
        let nextDate =  moment(this.state.date,"Do MMMM YYYY").subtract(1, 'days');
        
        // prevent user from navogating to past dates
        if ((moment(nextDate).diff(moment(currentDate),'days')+1 > 0)) {
    
            nextDate = nextDate.format("Do MMMM YYYY");
            this.setState({

                date: nextDate

            },() => {
                
                // on arrow click check for booked slots
                this.props.filterBookedSlots(this.state.date);
                
            });
        
        }
        
    }
    
    render() {
        return (
                    <Row className="datepicker-div">
                      <Col lg={{size:6, offset: 3}} md={{size:8 ,offset: 2}} sm={{size: 10,offset: 1}} xs={{size: 10,offset: 1}} 
                          className="date-picker-col" >
                        
                          <Row>
                              <Col lg="2" sm="2" xs="2" className="text-left">
                                  <span><FaArrowLeft className="date-navigators" onClick={this.subtractDay} /></span>
                              </Col>
                              <Col lg="8" sm="8" xs="8" className="date-picker-date text-center">{this.state.date}</Col>
                              <Col lg="2" sm="2" xs="2" className="text-right">
                                  <span><FaArrowRight className="date-navigators" onClick={this.addDay} /></span>
                              </Col>
                          </Row>
                        
                      </Col>
                    </Row>
        );
    }

}

export default DatePicker;