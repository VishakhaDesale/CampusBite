// Import required modules
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Signin button link
router.get(
    "/signin",
    (req, res, next) => {
        console.log("Google sign-in route was called"); 
        console.log(req, res); 
         // Debugging log
        next();  // Proceed with authentication
    },
    passport.authenticate(
        "google",
        {
            prompt: "select_account",
            scope: ["profile", "email"]
        }
    )
);

// Signout button link
// router.get(
//     "/signout",
//     (req, res, next) => {
//         console.log("Google sign-out route was called");  // Debugging log
//         next();  // Proceed with authentication
//     },
//     (req, res) => {
//         req.logout();
//         res.redirect(process.env.FRONTEND);
//     }
// );

router.get(
    "/signout",
    (req, res, next) => {
        console.log("Google sign-out route was called");  // Debugging log
        
        // Call req.logout and provide a callback function to handle errors
        req.logout(function (err) {
            if (err) {
                return next(err);  // Pass the error to the next middleware
            }
            res.redirect(process.env.FRONTEND);  // Redirect to frontend after successful logout
        });
    }
);


// For google redirection handling
// router.get(
//     "/google/callback",
//     (req, res, next) => {
//         console.log("Google callback route was called");  // Debugging log
//         next();  // Proceed with authentication
//     },
//     passport.authenticate("google", { failureRedirect: process.env.FRONTEND }),
//     (req, res) => {
//         res.redirect(process.env.FRONTEND);
//     }
// );
router.get('/google/callback', passport.authenticate('google', { failureRedirect: process.env.FRONTEND }),
    (req, res) => {
        // Call req.login() to establish a session
        req.login(req.user, (err) => {
            if (err) {
                console.error('Error during login:', err);
                return res.redirect(process.env.FRONTEND);
            }
            // Redirect after successful login
            res.redirect(process.env.FRONTEND);
        });
    }
);


module.exports = router;