const express = require('express');

const dotenv = require('dotenv').config();

const router = express.Router();

const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User');

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value
        }
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.log(err)
        }
    }
));

// Google login Route

router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

// Retrieve User Data
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failure', successRedirect: '/dashboard' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });


// Route if something gone wrong
router.get('/login-failure', function(req, res) {
    res.status(401).send('Something Gone Wrong 😢...')
});


// Destroy User Session when Log out
router.get('/logout', function(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.send('Error When Log Out 😢...')
        } else {
            res.redirect('/');
        }
    });
});


// Persist user data after successful authentication
passport.serializeUser(function(user, done) {
    done(null, user.id);
})


// Retrieve user data from session
passport.deserializeUser(async(id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


module.exports = router;