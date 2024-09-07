const { RegisterUser, LoginUser, sendResetPasswordEmail, findUserByToken, resetPassword, getUser, updateUserRole } = require('../services/service.users');
//Register User Controller
const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        const userId = await RegisterUser(userData);
        res.status(201).json({
            message: 'User Has Been Registerd Successfully!',
            userId
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
// Login User Controller
const loginUser = async (req, res) => {
    try {
        const userData = req.body;
        const { user, token } = await LoginUser(userData);
        res.status(200).json({
            message: 'User logged in successfully!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            token: token,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
// password reset email send Controller
const passwordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await sendResetPasswordEmail(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
//reset password Controller
const ResetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const { password } = req.body;
        const user = await findUserByToken(token);
        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }
        await resetPassword(user, password);
        res.send('Your password has been successfully reset.');
    } catch (error) {
        console.error('Error in reset password controller:', error);
        res.status(500).send('Internal Server Error');
    }
}
//Get User By Id controller
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUser(userId);
        res.status(200).json({
            message: 'User found successfully!',
            user: user
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
//update user role by userId
const updateRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    try {
        if (!['employer', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const updatedUser = await updateUserRole(userId, role);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    registerUser,
    loginUser,
    passwordResetEmail,
    ResetPassword,
    getUserById,
    updateRole,
};
