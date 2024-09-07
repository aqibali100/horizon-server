const express = require('express');
const { registerUser, loginUser, passwordResetEmail, ResetPassword, getUserById, updateRole } = require('../controllers/controller.users');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/password-reset-email', passwordResetEmail);
router.post('/reset-password/:token', ResetPassword);
router.patch('/update-role/:userId', updateRole);
router.get('/user/:id', getUserById);


module.exports = router;
