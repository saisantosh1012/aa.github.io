"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Validator = void 0;
const utils_js_1 = require("ethereum-cryptography/utils.js");
const blake2b_js_1 = require("ethereum-cryptography/blake2b.js");
const is_my_json_valid_1 = __importDefault(require("is-my-json-valid"));
const formats_js_1 = __importDefault(require("./formats.js"));
const errors_js_1 = require("./errors.js");
class Validator {
    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    constructor() {
        this._schemas = new Map();
    }
    static factory() {
        if (!Validator.validatorInstance) {
            Validator.validatorInstance = new Validator();
        }
        return Validator.validatorInstance;
    }
    getSchema(key) {
        return this._schemas.get(key);
    }
    addSchema(key, schema) {
        this._schemas.set(key, this.createValidator(schema));
    }
    // eslint-disable-next-line  class-methods-use-this
    createValidator(schema) {
        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
        // @ts-expect-error validator params correction
        return (0, is_my_json_valid_1.default)(schema, {
            formats: formats_js_1.default,
            greedy: true,
            verbose: true,
            additionalProperties: false,
        });
    }
    validate(schema, data, options) {
        const localValidate = this.getOrCreateValidator(schema);
        if (!localValidate(data)) {
            const errors = this.convertErrors(localValidate.errors, schema, data);
            if (errors) {
                if (options === null || options === void 0 ? void 0 : options.silent) {
                    return errors;
                }
                throw new errors_js_1.Web3ValidatorError(errors);
            }
        }
        return undefined;
    }
    convertErrors(errors, schema, data) {
        if (errors && Array.isArray(errors) && errors.length > 0) {
            return errors.map((error) => {
                let message;
                let keyword;
                let params;
                let schemaPath;
                schemaPath = Array.isArray(error.schemaPath) ?
                    error.schemaPath.slice(1).join('/') :
                    '';
                const {
                    field
                } = error;
                const _instancePath = schemaPath ||
                    // eslint-disable-next-line no-useless-escape
                    ((field === null || field === void 0 ? void 0 : field.length) >= 4 ? `${field.slice(4).replace(/\"|\[|\]/g, '')}` : '/');
                const instancePath = _instancePath ? `/${_instancePath}` : '';
                if ((error === null || error === void 0 ? void 0 : error.message) === 'has less items than allowed') {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const schemaData = this.getObjectValueByPath(schema, schemaPath);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (schemaData.minItems) {
                        keyword = 'minItems';
                        schemaPath = `${schemaPath}/minItems`;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        params = {
                            limit: schemaData.minItems
                        };
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
                        message = `must NOT have fewer than ${schemaData.minItems} items`;
                    }
                } else if ((error === null || error === void 0 ? void 0 : error.message) === 'has more items than allowed') {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const schemaData = this.getObjectValueByPath(schema, schemaPath);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (schemaData.maxItems) {
                        keyword = 'maxItems';
                        schemaPath = `${schemaPath}/maxItems`;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        params = {
                            limit: schemaData.maxItems
                        };
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
                        message = `must NOT have more than ${schemaData.maxItems} items`;
                    }
                } else if ((error === null || error === void 0 ? void 0 : error.message.startsWith('must be')) &&
                    (error === null || error === void 0 ? void 0 : error.message.endsWith('format'))) {
                    const formatName = error === null || error === void 0 ? void 0 : error.message.split(' ')[2];
                    if (formatName) {
                        message = `must pass "${formatName}" validation`;
                    }
                }
                // eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
                const dataValue = this.getObjectValueByPath(data, instancePath);
                return {
                    keyword: keyword !== null && keyword !== void 0 ? keyword : error.field,
                    instancePath,
                    schemaPath: `#${schemaPath}`,
                    // eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
                    params: params !== null && params !== void 0 ? params : {
                        value: dataValue
                    },
                    message: message !== null && message !== void 0 ? message : error.message,
                };
            });
        }
        return undefined;
    }
    getOrCreateValidator(schema) {
        const key = Validator.getKey(schema);
        let _validator = this.getSchema(key);
        if (!_validator) {
            this.addSchema(key, schema);
            _validator = this.getSchema(key);
        }
        return _validator;
    }
    static getKey(schema) {
        return (0, utils_js_1.toHex)((0, blake2b_js_1.blake2b)((0, utils_js_1.utf8ToBytes)(JSON.stringify(schema))));
    }
    getObjectValueByPath(obj, pointer, objpath) {
        try {
            if (typeof obj !== 'object')
                throw new Error('Invalid input object');
            if (typeof pointer !== 'string')
                throw new Error('Invalid JSON pointer');
            const parts = pointer.split('/');
            if (!['', '#'].includes(parts.shift())) {
                throw new Error('Invalid JSON pointer');
            }
            if (parts.length === 0)
                return obj;
            let curr = obj;
            for (const part of parts) {
                if (typeof part !== 'string')
                    throw new Error('Invalid JSON pointer');
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
                if (objpath)
                    objpath.push(curr); // does not include target itself, but includes head
                const prop = this.untilde(part);
                if (typeof curr !== 'object')
                    return undefined;
                if (!Object.prototype.hasOwnProperty.call(curr, prop))
                    return undefined;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                curr = curr[prop];
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return curr;
        } catch (e) {
            return '';
        }
    }
    // eslint-disable-next-line class-methods-use-this
    untilde(string) {
        if (!string.includes('~'))
            return string;
        return string.replace(/~[01]/g, match => {
            switch (match) {
                case '~1':
                    return '/';
                case '~0':
                    return '~';
                default:
                    throw new Error('Unreachable');
            }
        });
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map