let express = require("express");
let router   = express.Router();
let user = require("../models/user");
let passport = require("passport");
let middleware = require("../middleware");

//Landing route
router.get("/", (req, res) => {
    res.render("home");
});

//Authentication routes

router.get("/register", middleware.isLoggedOut,(req, res) => {
    res.render("register");
});

router.post("/register", middleware.isLoggedOut, (req, res) => {
    let newUser = new user({username : req.body.username}); // we don't send the actual password
    user.register(newUser, req.body.password, (err, createdUser) => { // passport instead supplies a hashed password.
        if(err)
        {
            console.log(`Error : ${err}`);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local") (req, res, () => {
            req.flash("success", "Welcome " + createdUser.username + "!");
            res.redirect("/");
        });
    });
});

router.get("/login", middleware.isLoggedOut, (req, res) => {
    res.render("login");
});

router.post("/login", middleware.isLoggedOut, passport.authenticate("local", {
        successRedirect : "/campgrounds",
        failureRedirect : "/login",
        failureFlash : true
    }) , (req, res)=> {
});

//Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;