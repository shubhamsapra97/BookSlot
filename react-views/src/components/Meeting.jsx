import React, {Component} from 'react';
import { Container, Row, Col , Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

// Meeting text in the profile Page
class Meeting extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
              
            this.props.data.length > 0 ? 

                this.props.data.map((val,index) => {
                    
                  let time = val.date.split(" ")[1] + val.date.split(" ")[2]; 
                  return (

                    <Row className="profile-reservation-row" key={index}>
                        <Col className="profile-reservation-time" lg={{size:1, offset: 4}} md={{size:2, offset: 1}} sm={{size:1, offset: 0}} xs={{size: 2}}>
                            {time}
                        </Col>
                         <Col className="profile-reservation-user" lg={{size:4, offset: 0}} md={{size:5, offset: 0}} sm={{size:8, offset: 1}} xs={{size: 7}}>
                            Booked by {val.bookedBy}
                        </Col>
                         <Col className="profile-reservation-delete" lg={{size:1, offset: 0}} md={{size:1, offset: 1}} sm={{size:1, offset: 0}} xs={{size: 2}} onClick={() => {
                            this.props.onOpenModal(val);         
                         }}>
                            <span>Delete</span>
                        </Col>
                     </Row>  

                  );

                })
            
                :
            
                ''    
        )
    }

}

export default Meeting;