var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Outdoorspace = require("./models/outdoorspace");
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
			res.render("index", {outdoorspaces: allOutdoorspaces});
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
	res.render("new.ejs");
})

app.get("/outdoorspaces/:id", function(req, res) {
	Outdoorspace.findById(req.params.id).populate("comments").exec(function(err, foundOutdoorspace) {
		if(err) {
			console.log(err);
		} else {
			res.render("show", {outdoorspace: foundOutdoorspace});
		}
	});
});

app.listen(3000, () => console.log('The Outdoorsy server has started!'));