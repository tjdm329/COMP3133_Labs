const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email']
    },
    city: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[A-Za-z\s]+$/.test(v);
            },
            message: 'City name can only contain alphabets and spaces'
        }
    },
    website: {
        type: String,
        required: true,
        validate: [validator.isURL, 'Invalid URL']
    },
    zipcode: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{5}-\d{4}$/.test(v);
            },
            message: 'Zip code must be in 12345-1234 format'
        }
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d-\d{3}-\d{3}-\d{4}$/.test(v);
            },
            message: 'Phone number must be in 1-123-123-1234 format'
        }
    }
});

module.exports = mongoose.model('User', UserSchema);
