// routes.js

const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(express.static(__dirname));

router.post('/login', (req, res) => {
    console.log('Received data:', req.body);
    res.redirect('RedirectProfile.html');
});
router.post('/signup', (req, res) => {
    console.log('Received data:', req.body);
    res.redirect('EmailVerificationPage.html');
});
router.post('/signupVerify', (req, res) => {
    console.log('Received data:', req.body);
    res.redirect('RedirectToLogin.html');
});
router.post('/forgotVerify', (req, res) => {
    console.log('Received data:', req.body);
    res.redirect('ResetPassword.html');
});
router.post('/Verify', (req, res) => {
    console.log('Received data:', req.body);
    res.redirect('Verification.html');
});


module.exports = router;
