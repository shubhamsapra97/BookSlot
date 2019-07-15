const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');
const moment = require('moment');
const moment_timezone = require('moment-timezone');

const Hashids = require("hashids");
const hashids = new Hashids('sdfsd');

const {Users} = require('../../models/users');
const {Meetings} = require('../../models/meetings');

const validInput = require('../../Validation/register');
const validLogin = require('../../Validation/login');

//@route POST api/auth/register
//@description register user
router.post('/register' , (req,res) => {
    
    // fetch required data from req.body
    let body = _.pick(req.body,['email','fullName','password','timezone']);
    const { errors, isValid } = validInput(body);
    
    // check for errors
    if (!isValid) {
        res.status(400).json(errors);
    } else {
        
        // prepare query search condition data
        let data = {
            'register': {
                body
            }
        }
        
        // find if user already exists
        Users.findUser(data).then((user) => {
            if (!user) {
                
                // if user not exist
                // create model instance
                // save
                let user = new Users(body);
                user.save().then((resp) => {
                    if (resp) {
                        
                        // return json response
                        let data = {
                            data: user,
                            message: "Registration Successfull"
                        }
                        return res.status(201).json([data]);                            
                    }
                }).catch((err) => {
                    let data = {
                        data: [],
                        message: "Registration Failed!"
                    }
                    return res.status(400).json([data]);
                })     
            } else {
                let data = {
                    message: "User with same email or name already exists"
                }
                return res.status(409).json([data]);
            }
        });
        
    }
    
});

//@route POST api/auth/login
//@description login user
router.post('/login', (req,res) => {
    
    let body = _.pick(req.body,['email','password']);
    const { errors, isValid } = validLogin(body);
    
    if (!isValid) {
        res.status(400).json(errors);
    } else {
        
        let searchData = {
            body
        }
        
        Users.findUser(searchData).then((user) => {
            console.log("user in call ",user);
            if (user) {
                let data = {
                    data: user,
                    message: "Login Successfull"
                }
                return res.status(200).json([data]);
            } else {
                let data = {
                    data: [],
                    message: "Login Failed"
                }
                return res.status(404).json([data]);
            }
        });
        
    }
    
});

//@route GET api/auth/getUser
//@description get user
router.get('/getUser', (req,res) => {
    
    if (req.query && req.query.fullName) {
        
        let searchData = {
            body: req.query
        }
        
        Users.findUser(searchData).then((user) => {
            if (user) {
                let data = {
                    data: user,
                    message: "User retrieved successfully"
                }
                return res.status(200).json([data]);
            } else {
                let data = {
                    data: [],
                    message: "User does not exist"
                }
                return res.status(404).json([data]);
            }
        });
        
    }
    
});

//@route GET api/auth/getMeetings
//@description get user meetings
router.get('/getMeetings', (req,res) => {
    console.log("here ",req.query);
    if (req.query && req.query.fullName && req.query.email && req.query.timezone) {
        
        let searchData = {
            body: {
                fullName: req.query.fullName,
                email: req.query.email
            }
        }
        
        // find user meetings.
        Meetings.findUserMeetings(searchData).then((meet) => {
            if (meet && meet.length > 0) {
                
                // return meeting date acc to user  timezone.
                // return _id in hash(encoded)
                meet.forEach((meeting) => {
                    let utcCutoff = moment.utc(meeting.date, 'YYYY-MM-DD HH:mm:ss').tz(req.query.timezone);
                    meeting.date = utcCutoff.format('YYYY-MM-DD hh:mm A');
                    meeting._id = hashids.encodeHex(meeting['_id']);
                });

                let data = {
                    data: meet,
                    message: "User meetings retrieved successfully"
                }
                return res.status(200).json([data]);
                
            } else {
                let data = {
                    data: [],
                    message: "No Meetings available"
                }
                return res.status(404).json([data]);
            }
        });
        
    }
    
});

//@route POST api/auth/saveMeeting
//@description save meeting
router.post('/saveMeeting', (req,res) => {
        
    let body = _.pick(req.body,['fullName','email','bookedBy','date','timezone']);
    if (body && body.fullName && body.email && body.bookedBy && body.date && body.timezone) {
        
        // save the meeting date in UTC
        let utcDate = moment.tz(body.date, "YYYY-MM-DD HH:mm:ss", body.timezone).utc().format();
        body.date = utcDate;
        
        // save meeting.
        let meeting = new Meetings(body);
        meeting.save().then((meet) => {
            if (meet) {
                let data = {
                    data: meet,
                    message: "meeting scheduled successfully"
                }
                return res.status(201).json([data]);                            
            }
        }).catch((err) => {
            console.log(err);
            let data = {
                data: [],
                message: "Unable to book your meeting. Try again!!"
            }
            return res.status(400).json([data]);
        });
        
    }

});

//@route PUT api/auth/deleteMeeting
//@description delete user meeting
router.put('/deleteMeeting', (req,res) => {
        
    let body = _.pick(req.body,['_id','fullName','email','bookedBy','date']);
    if (body && body._id && body.fullName && body.email && body.bookedBy && body.date) {
        
        // decode meeting _id
        body._id = hashids.decodeHex(body._id);
        Meetings.deleteMeeting(body).then((meet) => {
            if (meet) {
                let data = {
                    data: meet,
                    message: "meeting deleted successfully"
                }
                return res.status(200).json([data]);                            
            }
        }).catch((err) => {
            console.log(err);
            let data = {
                data: [],
                message: "Unable to delete meeting. Try again!!"
            }
            return res.status(400).json([data]);
        });
        
    }

});

module.exports = router;
