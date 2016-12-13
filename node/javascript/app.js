function forceInit() {
	force.init(config);
};

function forceLogin(key) {
	forceInit();
	force.login(function(success) {
		var oauth = force.getOauth();
		setupLightning();
	});
}

var _lightningReady = false;
var _verseObject; // Global Verse object that holds the data passed from Verse

function setupLightning(callback) {
  var lightningApp = config.lightningApp;
	var lightningComponent = config.lightningComponent;
	var oauth = force.getOauth();
    if (!oauth) {
        alert("Please login to Salesforce.com first!");
        return;
    }

	if (_lightningReady) {
		if (typeof callback === "function") {
			callback();
		}
	} else {
	    // Transform the URL for Lightning
	    var url = oauth.instanceUrl.replace("my.salesforce", "lightning.force");
	    console.log(_verseObject);
	    $Lightning.use(lightningApp,
	        function() {
						_lightningReady = true;
						document.getElementById("oauth").style.display = "none";
						$Lightning.createComponent(lightningComponent, { verseObject: _verseObject }, "component");
	        }, url, oauth.access_token);
	}
}
