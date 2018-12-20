/**
 * HELPERS
 */

const helpers = {
	tostr: function (value: any) {
		return Object.prototype.toString.call(value);
	},

	/**
	 * Check whether value is of type String
	 * @param {any} value
	 * @returns {boolean}
	 */
	isString: function (value: any): boolean {
		return Object.prototype.toString.call(value) === "[object String]";
	},

	/**
	 * Check whether value is of type String
	 * @param {any} value
	 * @returns {boolean}
	 */
	isNumber: function (value: any): boolean {
		return Object.prototype.toString.call(value) === "[object Number]" || !isNaN(parseFloat(value));
	},

	/**
	 * Check whether value is of type Object
	 * @param {any} value
	 * @returns {boolean}
	 */
	isObject: function (value: any): boolean {
		return Object.prototype.toString.call(value) === "[object Object]";
	},

	/**
	 * Check whether value is a valid URL
	 * @param {any} string
	 * @returns {boolean}
	 */
	isUrl: function (url: string): boolean {
		const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return regexp.test(url);
	},

	// function allPropsAreScalar(obj: any): boolean {
	//     let keys = Object.keys(obj);

	//     for (let i = 0; i < keys.length; i++) {
	//         const val = obj[keys[i]];
	//         const isAllowedScalar = isNumber(val) || isString(val);

	//         if (!isAllowedScalar) {
	//             return false;
	//         }
	//     }

	//     return true;
	// }

	/**
	 * Check whether string is valid with or without dashes
	 * @param {string} string
	 * @returns {boolean}
	 */
	isValidUUID: function (uuidString: string) {
		const validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		return (
			validUUIDRegex.test(uuidString) ||
			validUUIDRegex.test(
				uuidString.replace(
					/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/gi,
					"$1-$2-$3-$4-$5",
				),
			)
		);
	},

	getParameterByName: function (name: string) {
		var url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	},

	validateEmail: function (email: string) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}
}

export default helpers