const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Hashids = require("hashids");
const hashids = new Hashids('sdfsd');
const { JWT_SECRET } = require('../configuration/index.js');

// Meeting Schema
let MeetingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    bookedBy: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    }
});

// fields to return
MeetingSchema.methods.toJSON = function() {
    let meet = this;
    let meetObject = meet.toObject();

    return _.pick(meetObject, ['_id','fullName','email','bookedBy','date','timezone']);
}

// returns user meetings.
MeetingSchema.statics.findUserMeetings = function(data){
    let Meeting = this;
    return new Promise((resolve, reject) => {
        
        Meeting.find(data.body).lean().then((meet) => {
            
            if (meet) {
               resolve(meet);
            }
            resolve(false);
        })

    });
};

// delete user meeting.
MeetingSchema.statics.deleteMeeting = function(data){
    let Meeting = this;
    return new Promise((resolve, reject) => {
        
        Meeting.deleteOne({
            _id: data._id
        }).lean().then((meet) => {
            
            if (meet) {
               resolve(meet);
            }
            resolve(false);
        })

    });
};

//Creating Mongoose Model
let Meetings = mongoose.model('Meetings', MeetingSchema);

//Exporting Meetings 
module.exports = {
    Meetings
};