const bcrypt = require('bcryptjs');
const User = require('../models/model.users');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');

//Register User
const RegisterUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email is Already Registered!');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = new User(userData);
    await user.save();
    return user._id;
};
//Login User
const LoginUser = async (userData) => {
    const { email, password } = userData;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('This Email is not Registered!');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Your Password is Incorrect!');
    }
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return { user, token };
};
//Reset password send email
const sendResetPasswordEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User with given email does not exist');
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('Error sending email:', err);
                    reject(err);
                } else {
                    resolve('Recovery email sent');
                }
            });
        });
    } catch (error) {
        console.error('Error in forgot password service:', error);
        throw error;
    }
};
//Reset password
const findUserByToken = async (token) => {
    return User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
};
const resetPassword = async (user, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
};
//Get single User By Id
const getUser = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format.');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found!');
    }
    return user;
};
//update user role by userId
const updateUserRole = async (userId, role) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        );
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};
module.exports = {
    RegisterUser,
    LoginUser,
    sendResetPasswordEmail,
    findUserByToken,
    resetPassword,
    getUser,
    updateUserRole,
};
