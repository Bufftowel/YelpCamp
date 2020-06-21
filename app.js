let express     =  require("express");
let mongoose    = require("mongoose");
let app         = express();
let port        = 3000;
let bodyParser  = require("body-parser");
let campground  = require("./models/campgound");    // Campground Schema
let comment     = require("./models/comment");     // Comment Schema
//let user        = require("./models/user");     // User Schema
let seedDb      = require("./seed");             // Seed file

seedDb();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.listen(port, "localhost", () => {
    console.log(`Server has started on port ${port}`);
});

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", (req, res) => {
    // Getting all campgrounds from db
    campground.find({}, (err, allCampgrounds) => {
        if(err)
            console.log(`Error : ${err}`);
        else
            res.render("index", {campgrounds : allCampgrounds});
    });
});

app.post("/campgrounds", (req, res) => {
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

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

// show route
app.get("/campgrounds/:id", (req, res) => {
    // find campground with requested id
    campground.findById(req.params.id).populate("comments").exec((err, result) => {
        if(err)
            console.log(`Error: ${err}`);
        else 
            res.render("show", {campground: result});
    });
});
