const nodemailer = require('nodemailer');
const crypto = require('crypto');
const express=require('express');
const User = require('../Models/User.model');
const { authSchema } = require('../helpers/Validation_schema');
const router=express.Router();
const users = ['']; // In a real application, you would use a database to store user data.
// Route to initiate password reset
router.post('/forgot-password', async(req, res) => {
    console.log(users)
  const { email } = req.body;
//   const result =await authSchema.validateAsync(req.body);
  // Check if the email exists in your user database
  const doesExit= await User.findOne({email:email});
  if (doesExit) {
    // Generate a reset token
    const token = crypto.randomBytes(20).toString('hex');
    // Store the token with the user's email in a database or in-memory store
    // result.email.resetToken = token;
    // Send the reset token to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bc190409917@vu.edu.pk',
        pass: 'wgqh lvjr vkbd mufx',
      },
    });
    const mailOptions = {
      from: 'bc190409917',
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:6005/password/reset-password/:${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log(`Email sent: ${info.response}`);
        res.status(200).send('Check your email for instructions on resetting your password');
      }
    });
  } else {
    res.status(404).send('Email not found');
  }
});
// Route to handle the reset token
router.get('/reset-password', (req, res) => {
  const { token } = req.params;
  // Check if the token exists and is still valid
//   if (users.some(user => user.resetToken === token)) {
    // Render a form for the user to enter a new password
    res.send('<form method="post" action="/reset-password"><input type="password" name="password" required><input type="submit" value="Reset Password"></form>');
//   } else {
//     res.status(404).send('Invalid or expired token');
//   }
});
// Route to update the password
router.post('/reset-password', (req, res) => {
  const { token, password } = req.body;
  // Find the user with the given token and update their password
  const user = users.find(user => user.resetToken === token);
  if (user) {
    user.password = password;
    delete user.resetToken; // Remove the reset token after the password is updated
    res.status(200).send('Password updated successfully');
  } else {
    res.status(404).send('Invalid or expired token');
  }
});

module.exports = router;