let express                 = require("express");
let mongoose                = require("mongoose");
let app                     = express();
let port                    = 3000;
let bodyParser              = require("body-parser");
let passport                = require("passport");
let flash                   = require("connect-flash");
let localStrategy           = require("passport-local");
let passportLocalMongoose   = require("passport-local-mongoose");
let campground              = require("./models/campground");   // Campground Schema
let comment                 = require("./models/comment");     // Comment Schema
let user                    = require("./models/user");       // User Schema
let seedDb                  = require("./seed");             // Seed file
let methodOverride          = require("method-override");
//Requiring routes
let campgroundRoutes        = require("./routes/campgrounds");
let commentRoutes           = require("./routes/comments");
let indexRoutes             = require("./routes/index");
//seedDb();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//Passport congifguration
app.use(require("express-session") ({
        secret : "$afd%F23SDfdsf4%F#@^%@KK@3f&SFTAS$!",
        resave : false,
        saveUninitialized : false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(express.static("public"));  //Middleware that will be called on every route.
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;   // Passing req.user to the every template;
    res.locals.error = req.flash("error"); // adding flash message to every page
    res.locals.success = req.flash("success"); // adding flash message to every page
    next();        //calling next middleware / callback function.
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port, "localhost", () => {
    console.log(`Server has started on port ${port}`);
});

