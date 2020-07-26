let express    = require("express");
let router     = express.Router();
let campground = require("../models/campground");
let comment = require("../models/comment");
let middleware = require("../middleware"); // index.js is required by default.

router.get("/campgrounds", (req, res) => {
    // Getting all campgrounds from db
    campground.find({}, (err, allCampgrounds) => {
        if(err)
        {
            console.log(`Error : ${err}`);
            req.flash("error", "Something went wrong.");
            res.redirect("/");
        }
        else
            res.render("campgrounds/index", {campgrounds : allCampgrounds});
    });
});

router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
    campground.create(
    {
        name : req.body.groundName,
        image : req.body.groundImage,
        description : req.body.groundText,
        author : {
                id : req.user._id,
                username : req.user.username
            }
    }, (err, data) => {
        if(err)
        {
            console.log(`Error : ${err}`);
            req.flash("error", "Could not create the campground due to internal error.");
            res.redirect("/campgrounds");
        }
        else 
            res.redirect("/campgrounds");
    });
});

router.get("/campgrounds/new", middleware.isLoggedIn,  (req, res) => {
    res.render("campgrounds/new");
});

// show route
router.get("/campgrounds/:id", (req, res) => {
    // find campground with requested id
    campground.findById(req.params.id).populate("comments").exec((err, result) => {
        if(err)
        {
            console.log(`Error: ${err}`);
            req.flash("error", "No such campground exists!");
            res.redirect("/campgrounds");
        }
        else 
        {
            if(result) {                                                 // mongoose won't thorw an error
                res.render("campgrounds/show", {campground: result});   // even if it can't find the document  
            } else {                                                   // as long as it can cast the id in to an object id.
                req.flash("error", "No such campground exists!");     // if id has standard object length then it will be a valid object_id.
                res.redirect("/campgrounds");                        // Finding 0 matching elements is also a valid operation hance no error
            }                                                       // is thrown, so we need to handle that here.
           
        }
    });
});

router.get("/campgrounds/:id/edit", middleware.isAuthorized_Campground, (req, res) => {
    campground.findById(req.params.id , (err, foundCampground) => {
        if(err)
            return res.redirect("/campgrounds");                                        
        else
            res.render("campgrounds/edit", {campground : foundCampground});         // error handling is done in middleware.
    })
});

//update route
router.put("/campgrounds/:id", middleware.isAuthorized_Campground, (req, res) => {
    let newCampground = {
        name : req.body.groundName,
        image : req.body.groundImage,
        description : req.body.groundText,
    };
    campground.findByIdAndUpdate(req.params.id , newCampground , (err, updatedCampground) => {
        if(err)
            return res.redirect("/campgrounds");
        else
            res.redirect(`/campgrounds/${updatedCampground._id}`);
    })
});

//Destroy route
router.delete("/campgrounds/:id", middleware.isAuthorized_Campground, (req, res) => {
    campground.findByIdAndDelete(req.params.id, (err, deletedCampground) => {
        if(err)
            return res.redirect("/campgrounds" + req.params.id);
        comment.deleteMany({_id : {$in : deletedCampground.comments}}, (err) => {  // $in is includes operator.
                // Above statement deletes any comments where _id includes any id from deletedCampground.comments.
            if(err) {        // Instead of this we can also use a prehooks.
                console.log("Not able to delete comments!");
                return res.redirect("/campgrounds");
            }
            req.flash("success", "Successfully deleted.");
            res.redirect("/campgrounds");
        }); 
    })
});

module.exports = router;