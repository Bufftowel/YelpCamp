let express = require("express");
let mongoose = require("mongoose");
let app = express();
let port = 3000;
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

// schema
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let campground = mongoose.model("campground", campgroundSchema);

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
            res.redirect("/index");
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.get("/campgrounds/:id", (req, res) => {
    res.render("show");
});