'use strict';

module.exports = function (context) {
	var req = context.requireCordovaModule,

		Q = req('q'),
		path = req('path'),
		fs = require("./lib/filesystem")(Q, req('fs'), path),
		settings = require("./lib/settings")(fs, path),
		ios = require("./lib/ios")(Q, fs, path, req('plist'), req('xcode'));

    return settings.get()
		.then(function (config) {
			return ios.clean(config)
		})
		.then(settings.remove)
		.catch(function(err) {
			if (err.code === 'NEXIST') {
				console.log("app-settings.json not found: skipping clean");
				return;
			}

			throw err;
		});
};
