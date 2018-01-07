var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Outdoorspace = require("./models/outdoorspace"),
    Comment      = require("./models/comment"),
    seedDB       = require("./seeds");

mongoose.connect("mongodb://localhost/outdoor_spaces");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

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

app.get("/outdoorspaces", function(req, res) {
	Outdoorspace.find({}, function(err, allOutdoorspaces) {
		if(err) {
			console.log(err);
		} else {
			res.render("outdoorspaces/index", {outdoorspaces: allOutdoorspaces});
		}
	});
});

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

app.get("/outdoorspaces/:id/comments/new", function(req, res) {
	// find outdoorspace by id
	Outdoorspace.findById(req.params.id, function(err, outdoorspace) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {outdoorspace: outdoorspace});
		}
	});
});

app.post("/outdoorspaces/:id/comments", function(req, res) {
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

app.listen(3000, () => console.log('The Outdoorsy server has started!'));