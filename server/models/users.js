const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Hashids = require("hashids");
const hashids = new Hashids('sdfsd');
const { JWT_SECRET } = require('../configuration/index.js');

// User Schema
let UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: 6,
        unique: true,
        trim: true,
        required: true
    },
    timezone: {
        type: String,
        required: true,
        trim: true
    }
});

// fields to return
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['fullName','email','timezone']);
}

// find user.
UserSchema.statics.findUser = function(data){
    var User = this;
    return new Promise((resolve, reject) => {
        
        let queryCondition = '';
        
        // making query condition
        if (data.register && data.register.body) {
            let body = data.register.body;
            
            // if for registration
            if (body.email && body.fullName) {
                
                // check for user with same name or email
                queryCondition = {
                        $or: [{
                        email: body.email
                    },{
                        fullName: body.fullName
                    }]
                }
            }
        } else {
            
            // else query with the body data
            let body = data.body;
            queryCondition = body
        }
        
        User.findOne(queryCondition).then((user) => {
            if (user) {
               resolve(user);
            }
            resolve(false);
        });

    });
};

//Creating Mongoose Model
let Users = mongoose.model('Users', UserSchema);

//Exporting Users 
module.exports = {
    Users
};