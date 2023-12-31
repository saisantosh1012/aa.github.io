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
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Contract = void 0;
const web3_core_1 = require("web3-core");
const web3_errors_1 = require("web3-errors");
const web3_eth_1 = require("web3-eth");
const web3_eth_abi_1 = require("web3-eth-abi");
const web3_types_1 = require("web3-types");
const web3_utils_1 = require("web3-utils");
const web3_validator_1 = require("web3-validator");
const constants_js_1 = require("./constants.js");
const encoding_js_1 = require("./encoding.js");
const log_subscription_js_1 = require("./log_subscription.js");
const utils_js_1 = require("./utils.js");
const contractSubscriptions = {
    logs: log_subscription_js_1.LogsSubscription,
    newHeads: web3_eth_1.NewHeadsSubscription,
    newBlockHeaders: web3_eth_1.NewHeadsSubscription,
};
/**
 * The class designed to interact with smart contracts on the Ethereum blockchain.
 */
class Contract extends web3_core_1.Web3Context {
    constructor(jsonInterface, addressOrOptionsOrContext, optionsOrContextOrReturnFormat, contextOrReturnFormat, returnFormat) {
        var _a, _b, _c;
        // eslint-disable-next-line no-nested-ternary
        const options = (0, utils_js_1.isContractInitOptions)(addressOrOptionsOrContext) ?
            addressOrOptionsOrContext :
            (0, utils_js_1.isContractInitOptions)(optionsOrContextOrReturnFormat) ?
            optionsOrContextOrReturnFormat :
            undefined;
        if (!(0, web3_validator_1.isNullish)(options) && !(0, web3_validator_1.isNullish)(options.data) && !(0, web3_validator_1.isNullish)(options.input))
            throw new web3_errors_1.ContractTransactionDataAndInputError({
                data: options.data,
                input: options.input,
            });
        let contractContext;
        if ((0, utils_js_1.isWeb3ContractContext)(addressOrOptionsOrContext)) {
            contractContext = addressOrOptionsOrContext;
        } else if ((0, utils_js_1.isWeb3ContractContext)(optionsOrContextOrReturnFormat)) {
            contractContext = optionsOrContextOrReturnFormat;
        } else {
            contractContext = contextOrReturnFormat;
        }
        let provider;
        if (typeof addressOrOptionsOrContext === 'object' &&
            'provider' in addressOrOptionsOrContext) {
            provider = addressOrOptionsOrContext.provider;
        } else if (typeof optionsOrContextOrReturnFormat === 'object' &&
            'provider' in optionsOrContextOrReturnFormat) {
            provider = optionsOrContextOrReturnFormat.provider;
        } else if (typeof contextOrReturnFormat === 'object' &&
            'provider' in contextOrReturnFormat) {
            provider = contextOrReturnFormat.provider;
        } else {
            provider = Contract.givenProvider;
        }
        super(Object.assign(Object.assign({}, contractContext), {
            provider,
            registeredSubscriptions: contractSubscriptions
        }));
        /**
         * Set to true if you want contracts' defaults to sync with global defaults.
         */
        this.syncWithContext = false;
        this._functions = {};
        this._overloadedMethodAbis = new Map();
        // eslint-disable-next-line no-nested-ternary
        const returnDataFormat = (0, web3_utils_1.isDataFormat)(contextOrReturnFormat) ?
            contextOrReturnFormat :
            (0, web3_utils_1.isDataFormat)(optionsOrContextOrReturnFormat) ?
            optionsOrContextOrReturnFormat :
            returnFormat !== null && returnFormat !== void 0 ? returnFormat : web3_types_1.DEFAULT_RETURN_FORMAT;
        const address = typeof addressOrOptionsOrContext === 'string' ? addressOrOptionsOrContext : undefined;
        this._parseAndSetJsonInterface(jsonInterface, returnDataFormat);
        if (!(0, web3_validator_1.isNullish)(address)) {
            this._parseAndSetAddress(address, returnDataFormat);
        }
        this.options = {
            address,
            jsonInterface: this._jsonInterface,
            gas: (_a = options === null || options === void 0 ? void 0 : options.gas) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.gasLimit,
            gasPrice: options === null || options === void 0 ? void 0 : options.gasPrice,
            from: options === null || options === void 0 ? void 0 : options.from,
            input: (_b = options === null || options === void 0 ? void 0 : options.input) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.data,
        };
        this.syncWithContext = (_c = options === null || options === void 0 ? void 0 : options.syncWithContext) !== null && _c !== void 0 ? _c : false;
        if (contractContext instanceof web3_core_1.Web3Context) {
            this.subscribeToContextEvents(contractContext);
        }
        Object.defineProperty(this.options, 'address', {
            set: (value) => this._parseAndSetAddress(value, returnDataFormat),
            get: () => this._address,
        });
        Object.defineProperty(this.options, 'jsonInterface', {
            set: (value) => this._parseAndSetJsonInterface(value, returnDataFormat),
            get: () => this._jsonInterface,
        });
    }
    /**
     * Subscribe to an event.
     *
     * ```ts
     * await myContract.events.MyEvent([options])
     * ```
     *
     * There is a special event `allEvents` that can be used to subscribe all events.
     *
     * ```ts
     * await myContract.events.allEvents([options])
     * ```
     *
     * @returns - When individual event is accessed will returns {@link ContractBoundEvent} object
     */
    get events() {
        return this._events;
    }
    /**
     * Creates a transaction object for that method, which then can be `called`, `send`, `estimated`, `createAccessList` , or `ABI encoded`.
     *
     * The methods of this smart contract are available through:
     *
     * The name: `myContract.methods.myMethod(123)`
     * The name with parameters: `myContract.methods['myMethod(uint256)'](123)`
     * The signature `myContract.methods['0x58cf5f10'](123)`
     *
     * This allows calling functions with same name but different parameters from the JavaScript contract object.
     *
     * \> The method signature does not provide a type safe interface, so we recommend to use method `name` instead.
     *
     * ```ts
     * // calling a method
     * const result = await myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});
     *
     * // or sending and using a promise
     * const receipt = await myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});
     *
     * // or sending and using the events
     * const sendObject = myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});
     * sendObject.on('transactionHash', function(hash){
     *   ...
     * });
     * sendObject.on('receipt', function(receipt){
     *   ...
     * });
     * sendObject.on('confirmation', function(confirmationNumber, receipt){
     *   ...
     * });
     * sendObject.on('error', function(error, receipt) {
     *   ...
     * });
     * ```
     *
     * @returns - Either returns {@link PayableMethodObject} or {@link NonPayableMethodObject} based on the definitions of the {@doclink glossary/json_interface | json interface} of that contract.
     */
    get methods() {
        return this._methods;
    }
    /**
     * Clones the current contract instance. This doesn't deploy contract on blockchain and only creates a local clone.
     *
     * @returns - The new contract instance.
     *
     * ```ts
     * const contract1 = new eth.Contract(abi, address, {gasPrice: '12345678', from: fromAddress});
     *
     * const contract2 = contract1.clone();
     * contract2.options.address = address2;
     *
     * (contract1.options.address !== contract2.options.address);
     * > true
     * ```
     */
    clone() {
        let newContract;
        if (this.options.address) {
            newContract = new Contract([...this._jsonInterface, ...this._errorsInterface], this.options.address, {
                gas: this.options.gas,
                gasPrice: this.options.gasPrice,
                from: this.options.from,
                input: this.options.input,
                provider: this.currentProvider,
                syncWithContext: this.syncWithContext,
            }, this.getContextObject());
        } else {
            newContract = new Contract([...this._jsonInterface, ...this._errorsInterface], {
                gas: this.options.gas,
                gasPrice: this.options.gasPrice,
                from: this.options.from,
                input: this.options.input,
                provider: this.currentProvider,
                syncWithContext: this.syncWithContext,
            }, this.getContextObject());
        }
        if (this.context)
            newContract.subscribeToContextEvents(this.context);
        return newContract;
    }
    /**
     * Call this function to deploy the contract to the blockchain. After successful deployment the promise will resolve with a new contract instance.
     *
     * ```ts
     * myContract.deploy({
     *   input: '0x12345...', // data keyword can be used, too. If input is used, data will be ignored.
     *   arguments: [123, 'My String']
     * })
     * .send({
     *   from: '0x1234567890123456789012345678901234567891',
     *   gas: 1500000,
     *   gasPrice: '30000000000000'
     * }, function(error, transactionHash){ ... })
     * .on('error', function(error){ ... })
     * .on('transactionHash', function(transactionHash){ ... })
     * .on('receipt', function(receipt){
     *  console.log(receipt.contractAddress) // contains the new contract address
     * })
     * .on('confirmation', function(confirmationNumber, receipt){ ... })
     * .then(function(newContractInstance){
     *   console.log(newContractInstance.options.address) // instance with the new contract address
     * });
     *
     *
     * // When the data is already set as an option to the contract itself
     * myContract.options.data = '0x12345...';
     *
     * myContract.deploy({
     *   arguments: [123, 'My String']
     * })
     * .send({
     *   from: '0x1234567890123456789012345678901234567891',
     *   gas: 1500000,
     *   gasPrice: '30000000000000'
     * })
     * .then(function(newContractInstance){
     *   console.log(newContractInstance.options.address) // instance with the new contract address
     * });
     *
     *
     * // Simply encoding
     * myContract.deploy({
     *   input: '0x12345...',
     *   arguments: [123, 'My String']
     * })
     * .encodeABI();
     * > '0x12345...0000012345678765432'
     *
     *
     * // Gas estimation
     * myContract.deploy({
     *   input: '0x12345...',
     *   arguments: [123, 'My String']
     * })
     * .estimateGas(function(err, gas){
     *   console.log(gas);
     * });
     * ```
     *
     * @returns - The transaction object
     */
    deploy(deployOptions) {
        var _a, _b, _c;
        let abi = this._jsonInterface.find(j => j.type === 'constructor');
        if (!abi) {
            abi = {
                type: 'constructor',
                inputs: [],
                stateMutability: '',
            };
        }
        const _input = (0, web3_utils_1.format)({
            format: 'bytes'
        }, (_b = (_a = deployOptions === null || deployOptions === void 0 ? void 0 : deployOptions.input) !== null && _a !== void 0 ? _a : deployOptions === null || deployOptions === void 0 ? void 0 : deployOptions.data) !== null && _b !== void 0 ? _b : this.options.input, web3_types_1.DEFAULT_RETURN_FORMAT);
        if (!_input || _input.trim() === '0x') {
            throw new web3_errors_1.Web3ContractError('contract creation without any data provided.');
        }
        const args = (_c = deployOptions === null || deployOptions === void 0 ? void 0 : deployOptions.arguments) !== null && _c !== void 0 ? _c : [];
        const contractOptions = Object.assign(Object.assign({}, this.options), {
            input: _input
        });
        return {
            arguments: args,
            send: (options) => {
                const modifiedOptions = Object.assign({}, options);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return this._contractMethodDeploySend(abi, args, modifiedOptions, contractOptions);
            },
            estimateGas: (options, returnFormat = web3_types_1.DEFAULT_RETURN_FORMAT) => __awaiter(this, void 0, void 0, function*() {
                const modifiedOptions = Object.assign({}, options);
                return this._contractMethodEstimateGas({
                    abi: abi,
                    params: args,
                    returnFormat,
                    options: modifiedOptions,
                    contractOptions,
                });
            }),
            encodeABI: () => (0, encoding_js_1.encodeMethodABI)(abi, args, (0, web3_utils_1.format)({
                format: 'bytes'
            }, _input, web3_types_1.DEFAULT_RETURN_FORMAT)),
        };
    }
    getPastEvents(param1, param2, param3) {
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            const eventName = typeof param1 === 'string' ? param1 : 'allEvents';
            const options =
                // eslint-disable-next-line no-nested-ternary
                typeof param1 !== 'string' && !(0, web3_utils_1.isDataFormat)(param1) ?
                param1 :
                !(0, web3_utils_1.isDataFormat)(param2) ?
                param2 :
                {};
            // eslint-disable-next-line no-nested-ternary
            const returnFormat = (0, web3_utils_1.isDataFormat)(param1) ?
                param1 :
                (0, web3_utils_1.isDataFormat)(param2) ?
                param2 :
                param3 !== null && param3 !== void 0 ? param3 : web3_types_1.DEFAULT_RETURN_FORMAT;
            const abi = eventName === 'allEvents' ?
                constants_js_1.ALL_EVENTS_ABI :
                this._jsonInterface.find(j => 'name' in j && j.name === eventName);
            if (!abi) {
                throw new web3_errors_1.Web3ContractError(`Event ${eventName} not found.`);
            }
            const {
                fromBlock,
                toBlock,
                topics,
                address
            } = (0, encoding_js_1.encodeEventABI)(this.options, abi, options !== null && options !== void 0 ? options : {});
            const logs = yield(0, web3_eth_1.getLogs)(this, {
                fromBlock,
                toBlock,
                topics,
                address
            }, returnFormat);
            const decodedLogs = logs.map(log => typeof log === 'string' ?
                log :
                (0, encoding_js_1.decodeEventABI)(abi, log, this._jsonInterface, returnFormat));
            const filter = (_a = options === null || options === void 0 ? void 0 : options.filter) !== null && _a !== void 0 ? _a : {};
            const filterKeys = Object.keys(filter);
            if (filterKeys.length > 0) {
                return decodedLogs.filter(log => {
                    if (typeof log === 'string')
                        return true;
                    return filterKeys.every((key) => {
                        var _a;
                        if (Array.isArray(filter[key])) {
                            return filter[key].some((v) => String(log.returnValues[key]).toUpperCase() ===
                                String(v).toUpperCase());
                        }
                        const inputAbi = (_a = abi.inputs) === null || _a === void 0 ? void 0 : _a.filter(input => input.name === key)[0];
                        if ((inputAbi === null || inputAbi === void 0 ? void 0 : inputAbi.indexed) && inputAbi.type === 'string') {
                            const hashedIndexedString = (0, web3_utils_1.keccak256)(filter[key]);
                            if (hashedIndexedString === String(log.returnValues[key]))
                                return true;
                        }
                        return (String(log.returnValues[key]).toUpperCase() ===
                            String(filter[key]).toUpperCase());
                    });
                });
            }
            return decodedLogs;
        });
    }
    _parseAndSetAddress(value, returnFormat = web3_types_1.DEFAULT_RETURN_FORMAT) {
        this._address = value ?
            (0, web3_utils_1.toChecksumAddress)((0, web3_utils_1.format)({
                format: 'address'
            }, value, returnFormat)) :
            value;
    }
    _parseAndSetJsonInterface(abis, returnFormat = web3_types_1.DEFAULT_RETURN_FORMAT) {
        var _a, _b, _c, _d, _e;
        this._functions = {};
        this._methods = {};
        this._events = {};
        let result = [];
        const functionsAbi = abis.filter(abi => abi.type !== 'error');
        const errorsAbi = abis.filter(abi => (0, web3_eth_abi_1.isAbiErrorFragment)(abi));
        for (const a of functionsAbi) {
            const abi = Object.assign(Object.assign({}, a), {
                signature: ''
            });
            if ((0, web3_eth_abi_1.isAbiFunctionFragment)(abi)) {
                const methodName = (0, web3_eth_abi_1.jsonInterfaceMethodToString)(abi);
                const methodSignature = (0, web3_eth_abi_1.encodeFunctionSignature)(methodName);
                abi.signature = methodSignature;
                // make constant and payable backwards compatible
                abi.constant =
                    (_b = (_a = abi.stateMutability === 'view') !== null && _a !== void 0 ? _a : abi.stateMutability === 'pure') !== null && _b !== void 0 ? _b : abi.constant;
                abi.payable = (_c = abi.stateMutability === 'payable') !== null && _c !== void 0 ? _c : abi.payable;
                this._overloadedMethodAbis.set(abi.name, [
                    ...((_d = this._overloadedMethodAbis.get(abi.name)) !== null && _d !== void 0 ? _d : []),
                    abi,
                ]);
                const abiFragment = (_e = this._overloadedMethodAbis.get(abi.name)) !== null && _e !== void 0 ? _e : [];
                const contractMethod = this._createContractMethod(abiFragment, errorsAbi);
                this._functions[methodName] = {
                    signature: methodSignature,
                    method: contractMethod,
                };
                // We don't know a particular type of the Abi method so can't type check
                this._methods[abi.name] = this._functions[methodName].method;
                // We don't know a particular type of the Abi method so can't type check
                this._methods[methodName] = this._functions[methodName].method;
                // We don't know a particular type of the Abi method so can't type check
                this._methods[methodSignature] = this
                    ._functions[methodName].method;
            } else if ((0, web3_eth_abi_1.isAbiEventFragment)(abi)) {
                const eventName = (0, web3_eth_abi_1.jsonInterfaceMethodToString)(abi);
                const eventSignature = (0, web3_eth_abi_1.encodeEventSignature)(eventName);
                const event = this._createContractEvent(abi, returnFormat);
                abi.signature = eventSignature;
                if (!(eventName in this._events) || abi.name === 'bound') {
                    // It's a private type and we don't want to expose it and no need to check
                    this._events[eventName] = event;
                }
                // It's a private type and we don't want to expose it and no need to check
                this._events[abi.name] = event;
                // It's a private type and we don't want to expose it and no need to check
                this._events[eventSignature] = event;
            }
            this._events.allEvents = this._createContractEvent(constants_js_1.ALL_EVENTS_ABI, returnFormat);
            result = [...result, abi];
        }
        this._jsonInterface = [...result];
        this._errorsInterface = errorsAbi;
    }
    // eslint-disable-next-line class-methods-use-this
    _getAbiParams(abi, params) {
        var _a;
        try {
            return web3_validator_1.utils.transformJsonDataToAbiFormat((_a = abi.inputs) !== null && _a !== void 0 ? _a : [], params);
        } catch (error) {
            throw new web3_errors_1.Web3ContractError(`Invalid parameters for method ${abi.name}: ${error.message}`);
        }
    }
    _createContractMethod(abiArr, errorsAbis) {
        const abi = abiArr[abiArr.length - 1];
        return (...params) => {
            var _a, _b;
            let abiParams;
            const abis = (_a = this._overloadedMethodAbis.get(abi.name)) !== null && _a !== void 0 ? _a : [];
            let methodAbi = abis[0];
            const internalErrorsAbis = errorsAbis;
            const arrayOfAbis = abis.filter(_abi => {
                var _a;
                return ((_a = _abi.inputs) !== null && _a !== void 0 ? _a : []).length === params.length;
            });
            if (abis.length === 1 || arrayOfAbis.length === 0) {
                abiParams = this._getAbiParams(methodAbi, params);
                web3_validator_1.validator.validate((_b = abi.inputs) !== null && _b !== void 0 ? _b : [], abiParams);
            } else {
                const errors = [];
                for (const _abi of arrayOfAbis) {
                    try {
                        abiParams = this._getAbiParams(_abi, params);
                        web3_validator_1.validator.validate(_abi.inputs, abiParams);
                        methodAbi = _abi;
                        break;
                    } catch (e) {
                        errors.push(e);
                    }
                }
                if (errors.length === arrayOfAbis.length) {
                    throw new web3_validator_1.Web3ValidatorError(errors);
                }
            }
            const methods = {
                arguments: abiParams,
                call: (options, block) => __awaiter(this, void 0, void 0, function*() {
                    return this._contractMethodCall(methodAbi, abiParams, internalErrorsAbis, options, block);
                }),
                send: (options) => this._contractMethodSend(methodAbi, abiParams, internalErrorsAbis, options),
                estimateGas: (options, returnFormat = web3_types_1.DEFAULT_RETURN_FORMAT) => __awaiter(this, void 0, void 0, function*() {
                    return this._contractMethodEstimateGas({
                        abi: methodAbi,
                        params: abiParams,
                        returnFormat,
                        options,
                    });
                }),
                encodeABI: () => (0, encoding_js_1.encodeMethodABI)(methodAbi, abiParams),
                createAccessList: (options, block) => __awaiter(this, void 0, void 0, function*() {
                    return this._contractMethodCreateAccessList(methodAbi, abiParams, internalErrorsAbis, options, block);
                }),
            };
            if (methodAbi.stateMutability === 'payable') {
                return methods;
            }
            return methods;
        };
    }
    _contractMethodCall(abi, params, errorsAbi, options, block) {
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            const tx = (0, utils_js_1.getEthTxCallParams)({
                abi,
                params,
                options,
                contractOptions: Object.assign(Object.assign({}, this.options), {
                    from: (_a = this.options.from) !== null && _a !== void 0 ? _a : this.config.defaultAccount
                }),
            });
            try {
                const result = yield(0, web3_eth_1.call)(this, tx, block, web3_types_1.DEFAULT_RETURN_FORMAT);
                return (0, encoding_js_1.decodeMethodReturn)(abi, result);
            } catch (error) {
                if (error instanceof web3_errors_1.ContractExecutionError) {
                    // this will parse the error data by trying to decode the ABI error inputs according to EIP-838
                    (0, web3_eth_abi_1.decodeContractErrorData)(errorsAbi, error.innerError);
                }
                throw error;
            }
        });
    }
    _contractMethodCreateAccessList(abi, params, errorsAbi, options, block) {
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            const tx = (0, utils_js_1.getCreateAccessListParams)({
                abi,
                params,
                options,
                contractOptions: Object.assign(Object.assign({}, this.options), {
                    from: (_a = this.options.from) !== null && _a !== void 0 ? _a : this.config.defaultAccount
                }),
            });
            try {
                return (0, web3_eth_1.createAccessList)(this, tx, block, web3_types_1.DEFAULT_RETURN_FORMAT);
            } catch (error) {
                if (error instanceof web3_errors_1.ContractExecutionError) {
                    // this will parse the error data by trying to decode the ABI error inputs according to EIP-838
                    (0, web3_eth_abi_1.decodeContractErrorData)(errorsAbi, error.innerError);
                }
                throw error;
            }
        });
    }
    _contractMethodSend(abi, params, errorsAbi, options, contractOptions) {
        var _a, _b;
        let modifiedContractOptions = contractOptions !== null && contractOptions !== void 0 ? contractOptions : this.options;
        modifiedContractOptions = Object.assign(Object.assign({}, modifiedContractOptions), {
            input: undefined,
            from: (_b = (_a = modifiedContractOptions.from) !== null && _a !== void 0 ? _a : this.defaultAccount) !== null && _b !== void 0 ? _b : undefined
        });
        const tx = (0, utils_js_1.getSendTxParams)({
            abi,
            params,
            options,
            contractOptions: modifiedContractOptions,
        });
        const transactionToSend = (0, web3_eth_1.sendTransaction)(this, tx, web3_types_1.DEFAULT_RETURN_FORMAT, {
            // TODO Should make this configurable by the user
            checkRevertBeforeSending: false,
        });
        // eslint-disable-next-line no-void
        void transactionToSend.on('error', (error) => {
            if (error instanceof web3_errors_1.ContractExecutionError) {
                // this will parse the error data by trying to decode the ABI error inputs according to EIP-838
                (0, web3_eth_abi_1.decodeContractErrorData)(errorsAbi, error.innerError);
            }
        });
        return transactionToSend;
    }
    _contractMethodDeploySend(abi, params, options, contractOptions) {
        var _a, _b;
        let modifiedContractOptions = contractOptions !== null && contractOptions !== void 0 ? contractOptions : this.options;
        modifiedContractOptions = Object.assign(Object.assign({}, modifiedContractOptions), {
            from: (_b = (_a = modifiedContractOptions.from) !== null && _a !== void 0 ? _a : this.defaultAccount) !== null && _b !== void 0 ? _b : undefined
        });
        const tx = (0, utils_js_1.getSendTxParams)({
            abi,
            params,
            options,
            contractOptions: modifiedContractOptions,
        });
        return (0, web3_eth_1.sendTransaction)(this, tx, web3_types_1.DEFAULT_RETURN_FORMAT, {
            transactionResolver: receipt => {
                if (receipt.status === BigInt(0)) {
                    throw new web3_errors_1.Web3ContractError("code couldn't be stored", receipt);
                }
                const newContract = this.clone();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                newContract.options.address = receipt.contractAddress;
                return newContract;
            },
            // TODO Should make this configurable by the user
            checkRevertBeforeSending: false,
        });
    }
    _contractMethodEstimateGas({
        abi,
        params,
        returnFormat,
        options,
        contractOptions,
    }) {
        return __awaiter(this, void 0, void 0, function*() {
            const tx = (0, utils_js_1.getEstimateGasParams)({
                abi,
                params,
                options,
                contractOptions: contractOptions !== null && contractOptions !== void 0 ? contractOptions : this.options,
            });
            return (0, web3_eth_1.estimateGas)(this, tx, web3_types_1.BlockTags.LATEST, returnFormat);
        });
    }
    // eslint-disable-next-line class-methods-use-this
    _createContractEvent(abi, returnFormat = web3_types_1.DEFAULT_RETURN_FORMAT) {
        return (...params) => {
            var _a;
            const {
                topics,
                fromBlock
            } = (0, encoding_js_1.encodeEventABI)(this.options, abi, params[0]);
            const sub = new log_subscription_js_1.LogsSubscription({
                address: this.options.address,
                topics,
                abi,
                jsonInterface: this._jsonInterface,
            }, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                subscriptionManager: this.subscriptionManager,
                returnFormat,
            });
            if (!(0, web3_validator_1.isNullish)(fromBlock)) {
                // emit past events when fromBlock is defined
                this.getPastEvents(abi.name, {
                        fromBlock,
                        topics
                    }, returnFormat)
                    .then(logs => {
                        logs.forEach(log => sub.emit('data', log));
                    })
                    .catch(() => {
                        sub.emit('error', new web3_errors_1.SubscriptionError('Failed to get past events.'));
                    });
            }
            (_a = this.subscriptionManager) === null || _a === void 0 ? void 0 : _a.addSubscription(sub).catch(() => {
                sub.emit('error', new web3_errors_1.SubscriptionError('Failed to subscribe.'));
            });
            return sub;
        };
    }
    subscribeToContextEvents(context) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const contractThis = this;
        this.context = context;
        if (contractThis.syncWithContext) {
            context.on(web3_core_1.Web3ConfigEvent.CONFIG_CHANGE, event => {
                contractThis.setConfig({
                    [event.name]: event.newValue
                });
            });
        }
    }
}
exports.Contract = Contract;
//# sourceMappingURL=contract.js.map