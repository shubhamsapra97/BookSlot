import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col , Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import moment from 'moment';
import Header from './Header.jsx';
import DatePicker from './DatePicker.jsx';

class Schedule extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userData: "",
            current_date_blocked_slots: []
        }
        
        // time slots array
        this.defaultTimeArray = ['12:00 AM','01:00 AM','02:00 AM','03:00 AM','04:00 AM','05:00 AM','06:00 AM','07:00 AM',
          '08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM',
          '05:00 PM','06:00 PM','07:00 PM','08:00 PM','09:00 PM','10:00 PM','11:00 PM'              
        ];
        this.timeSlotSelected = [];
        this.bookedSlots = [];
    }
    
    componentDidMount() {
        
        this.search_user_data = this.props.history.location.state.search_user_data;
        this.current_user_data = this.props.history.location.state.current_user_data;
        
        this.setState({
            userData: this.search_user_data.data
        },() => {
            
            // get meetings for search user
            fetch(`/getMeetings?fullName=${this.search_user_data.data.fullName}&email=${this.search_user_data.data.email}&timezone=${this.current_user_data.timezone}`,{
                method:"GET",
            }).then((res)=>{
                res.json().then((data) => {
                    
                    // if meetings present disable the booked slots.
                   if (data[0].data.length != 0) {
                       this.populateBookedSlotsArray(data[0].data);
                   }
                    
                });
            }).catch((err)=>console.log(err));
            
        });
    }
    
    // on time slot select
    onTimeSlotSelect = (e) => {
        
        let timeSlot = e.currentTarget.getAttribute('name');
        
        // if time slot already selected.
        if (e.target.classList.contains('schedule-time-selected')) {
            e.target.classList.remove('schedule-time-selected');
            let filteredArray = this.timeSlotSelected.filter((timeSlotSelec) => {
              return timeSlotSelec != timeSlot;
            });
            this.timeSlotSelected = filteredArray;
        } else {
            e.target.classList.add('schedule-time-selected');
            this.timeSlotSelected.push(timeSlot);
        }
        
    }
    
    // on reserve slot button click
    onReserveSlot = (e) => {
        
        // if time slots selected more than 1
        if (this.timeSlotSelected.length > 1) {
            alert("You can only do one reservation at a time");
        } else if(this.timeSlotSelected.length == 0) {
            // if no time slot selected
            alert("Please select atleast 1 slot");  
        } else {
            let date = this.refs.datePicker.state.date + ' ' + this.timeSlotSelected[0];
            date = moment(date,"Do MMMM YYYY hh:mm:ss A").format("YYYY-MM-DD HH:mm:ss");
            
            let data = {
                fullName: this.search_user_data.data.fullName,
                email: this.search_user_data.data.email,
                bookedBy: this.current_user_data.fullName,
                timezone: this.current_user_data.timezone,
                date
            }
             // save meeting
            fetch('/saveMeeting',{
                method:"POST",
                body:JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json',
                }
            }).then((res)=>{
                res.json().then((data) => {
                   if (res.status == 201 || res.status == 200) {
                       // ifmeeting saved successfully redirect to profile page.
                        this.props.history.push({
                          pathname: `/profile/${data[0].data.fullName}`,
                          state: { data: this.current_user_data }
                        });
                   }
                });
            }).catch((err)=>console.log(err));
        }
    }
    
    // returns array containing date and time for booked slots.
    populateBookedSlotsArray = (data) => {
        
        data.forEach((ele , index) => {
            
            let timeVal = ele.date.split(" ")[1];
            let timeMins = timeVal.split(":")[1];
            
            // if time slot minutes present eg: 12:30 am
            // disable time slot 12am and 1pm
            if (timeMins != "00") {
                
                let timeNextHour = moment(ele.date,"YYYY-MM-DD hh:mm A").add(1 , 'hour').subtract(timeMins,'minutes').format("YYYY-MM-DD hh:mm A");
                let timePrevHour = moment(ele.date,"YYYY-MM-DD hh:mm A").subtract(timeMins,'minutes').format("YYYY-MM-DD hh:mm A");
                
                this.bookedSlots.push(timeNextHour);
                this.bookedSlots.push(timePrevHour);
                
            } else {
                
                this.bookedSlots.push(ele.date);
                
            }                    
            
        });
        
        let newUniqueArray = [...new Set(this.bookedSlots)];
        this.bookedSlots = newUniqueArray;
        
        this.filterBookedSlots(this.refs.datePicker.state.date);
        
    }
    
    // returns array with current selected date booked slots.
    filterBookedSlots = (date) => {
        
        date = moment(date,"Do MMMM YYYY").format("YYYY-MM-DD");
        
        this.currentDateBookedSlots = [];
        this.bookedSlots.map((val) => {
            
            if (val.split(" ")[0] == date) {
                this.currentDateBookedSlots.push(val.split(" ")[1] + " " + val.split(" ")[2]);
            }
            
        });
        
        this.setState({
            current_date_blocked_slots: this.currentDateBookedSlots
        });
        
    }
    
    render() {
        return (
            <React.Fragment>
                 <Header />
                 <Container>
                     <Row>
                        <Col className="text-margin-profile schedule-heading" lg={{size:6, offset: 2}} md={{size:6, offset: 1}} sm={{size:8, offset: 0}} xs={{size: 12}}>
                            Making reservations with
                        </Col>
                        <Col className="" lg={{size:6, offset: 2}} md={{size:6, offset: 1}} sm={{size:8, offset: 0}} xs={{size: 12}}>
                            <span className="profile-userName" >{this.props.match.params.name}</span>
                            <span className="schedule-timezone" >{this.state.userData.timezone}</span>
                        </Col>
                     </Row>
                     <DatePicker ref='datePicker' filterBookedSlots={this.filterBookedSlots} />
                     <Row className="schedule-time-div">
                         {
                            this.defaultTimeArray.length > 0 ?

                            this.defaultTimeArray.map((val, index) => {
                                return <Col id={`time-slot-${index}`} name={val} className="schedule-time" key={index} lg={{size:2, offset: 0}} md={{size:2, offset: 0}} sm={{size:2, offset: 0}} xs={{size: 4}} onClick={this.onTimeSlotSelect} 
                                className={(this.state.current_date_blocked_slots.indexOf(val) != -1)
                                    ? 'schedule-time disabled-schedule-time' : 'schedule-time'    
                                }>
                                    {val}
                                </Col>
                            })

                            :

                            ''
                        }
                    </Row>
                     <Row className="book-slot-div">
                         <div className="book-slot">
                            <input type="submit" onClick={this.onReserveSlot} value="Reserve a Selected Slot" />
                         </div>
                     </Row>
                  </Container>
            </React.Fragment>
        );
    }

}

export default Schedule;