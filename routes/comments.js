var express      = require("express");
var router       = express.Router({mergeParams: true});
var Outdoorspace = require("../models/outdoorspace")
var Comment      = require("../models/comment")

// Comments: new
router.get("/new", isLoggedIn, function(req, res) {
	// find outdoorspace by id
	Outdoorspace.findById(req.params.id, function(err, outdoorspace) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {outdoorspace: outdoorspace});
		}
	});
});

// Comments: create
router.post("/", isLoggedIn, function(req, res) {
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
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
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

// middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;