var express      = require("express");
var router       = express.Router();
var Outdoorspace = require("../models/outdoorspace")

// Index - show all outdoor spaces
router.get("/", function(req, res) {
	Outdoorspace.find({}, function(err, allOutdoorspaces) {
		if(err) {
			console.log(err);
		} else {
			res.render("outdoorspaces/index", {outdoorspaces: allOutdoorspaces});
		}
	});
});

// Create - add new outdoor space to DB
router.post("/", function(req, res) {
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
router.get("/new", function(req, res) {
	res.render("outdoorspaces/new");
})

router.get("/:id", function(req, res) {
	Outdoorspace.findById(req.params.id).populate("comments").exec(function(err, foundOutdoorspace) {
		if(err) {
			console.log(err);
		} else {
			res.render("outdoorspaces/show", {outdoorspace: foundOutdoorspace});
		}
	});
});

module.exports = router;