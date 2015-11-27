/**
 * Decode a custom config file format into the elements needed to build iOS preference xml
 *
 *
 */
'use strict';

var commonMappings = {
	title: {
		ios: "Title"
	},
	key: {
		ios: "Key"
	},
	default: {
		ios: "DefaultValue"
	},
	description: {
		ios: "FooterText"
	},
};

module.exports = {
	group: {
		ios: "PSGroupSpecifier",
		attrs: {
			description: commonMappings.description,
			title: commonMappings.title
		}
	},
	selectNotSupported: {
		ios: "PSMultiValueSpecifier",
		attrs: {
			key:     commonMappings.key,
			title:   commonMappings.title,
			default: commonMappings.default,
		}
	},
	radio: {
		ios: "PSRadioGroupSpecifier",
		required: ["title", "key", "default"],
		attrs: {
			key:     commonMappings.key,
			title:   commonMappings.title,
			default: commonMappings.default,
			description: commonMappings.description,
		},
		fixup: {
			ios: function (element, config) {
				element.Titles = [];
				element.Values = [];
				config.items.forEach(function(a) {
					element.Values.push(a.id || a.value);
					element.Titles.push(a.title || a.name);
				});
			}
		}
	},
	toggle: {
		ios: "PSToggleSwitchSpecifier",
		types: "boolean",
		required: ["title", "key", "default"],
		attrs: {
			key:     commonMappings.key,
			title:   commonMappings.title,
			default: commonMappings.default,
		}
	},
	textfield: {
		ios: "PSTextFieldSpecifier",
		types: "string",
		required: ["key"],
		attrs: {
			keyboard: {
				ios: "KeyboardType",
				value: {
					// Alphabet , NumbersAndPunctuation , NumberPad , URL , EmailAddress
					// text, number, textUri, textEmailAddress
					// ios: https://developer.apple.com/library/ios/documentation/PreferenceSettings/Conceptual/SettingsApplicationSchemaReference/Articles/PSTextFieldSpecifier.html#//apple_ref/doc/uid/TP40007011-SW1
					number: {ios: "NumberPad"},
					text: {ios: "Alphabet"},
					uri: {ios: "URL"},
					email: {ios: "EmailAddress"}
				}
			},
			key:     commonMappings.key,
			title:   commonMappings.title,
			default: commonMappings.default,
		}
	},
	sliderNotSupported: {
		// iOS:
		//@TODO: PSSliderSpecifier
		//Key
		//DefaultValue
		//MinimumValue
		//MaximumValue
	},
	titleNotSupported: {
		// please use group for this, ios only
		// TODO: probably it is good idea to add title automatically:
		// 1. if you want to show wide text input without title
		// 2. for a slider
	}
};
