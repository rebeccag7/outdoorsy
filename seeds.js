var mongoose = require("mongoose");
var Outdoorspace = require("./models/outdoorspace");

var data = [
	{
        name: "Rock Milton Park", 
        image: "https://farm5.staticflickr.com/4585/37643820335_408da9b83e.jpg",
        description: "This place is so beautiful, rocks of all shapes and sizes will 'rock' your time here!"
    },
    {
        name: "Web Bridge Park", 
        image: "https://farm6.staticflickr.com/5019/5430814657_59c838989d.jpg",
        description: "Beautiful forest trail in the heart of the city."
    },
    {
        name: "Amicalolla Falls", 
        image: "https://farm9.staticflickr.com/8292/7748568122_c75cb48dea.jpg",
        description: "Waterfalls like no other, hiking trail with resort ;)"
    },
    {
        name: "John's Creek Park", 
        image: "https://farm5.staticflickr.com/4446/37674688906_3b26bd97cc.jpg",
        description: "Gorgeous city park, a piece of calm in the middle of chaos."
    }
];

function seedDB() {
	// Remove all outdoor spaces
	Outdoorspace.remove({}, function(err) {
		if(err) {
			console.log(err);
		}
		console.log("removed outdoor spaces!");
		// Add a few outdoorspaces
    	data.forEach(function(seed) {
	    	Outdoorspace.create(seed, function(err, data) {
	    		if(err) {
	    			console.log(err);
	    		} else {
	    			console.log("Added an outdoor space.");
	    		}
	    	});
    	});
    });
}

module.exports = seedDB;


