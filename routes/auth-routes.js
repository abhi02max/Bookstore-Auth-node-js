const express = require('express');
const {registeruser,loginuser,changePassword} = require('../Controllers/auth-controller');
const router = express.Router();


router.post('/register',registeruser);
router.post('/login',loginuser);
router.post('/changepassword', changePassword);


module.exports = router