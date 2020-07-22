let express = require("express");
let router   = express.Router();
let user = require("../models/user");
let passport = require("passport");

//Landing route
router.get("/", (req, res) => {
    res.render("home");
});

//Authentication routes

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    let newUser = new user({username : req.body.username}); // we don't send the actual password
    user.register(newUser, req.body.password, (err, createdUser) => { // passport instead supplies a hashed password.
        if(err)
        {
            console.log(`Error : ${err}`);
            return res.redirect("/register");
        }
        passport.authenticate("local") (req, res, () => {
            res.redirect("/");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }) , (req, res)=> {
});

//Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) { // Middleware to check whether the user is logged in or not.
    if(req.isAuthenticated())
        return next();
    res.redirect("/login");
}

module.exports = router;