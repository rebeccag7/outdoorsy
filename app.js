var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
})

app.get("/outdoorspaces", function(req, res) {
	var outdoorspaces = [
		{name: "Webb Bridge Park", image: "https://farm1.staticflickr.com/17/93685750_30be6061a2.jpg"},
		{name: "Rock Milton Park", image: "https://farm5.staticflickr.com/4585/37643820335_408da9b83e.jpg"},
		{name: "Amicalolla Falls", image: "https://farm6.staticflickr.com/5463/10053135685_7711e59c85.jpg"}
	]

	res.render("outdoorspaces", {outdoorspaces: outdoorspaces});
});

app.listen(3000, () => console.log('The Outdoorsy server has started!'));