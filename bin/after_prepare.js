'use strict';

module.exports = function (context) {
	var req = context.requireCordovaModule,
		Q = req('q'),
		path = req('path'),
		fs = require("./lib/filesystem")(Q, req('fs'), path),
		settings = require("./lib/settings")(fs, path),
		platforms = {};

	platforms.ios = require("./lib/ios")(Q, fs, path, req('plist'), req('xcode'));

	return settings.get()
		.then(function (config) {
			var promises = [];
			context.opts.platforms.forEach (function (platformName) {
				if (platforms[platformName] && platforms[platformName].build) {
					promises.push (platforms[platformName].build (config));
				}
			});
			return Q.all(promises);
		})
		.catch(function(err) {
			if (err.code === 'NEXIST') {
				console.log("app-settings.json not found: skipping build");
				return;
			}

			throw err;
		});
};
