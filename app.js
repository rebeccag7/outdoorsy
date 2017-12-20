var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/outdoor_spaces");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var outdoorspaceSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Outdoorspace = mongoose.model("Outdoorspace", outdoorspaceSchema);

/*
Outdoorspace.create(
    {
        name: "Rock Milton Park", 
        image: "https://farm5.staticflickr.com/4585/37643820335_408da9b83e.jpg"
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
			res.render("outdoorspaces", {outdoorspaces: allOutdoorspaces});
		}
	});
});

app.post("/outdoorspaces", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var newOutdoorspace = {name: name, image: image};
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

app.listen(3000, () => console.log('The Outdoorsy server has started!'));