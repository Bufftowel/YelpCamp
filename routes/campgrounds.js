let express = require("express");
let router   = express.Router();
let campground = require("../models/campground");

//Campground Routes
router.get("/campgrounds", (req, res) => {
    // Getting all campgrounds from db
    campground.find({}, (err, allCampgrounds) => {
        if(err)
            console.log(`Error : ${err}`);
        else
            res.render("campgrounds/index", {campgrounds : allCampgrounds});
    });
});

router.post("/campgrounds", (req, res) => {
    campground.create(
    {
        name : req.body.groundName,
        image : req.body.groundImage,
        description: req.body.groundText
    }, (err, data) => {
        if(err)
            console.log(`Error : ${err}`);
        else 
            res.redirect("/campgrounds");
    });
});

router.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// show route
router.get("/campgrounds/:id", (req, res) => {
    // find campground with requested id
    campground.findById(req.params.id).populate("comments").exec((err, result) => {
        if(err)
            console.log(`Error: ${err}`);
        else 
            res.render("campgrounds/show", {campground: result});
    });
});

module.exports = router;