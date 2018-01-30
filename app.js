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

app.get("/", function(req, res){
	res.render("landing");
})

// Index - show all outdoor spaces
app.get("/outdoorspaces", function(req, res) {
	Outdoorspace.find({}, function(err, allOutdoorspaces) {
		if(err) {
			console.log(err);
		} else {
			res.render("outdoorspaces/index", {outdoorspaces: allOutdoorspaces});
		}
	});
});

// Create - add new outdoor space to DB
app.post("/outdoorspaces", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newOutdoorspace = {name: name, image: image, description: desc};
	Outdoorspace.create(newOutdoorspace, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/outdoorspaces");
		}
	});
});

// New - show form to create new outdoor space
app.get("/outdoorspaces/new", function(req, res) {
	res.render("outdoorspaces/new");
})

app.get("/outdoorspaces/:id", function(req, res) {
	Outdoorspace.findById(req.params.id).populate("comments").exec(function(err, foundOutdoorspace) {
		if(err) {
			console.log(err);
		} else {
			res.render("outdoorspaces/show", {outdoorspace: foundOutdoorspace});
		}
	});
});

// ==================
// COMMENTS ROUTES
// ==================

app.get("/outdoorspaces/:id/comments/new", isLoggedIn, function(req, res) {
	// find outdoorspace by id
	Outdoorspace.findById(req.params.id, function(err, outdoorspace) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {outdoorspace: outdoorspace});
		}
	});
});

app.post("/outdoorspaces/:id/comments", isLoggedIn, function(req, res) {
	// lookup outdoor space using ID
	Outdoorspace.findById(req.params.id, function(err, outdoorspace) {
		if (err) {
			console.log(err);
			res.redirect("/outdoorspaces");
		} else {
			// create new comment
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					// connect new comment to outdoor space
					outdoorspace.comments.push(comment);
					outdoorspace.save();
					// redirect to outdoorspace show page
					res.redirect("/outdoorspaces/" + outdoorspace._id);
				}
			});
		}
	});
});

// ============
// Auth Routes
// ============

// Show register form
app.get("/register", function(req, res) {
	res.render("register");
});

// Handle Sign up logic
app.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/outdoorspaces");
		});
	});
});

// Show login form
app.get("/login", function(req, res) {
	res.render("login");
});

// Handle login logic
app.post("/login", passport.authenticate("local", 
	{
    	successRedirect: "/outdoorspaces",
    	failureRedirect: "/login",
	}), function(req, res) {
});

// Logout route
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/outdoorspaces");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, () => console.log('The Outdoorsy server has started!'));