// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../user/user'); // We need the User model to check things if necessary

/**
 * This is our main "hall monitor". It checks if the user has a valid hall pass (JWT).
 * It's the first line of defense.
 */
const protect = async (req, res, next) => {
    let token;

    // A hall pass (token) is usually sent in the request headers like this: "Authorization: Bearer <the_long_token_string>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get the token out of the header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token is real and not expired using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // 3. If the token is valid, the `decoded` variable now holds the payload: { userid, username, role }
            // We'll attach this user info to the request object so our other routes can use it.
            req.user = decoded;

            next(); // Everything is good! Let the user proceed to the route they wanted to access.

        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

/**
 * This is our "special key" checker. It checks if the user is an admin.
 * This should always be used AFTER the `protect` middleware has run.
 */
const isAdmin = (req, res, next) => {
    // The `protect` middleware added `req.user`. Now we can check it.
    if (req.user && req.user.role === 'admin') {
        next(); // The user is an admin, let them pass!
    } else {
        // 403 Forbidden is the right status code for "I know who you are, but you are not allowed in here."
        res.status(403).json({ success: false, message: 'Not authorized. You must be an admin.' });
    }
};

module.exports = { protect, isAdmin };