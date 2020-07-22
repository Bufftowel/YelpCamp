let express                 = require("express");
let mongoose                = require("mongoose");
let app                     = express();
let port                    = 3000;
let bodyParser              = require("body-parser");
let passport                = require("passport");
let localStrategy           = require("passport-local");
let passportLocalMongoose   = require("passport-local-mongoose");
let campground              = require("./models/campgound");    // Campground Schema
let comment                 = require("./models/comment");     // Comment Schema
let user                    = require("./models/user");       // User Schema
let seedDb                  = require("./seed");             // Seed file

seedDb();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Passport congifguration
app.use(require("express-session") ({
        secret : "$afd%F23SDfdsf4%F#@^%@KK@3f&SFTAS$!",
        resave : false,
        saveUninitialized : false 
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.listen(port, "localhost", () => {
    console.log(`Server has started on port ${port}`);
});

app.use(express.static("public"));  //Middleware that will be called on every route.
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;   // Passing req.user to the every template;
    next();        //calling next middleware / callback function.
});

//Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", (req, res) => {
    // Getting all campgrounds from db
    campground.find({}, (err, allCampgrounds) => {
        if(err)
            console.log(`Error : ${err}`);
        else
            res.render("campgrounds/index", {campgrounds : allCampgrounds});
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
    res.render("campgrounds/new");
});

// show route
app.get("/campgrounds/:id", (req, res) => {
    // find campground with requested id
    campground.findById(req.params.id).populate("comments").exec((err, result) => {
        if(err)
            console.log(`Error: ${err}`);
        else 
            res.render("campgrounds/show", {campground: result});
    });
});

//Comments routes
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    campground.findById(req.params.id, (err, result) => {
        if(err)
            console.log(`Error: ${err}`);
        else 
        res.render("comments/new", {campground : result});
    }); 
})

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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


//Authentication routes

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
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

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }) , (req, res)=> {
});

//Loogout Route
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) { // Middleware to check whether the user is logged in or not.
    if(req.isAuthenticated())
        return next();
    res.redirect("/login");
}