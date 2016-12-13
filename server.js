var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var env = require('node-env-file');

// Load environment variables for localhost
try {
	env(__dirname + '/.env');
} catch (e) {}

var app = express();

var port = process.env.PORT || 5000;
var https_port = process.env.HTTPS_PORT || parseInt(port) + 1;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/node/ejs/pages');

app.use(express.static(__dirname + '/node'));
app.use('/img/slds-icons/v5.2.0', express.static(__dirname + '/node/assets/icons')); // Modification for icons in Lightning Out

app.get('/', function(req, res) {
	res.render('index', {});
});

app.get('/verse', function(req, res) {
	res.render('verse', {consumerKey: process.env.FORCE_OAUTH_CONSUMER_KEY, verseSourceServer: process.env.VERSE_SOURCE_SERVER, lightningApp: "c:IBM_Verse_Mail_Retriever_App_LtngOut", lightningComponent: "c:IBM_Verse_Mail_Retriever"});
});

app.get('/oauthcallback', function(req, res) {
	res.render('oauthcallback', {});
});

// Create an HTTP service
http.createServer(app).listen(port);
console.log("Server listening for HTTP connections on port ", port);

// Create an HTTPS service if the certs are present
try {
	var options = {
	  key: fs.readFileSync('key.pem'),
	  cert: fs.readFileSync('key-cert.pem')
	};
	https.createServer(options, app).listen(https_port);
	console.log("Server listening for HTTPS connections on port ", https_port);
} catch (e) {
	console.error("Security certs not found, HTTPS not available");
}
