// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const bodyParser = require('body-parser');
const app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Using CORS to allow the API to access the callback endpoint.
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Track users data as they verify
let verificationMap = {};

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
	response.sendFile(__dirname + "/views/index.html");
});

app.get("/verified", (request, response) => {
	response.sendFile(__dirname + "/views/verified.html");
});

// This endpoint has been set as the callback URL in the Settings Panel.
app.post("/callback", (request, response) => {
	console.log(request.body);
	if(request.body.verified && request.body.apiSecret === process.env.API_SECRET) {
		// Send back the users profileID and their favorite animal.
		response.json({
			redirectURL: "http://parretlabs.xyz:8015/verified#" + Buffer.from(request.body.profileID + "|" + verificationMap[request.body.verificationToken]).toString('base64')
		});
	}
});

// This endpoint stores the animal in the verification map for later use then gives the user the verification URL.
app.post("/verify", (request, response) => {
	if(request.body.animal) {
		request.body.animal = String(request.body.animal).slice(0, 50);
		fetch(process.env.API_URL + "/api/v2/generate_verification_link", {
			method: "POST",
			headers: {
				"Authorization": "Basic " + process.env.API_KEY
			}
		}).then(a => a.json()).then(json => {
			verificationMap[json.verificationToken] = request.body.animal;
			
			console.log(json);
			
			response.json({
				url: json.url
			});
		});
	}
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
