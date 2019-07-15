import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col , Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Header from './Header.jsx';

class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }
    
    // called on email input change
    onEmailChange = (e) => {
        this.setState({
            email: e.target.value
        });
    }
    
    // called on password input change
    onPasswordChange = (e) => {
        this.setState({
            password: e.target.value
        });
    }
    
    // login button click
    onLoginClick = (e) => {
        e.preventDefault();
        
            // fetch data of user
            fetch('/login',{
                method:"POST",
                body:JSON.stringify(this.state),
                headers:{
                    'Content-Type':'application/json',
                }
            }).then((res)=>{
                res.json().then((data) => {
                   
                    // if user present redirect to profile page.
                   if (res.status == 201 || res.status == 200) {
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
                          <Col className="text-margin" lg={{size:6, offset: 2}} md={{size:6, offset: 2}} sm={{size:8, offset: 1}} xs={{size: 12}}>
                              <span className="login-heading" >Login to your account.</span>
                          </Col>
                      </Row>
                     
                     <Form className="align-center" className="login-form" onSubmit={this.onLoginClick}>
                        <FormGroup row>
                          <Label for="email" lg={{size:8, offset:2}} md={{size:10, offset: 2}} sm={{size:16, offset: 1}} xs={6}>Email</Label>
                          <Col lg={{size:8, offset: 2}} md={{size:8, offset: 2}} sm={{size:10, offset: 1}} xs={12}>
                            <Input type="email" name="email" id="email" placeholder="Email address" onChange={this.onEmailChange} />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="password" lg={{size:8, offset:2}} md={{size:10, offset: 2}} sm={{size:16, offset: 1}} xs={6}>Password</Label>
                          <Col lg={{size:8, offset: 2}} md={{size:8, offset: 2}} sm={{size: 10, offset: 1}} xs={12}>
                            <Input type="password" name="password" id="password" placeholder="Password" onChange={this.onPasswordChange} />
                          </Col>
                        </FormGroup>
                        <div className="login-submit">
                            <div><input type="submit" value="Submit" /></div>
                            <div><span className="forgot-pass-link">Forgot Password</span></div>
                         </div>
                      </Form>
                      <Row>
                          <Col className="text-margin text-center" lg={{size:6, offset: 3}} md={{size:6, offset: 3}} sm={{size:8, offset: 2}} xs={{size: 12}}>
                              <span className="register-message" >Still without account?</span>
                              <span className="register-link" >
                                <Link to="/register">Create One</Link>
                              </span>
                          </Col>
                      </Row>
                  </Container>
            </React.Fragment>
        );
    }

}

export default Login;