"use strict";
/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Web3ValidatorError = void 0;
const web3_errors_1 = require("web3-errors");
const object_js_1 = require("./validation/object.js");
const errorFormatter = (error) => {
    if (error.message && error.instancePath && error.params && !(0, object_js_1.isNullish)(error.params.value)) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return `value "${error.params.value}" at "${error.instancePath}" ${error.message}`;
    }
    if (error.message && error.instancePath) {
        return `value at "${error.instancePath}" ${error.message}`;
    }
    if (error.instancePath) {
        return `value at "${error.instancePath}" caused unspecified error`;
    }
    if (error.message) {
        return error.message;
    }
    return 'unspecified error';
};
class Web3ValidatorError extends web3_errors_1.BaseWeb3Error {
    constructor(errors) {
        super();
        this.code = web3_errors_1.ERR_VALIDATION;
        this.errors = errors;
        super.message = `Web3 validator found ${errors.length} error[s]:\n${this._compileErrors().join('\n')}`;
    }
    _compileErrors() {
        const errorMsgs = this.errors.map(errorFormatter);
        return errorMsgs;
    }
}
exports.Web3ValidatorError = Web3ValidatorError;
//# sourceMappingURL=errors.js.map