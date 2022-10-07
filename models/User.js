const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
        },
        // userRole: {
        //     type: String,
        //     enum: ['admin', 'tutor', 'student', 'not assigned'],
        //     default: 'not assigned'
        // },
        // isAdmin: {
        //     type: Boolean,
        //     default: 0
        // },
        // isTutor: {
        //     type: Boolean,
        //     default: 0
        // }
        
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', UserSchema)