// Middlewares
let campground = require("../models/campground");
let comment = require("../models/comment");

module.exports = {
    isLoggedIn : function(req, res, next) { // Middleware to check whether the user is logged in or not.
        if(req.isAuthenticated())
            return next();
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    },

    isLoggedOut : function(req, res, next) { // Middleware to check whether the user is logged Out or not.
        if(!req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error", "You need to logout first!");
            res.redirect("/");
        }
    },

    isAuthorized_Campground : function(req, res, next) {   //Checking whether user is authorized to edit/delete a campground.
        if(req.isAuthenticated()) {
            campground.findById(req.params.id, (err, foundCampground) => {
                if(err) {
                    console.log(`Error : ${err}`);
                    req.flash("error", "Something went wrong.");
                    res.redirect("back");
                } else {
                    if(foundCampground) {
                        if(foundCampground.author.id.equals(req.user._id))
                            next();
                        else {
                            req.flash("error", "You are not authorized to do that.");
                            res.redirect("back");
                        } 
                    } else { 
                        req.flash("error", "No such Campground exists!");    // refer routes/campgrounds to understand err handling this.
                        res.redirect("/campgrounds");  
                    }
                }
            });
        }
        else 
        {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    },

    isAuthorized_Comment : function(req, res, next) { //Checking whether user is authorized to edit/delete a comment.
        if(!req.isAuthenticated())
        {
            req.flash("error", "You need to be logged in to do that!");
            return res.redirect("back");
        }
        comment.findById(req.params.id_comment, (err, foundComment) => {
            if(err)
            {
                console.log(`Error : ${err}`);
                req.flash("error", "Something went wrong.");
                res.redirect("back");
            }
            else {
                if(foundComment)
                {
                    if(foundComment.author.id.equals(req.user._id))
                        next();
                    else {
                        req.flash("error", "You are not authorized to do that.");
                        res.redirect("back");
                    }
                } else {
                    req.flash("error", "No such comment exists!");    // refer routes/campgrounds to understand err handling this.
                    res.redirect("/campgrounds");  
                }
            }
        });
    }
};