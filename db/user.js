const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: String,
    userName: {
        type: String,
        unique: true,
        require: true
    },
    password: String,
    college: String,
    yearOfPassedOut: Number,
    telegramId: String,
    collegeCity: String,
    collegeDistrict: String,
    collegeState: String,
    receivedOnboarding: Boolean,
    role: Boolean,
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;