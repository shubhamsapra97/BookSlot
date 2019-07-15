import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col , Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import moment_timezone from 'moment-timezone';
import moment from 'moment';
import Modal from 'react-responsive-modal';
import Header from './Header.jsx';
import Meeting from './Meeting.jsx';

class Profile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            userSearchInput: '',
            meetings: [],
            currentModalData: ""
        }
        this.meetingsArray = {};
    }
    
    componentDidMount() {
        
        // get user meeting on component mount
        this.getUserMeetings();
        
    }
    
    getUserMeetings = () => {
        
        // fetch data
        let userData = this.props.history.location.state.data;
        fetch(`/getMeetings?fullName=${userData.fullName}&email=${userData.email}&timezone=${userData.timezone}`,{
            method:"GET",
        }).then((res)=>{
            res.json().then((data) => {
                // if meetings present format the meetings for render
              if (data[0] && data[0].data.length > 0) {
                 this.formatMeetingsRenderData(data[0].data);
              } else {
                  
                  // else trigger "no reservation" text to render
                  this.setState({
                      meetings: []
                  })
              }

            });
        }).catch((err)=>console.log(err));
        
    }
    
    // called to open the modal
    onOpenModal = (val) => {
      this.setState({ 
          open: true,
          currentModalData: val
      });
    };
    
    // called to close the modal
    onCloseModal = () => {
      this.setState({ open: false });
    };
    
    // formts the meetings data for render
    formatMeetingsRenderData = (data) => {

        let date = "";
        this.meetingsArray = {};
        
        // structure for render
        // {
        //               
        //      '14 th July' : [ all meetings object for 14th july ]            
        //      '15 th July' : [ all meetings object for 15th july ] 
        //            
        // }
        data.map((val,index) => {
            
            date = moment(val.date,"YYYY-MM-DD hh:mm A").format("Do MMMM YYYY");
            
            // check if object has key for that date
            if (this.meetingsArray.hasOwnProperty(date)) {
                 
                 // if length of date in that date key > 0
                 if(this.meetingsArray[date].length > 0) {
                     
                     // place the new object according to date val in array                     
                     let i;
                     let len = this.meetingsArray[date].length;
                     for (i=0; i<len ; i++) {
                         
                         // comparing time in 24h format
                         let time1 = moment(this.meetingsArray[date][i].date,"YYYY-MM-DD hh:mm A").format("HH:mm");
                         let time2 = moment(val.date,"YYYY-MM-DD hh:mm A").format("HH:mm");
                         
                         if (time1 > time2) {
                             this.meetingsArray[date].splice(i,0,val);
                             break;
                         }
                         
                         if (i == len -1) {
                             this.meetingsArray[date].push(val);
                         }
                         
                     }
                     
                 }
                
            } else {
                
                // if no key present for date
                // create key
                // push data
                this.meetingsArray[date] = [val];
            }
            
        });
        
        // fetch keys for object
        let meetingDates = Object.keys(this.meetingsArray);
        meetingDates.map((val,index)=>{
           meetingDates[index] = moment(meetingDates[index],"Do MMMM YYYY").format("YYYY-MM-DD");
        });
        
        // sort the date keys of object
        meetingDates.sort();
        
        // create new structure using sorted keys
        let sortedMeetingsArray = {};
        meetingDates.map((val,index) => {
            
            let date = moment(meetingDates[index],"YYYY-MM-DD").format("Do MMMM YYYY");
            sortedMeetingsArray[date] = this.meetingsArray[date];
            
        });
        
        // render meetings
        this.setState({
            meetings: sortedMeetingsArray
        });
        
        
    }
    
    // on user search input change
    searchUserInputChange = (e) => {
        this.setState({
            userSearchInput: e.target.value
        });
    }

    // handling press of Enter in user seach input field.
    handleKeyPress = (e) => {
        if (e.keyCode == 13 || e.which == 13) {
            
            let userData = this.props.history.location.state;
            if (userData.data.fullName != this.state.userSearchInput) {
                
                fetch(`/getUser?fullName=${this.state.userSearchInput}`,{
                    method:"GET",
                }).then((res)=>{
                    res.json().then((data) => {
                       if (res.status == 201 || res.status == 200) {
                           this.props.history.push({
                              pathname: `/schedule/${data[0].data.fullName}`,
                              state: { 
                                  search_user_data: data[0],
                                  current_user_data: userData.data
                              }
                            })
                       } else {
                           // User does not exist message
                           alert("No User Found");
                       }
                    });
                }).catch((err)=>console.log(err));   
                
            } else {
                alert("You can't book meeting with yourself");
                console.log("You can't book meeting with yourself");
            }
            
            
        }
    }
    
    // delete the meetings
    deleteMeeting = () => {
        
        if (this.state.currentModalData && Object.keys(this.state.currentModalData).length != 0) {
     
            fetch('/deleteMeeting',{
                method:"PUT",
                body:JSON.stringify(this.state.currentModalData),
                headers:{
                    'Content-Type':'application/json',
                }
            }).then((res)=>{
                res.json().then((data) => {
                   if (res.status == 201 || res.status == 200) {
                       // if deleted successfully
                       // close the modal
                       // get user meetings and rerender
                       this.onCloseModal();
                       this.getUserMeetings();
                   }
                });
            }).catch((err)=>console.log(err));   
            
        }
        
    }
    
    render() {
        const { open } = this.state;
        
        // styles for modal
        let classNameStyle = {
            modal: "modalClass",
            closeButton: "modal-close-button"
        }
        
        return (
            <React.Fragment>
                 <Header />
                 <Container>
                     
                     <Row>
                        <Col className="text-margin-profile" lg={{size:6, offset: 3}} md={{size:6, offset: 1}} sm={{size:8, offset: 0}} xs={{size: 12}}>
                            <span className="profile-userName" >{this.props.history.location.state.data.fullName}</span>
                        </Col>
                        <Col className="" lg={{size:6, offset: 3}} md={{size:6, offset: 1}} sm={{size:8, offset: 0}} xs={{size: 12}}>
                          <span className="profile-timezone" >{this.props.history.location.state.data.timezone}</span>
                          <span className="profile-update-timezone">Update</span>
                        </Col>
                     </Row>
                     <Row>
                         <Col className="user-search-div" lg={{size:7, offset: 3}} md={{size:9, offset: 1}} sm={{size:12, offset: 0}} xs={12}>
                            <Label className="user-search-label" for="userSearch">User Name</Label>
                            <Input className="user-search-input" type="text" name="userSearch" id="userSearch" placeholder="Search for users" onKeyPress={this.handleKeyPress} value={this.state.userSearchInput} onChange={this.searchUserInputChange} />
                         </Col>
                     </Row>
                     <Row>
                        <Col className="profile-reservation-text" lg={{size:6, offset: 3}} md={{size:6, offset: 1}} sm={{size:8, offset: 0}} xs={{size: 12}}>
                            <div>Reservations</div>
                        </Col>
                     </Row>
                     
                     {
                         
                         Object.keys(this.state.meetings).length > 0 ? 
                         
                         Object.keys(this.state.meetings).map((key,index) => {
                             return (
                             <React.Fragment key={index}>
                                <Row>
                                    <Col lg={{size:6, offset: 3}} md={{size:6, offset: 1}} sm={{size:8, offset: 0}} xs={{size: 12}}>
                                        <div className="profile-reservation-date">{key}</div>
                                    </Col>
                                 </Row>
                             
                                 <Meeting data={this.state.meetings[key]} onOpenModal={this.onOpenModal} />
                              </React.Fragment>

                             )
                             

                         })
                         
                         :
                         
                        <div className="no-meetings-div">No Reservations</div>
                     }
                     
                  </Container>
                  <Modal classNames={classNameStyle} open={open} onClose={this.onCloseModal} center>
                      <span className="modal-title">Cancel Booking</span>
                      <hr />
                      <span className="modal-text">Do you want to cancel this booking with {this.state.currentModalData.bookedBy} ?</span>
                      <div className="modal-button-div">
                        <input type="button" onClick={this.deleteMeeting} value="Yes" />
                        <input type="button" onClick={this.onCloseModal} value="No" />
                      </div>
                  </Modal>
            </React.Fragment>
        );
    }

}

export default Profile;