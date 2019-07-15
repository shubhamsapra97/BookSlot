import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col , Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import moment_timezone from 'moment-timezone';
import Header from './Header.jsx';

class Register extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fullName: '',
            timezone: moment_timezone.tz.guess()
        }
    }
    
    // on full name inout change
    onFullNameChange = (e) => {
        this.setState({
            fullName: e.target.value
        });
    }
    
    // on email inout change
    onEmailChange = (e) => {
        this.setState({
            email: e.target.value
        });
    }
    
    // on password inout change
    onPasswordChange = (e) => {
        this.setState({
            password: e.target.value
        });
    }
    
    // on register button click
    onRegisterClick = (e) => {
        e.preventDefault();
        
            fetch('/register',{
                method:"POST",
                body:JSON.stringify(this.state),
                headers:{
                    'Content-Type':'application/json',
                }
            }).then((res)=>{
                res.json().then((data) => {
                   if (res.status == 201) {
                      // if registered successfully redirect to profile page.
                      this.props.history.push({
                          pathname: `/profile/${data[0].data.fullName}`,
                          state: { data: data[0].data }
                      })
                   }
                });
            }).catch((err)=>console.log(err));
    }
    
    render() {
        return (
            <React.Fragment>
                 <Header />
                 <Container>
                     
                     <Row>
                          <Col className="text-margin-register" lg={{size:6, offset: 2}} md={{size:6, offset: 2}} sm={{size:8, offset: 1}} xs={{size: 12}}>
                              <span className="login-heading" >Create Account.</span>
                          </Col>
                      </Row>
                     
                     <Form className="align-center" className="login-form" onSubmit={this.onRegisterClick}>
                         <FormGroup row>
                          <Label for="fullName" lg={{size:8, offset:2}} md={{size:10, offset: 2}} sm={{size:16, offset: 1}} xs={6}>Full Name</Label>
                          <Col lg={{size:8, offset: 2}} md={{size:8, offset: 2}} sm={{size: 10, offset: 1}} xs={12}>
                            <Input type="text" name="fullName" id="fullName" placeholder="Full Name" value={this.state.fullName}
                                onChange={this.onFullNameChange}    
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="email" lg={{size:8, offset:2}} md={{size:10, offset: 2}} sm={{size:16, offset: 1}} xs={6}>Email</Label>
                          <Col lg={{size:8, offset: 2}} md={{size:8, offset: 2}} sm={{size:10, offset: 1}} xs={12}>
                            <Input type="email" name="email" id="email" placeholder="Email address" value={this.state.email}
                                onChange={this.onEmailChange}       
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="password" lg={{size:8, offset:2}} md={{size:10, offset: 2}} sm={{size:16, offset: 1}} xs={6}>Password</Label>
                          <Col lg={{size:8, offset: 2}} md={{size:8, offset: 2}} sm={{size: 10, offset: 1}} xs={12}>
                            <Input type="password" name="password" id="password" placeholder="Password" value={this.state.password}
                                onChange={this.onPasswordChange}       
                            />
                          </Col>
                        </FormGroup>
                        <div className="login-submit">
                            <div><input type="submit" value="Submit" /></div>
                            <div><span className="forgot-pass-link">Forgot Password</span></div>
                         </div>
                      </Form>
                      <Row>
                          <Col className="text-margin text-center" lg={{size:6, offset: 3}} md={{size:6, offset: 3}} sm={{size:8, offset: 2}} xs={{size: 10, offset: 1}}>
                              <span className="register-message" >I have an account?</span>
                              <span className="register-link" >
                                <Link to="/login">Login</Link>
                              </span>
                          </Col>
                      </Row>
                  </Container>
            </React.Fragment>
        );
    }

}

export default Register;