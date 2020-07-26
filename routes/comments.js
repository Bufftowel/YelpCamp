let express = require("express");
let router   = express.Router();
let campground = require("../models/campground");
let comment = require("../models/comment");
let middleware = require("../middleware"); // index.js is required by default.

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req, res) => {
    campground.findById(req.params.id, (err, result) => {
        if(err)
            console.log(`Error: ${err}`);
        else 
        res.render("comments/new", {campground : result});
    }); 
})

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    campground.findById(req.params.id, (err, result) => {
        if(err) {
            console.log(`Error: ${err}`);
            res.redirect(`/campgrounds`);
        } else {
            comment.create(req.body.comment, (err, newComment) => {
                if(err) {
                    console.log(`Error: ${err}`);
                    res.redirect(`/campgrounds`);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
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

///edit route
router.get("/campgrounds/:id/comments/:id_comment/edit", middleware.isAuthorized_Comment, (req, res) => {
    comment.findById(req.params.id_comment, (err, result) => {
        if(err)
            console.log(`Error: ${err}`);
        else 
            res.render("comments/edit", {comment : result, campground_id : req.params.id});
    }); 
})

//update route
router.put("/campgrounds/:id/comments/:id_comment/edit", middleware.isAuthorized_Comment, (req, res) => {
    comment.findByIdAndUpdate(req.params.id_comment, req.body.comment, (err, result) => {
        if(err)
            console.log(`Error: ${err}`);
        else 
            res.redirect("/campgrounds/" + req.params.id);
    });
})

//Destroy route
router.delete("/campgrounds/:id/comments/:id_comment", middleware.isAuthorized_Comment, (req, res) => {
    comment.findByIdAndDelete(req.params.id_comment, (err, deletedComment) => {
        if(err)
            console.log(`Error: ${err}`);
        else {
            req.flash("success", "Successfully deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    }); 
})

module.exports = router;