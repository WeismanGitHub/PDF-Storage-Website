const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide a name.'],
        minLength: 1,
        maxLength: 75,
    },
    email: {
        type: String,
        required: [true, 'Must provide an email.'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Must provide a valid email.',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Must provide a password.'],
        minLength: 6,
        maxLength: 5000,
    },
},
{timestamps: true}
);

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('findOneAndUpdate', async function() {
    const user = this.getUpdate();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

UserSchema.methods.createJWT = function() {
    return jwt.sign(
        {userId: this._id, name: this.name},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME},
    );
};

UserSchema.methods.checkPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('users', UserSchema);