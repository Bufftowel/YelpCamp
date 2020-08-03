let express                 = require("express");
let mongoose                = require("mongoose");
let app                     = express();
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

require("dotenv").config();
let uri = `mongodb+srv://bufftowel:${process.env.mongoPass}@cluster0-cq1rz.mongodb.net/yelp_camp?retryWrites=true&w=majority`;
mongoose.connect(uri , {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify : false});
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
    res.locals.currentUser = req.user;   // Passing req.user to the every templat   e;
    res.locals.error = req.flash("error"); // adding flash message to every page
    res.locals.success = req.flash("success"); // adding flash message to every page
    next();        //calling next middleware / callback function.
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
});

