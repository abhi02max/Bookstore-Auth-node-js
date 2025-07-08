// routes/protected-routes.js

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authmiddleware'); // Import our new hall monitors!

// Route 1: A profile page that ANY logged-in user can see.
// We just add our `protect` middleware before the main function.
// The flow is: Request -> `protect` middleware -> main route logic
router.get('/my-profile', protect, (req, res) => {
    // Because the `protect` middleware ran successfully, we know `req.user` exists.
    res.status(200).json({
        success: true,
        message: `Welcome to your profile, ${req.user.username}!`,
        userData: req.user
    });
});

// Route 2: An admin page that ONLY admins can see.
// We chain our middleware. First `protect` to check for a valid token, then `isAdmin` to check the role.
// The flow is: Request -> `protect` middleware -> `isAdmin` middleware -> main route logic
router.get('/admin-only-stuff', protect, isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: `Welcome to the secret admin dashboard, ${req.user.username}!`,
        secretData: "The treasure is buried under the big oak tree."
    });
});


module.exports = router;