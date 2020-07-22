let express = require("express");
let router   = express.Router();
let campground = require("../models/campground");
let comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    campground.findById(req.params.id, (err, result) => {
        if(err)
            console.log(`Error: ${err}`);
        else 
        res.render("comments/new", {campground : result});
    }); 
})

router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    campground.findById(req.params.id, (err, result) => {
        if(err) {
            console.log(`Error: ${err}`);
            res.redirect(`/campgrounds`);
        } else 
        {
            comment.create(req.body.comment, (err, newComment) => {
                if(err) {
                    console.log(`Error: ${err}`);
                    res.redirect(`/campgrounds`);
                } else {
                    result.comments.push(newComment);
                    result.save((err, updatedCampgound) => {
                        if(err) {
                            console.log(`Error: ${err}`);
                            res.redirect(`/campgrounds`);
                        } else  
                            res.redirect(`/campgrounds/${req.params.id}`);  
                    })
                }
            });
        }
    }); 
})

function isLoggedIn(req, res, next) { // Middleware to check whether the user is logged in or not.
    if(req.isAuthenticated())
        return next();
    res.redirect("/login");
}

module.exports = router;