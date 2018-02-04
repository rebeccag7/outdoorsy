var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Outdoorspace  = require("./models/outdoorspace"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

var commentRoutes      = require("./routes/comments"),
    outdoorspaceRoutes = require("./routes/outdoorspaces"),
    indexRoutes        = require("./routes/index")

mongoose.connect("mongodb://localhost/outdoor_spaces");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// Passport Configuration
app.use(require("express-session")({
	secret: "This is a secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRoutes);
app.use("/outdoorspaces", outdoorspaceRoutes);
app.use("/outdoorspaces/:id/comments", commentRoutes);

/*Outdoorspace.create(
    {
        name: "Rock Milton Park", 
        image: "https://farm5.staticflickr.com/4585/37643820335_408da9b83e.jpg",
        description: "This place is so beautiful, rocks of all shapes and sizes will 'rock' your time here!"
    }, function(err, outdoorspace) {
        if(err){
            console.log(err);
        } else {
            console.log("Newly created outdoor space");
            console.log(outdoorspace);
        }
    });
*/

app.listen(3000, () => console.log('The Outdoorsy server has started!'));