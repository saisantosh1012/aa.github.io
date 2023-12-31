"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Web3EthPluginBase = exports.Web3PluginBase = exports.Web3Context = void 0;
const web3_utils_1 = require("web3-utils");
const web3_errors_1 = require("web3-errors");
const utils_js_1 = require("./utils.js");
// eslint-disable-next-line import/no-cycle
const web3_config_js_1 = require("./web3_config.js");
const web3_request_manager_js_1 = require("./web3_request_manager.js");
const web3_subscription_manager_js_1 = require("./web3_subscription_manager.js");
const web3_batch_request_js_1 = require("./web3_batch_request.js");
class Web3Context extends web3_config_js_1.Web3Config {
    constructor(providerOrContext) {
        var _a;
        super();
        this.providers = web3_request_manager_js_1.Web3RequestManager.providers;
        // If "providerOrContext" is provided as "string" or an objects matching "SupportedProviders" interface
        if ((0, web3_utils_1.isNullish)(providerOrContext) ||
            (typeof providerOrContext === 'string' && providerOrContext.trim() !== '') ||
            (0, utils_js_1.isSupportedProvider)(providerOrContext)) {
            this._requestManager = new web3_request_manager_js_1.Web3RequestManager(providerOrContext);
            this._subscriptionManager = new web3_subscription_manager_js_1.Web3SubscriptionManager(this._requestManager, {});
            return;
        }
        const {
            config,
            provider,
            requestManager,
            subscriptionManager,
            registeredSubscriptions,
            accountProvider,
            wallet,
        } = providerOrContext;
        this.setConfig(config !== null && config !== void 0 ? config : {});
        this._requestManager =
            requestManager !== null && requestManager !== void 0 ? requestManager : new web3_request_manager_js_1.Web3RequestManager(provider, (_a = config === null || config === void 0 ? void 0 : config.enableExperimentalFeatures) === null || _a === void 0 ? void 0 : _a.useSubscriptionWhenCheckingBlockTimeout);
        if (subscriptionManager) {
            this._subscriptionManager = subscriptionManager;
        } else {
            this._subscriptionManager = new web3_subscription_manager_js_1.Web3SubscriptionManager(this.requestManager, registeredSubscriptions !== null && registeredSubscriptions !== void 0 ? registeredSubscriptions : {});
        }
        if (accountProvider) {
            this._accountProvider = accountProvider;
        }
        if (wallet) {
            this._wallet = wallet;
        }
    }
    get requestManager() {
        return this._requestManager;
    }
    /**
     * Will return the current subscriptionManager ({@link Web3SubscriptionManager})
     */
    get subscriptionManager() {
        return this._subscriptionManager;
    }
    get wallet() {
        return this._wallet;
    }
    get accountProvider() {
        return this._accountProvider;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromContextObject(...args) {
        return new this(...args.reverse());
    }
    getContextObject() {
        var _a;
        return {
            config: this.config,
            provider: this.provider,
            requestManager: this.requestManager,
            subscriptionManager: this.subscriptionManager,
            registeredSubscriptions: (_a = this.subscriptionManager) === null || _a === void 0 ? void 0 : _a.registeredSubscriptions,
            providers: this.providers,
            wallet: this.wallet,
            accountProvider: this.accountProvider,
        };
    }
    /**
     * Use to create new object of any type extended by `Web3Context`
     * and link it to current context. This can be used to initiate a global context object
     * and then use it to create new objects of any type extended by `Web3Context`.
     */
    use(ContextRef, ...args) {
        const newContextChild = new ContextRef(...[...args, this.getContextObject()]);
        this.on(web3_config_js_1.Web3ConfigEvent.CONFIG_CHANGE, event => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            newContextChild.setConfig({
                [event.name]: event.newValue
            });
        });
        return newContextChild;
    }
    /**
     * Link current context to another context.
     */
    link(parentContext) {
        this.setConfig(parentContext.config);
        this._requestManager = parentContext.requestManager;
        this.provider = parentContext.provider;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this._subscriptionManager = parentContext.subscriptionManager;
        this._wallet = parentContext.wallet;
        this._accountProvider = parentContext._accountProvider;
        parentContext.on(web3_config_js_1.Web3ConfigEvent.CONFIG_CHANGE, event => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this.setConfig({
                [event.name]: event.newValue
            });
        });
    }
    // eslint-disable-next-line no-use-before-define
    registerPlugin(plugin) {
        // @ts-expect-error No index signature with a parameter of type 'string' was found on type 'Web3Context<API, RegisteredSubs>'
        if (this[plugin.pluginNamespace] !== undefined)
            throw new web3_errors_1.ExistingPluginNamespaceError(plugin.pluginNamespace);
        const _pluginObject = {
            [plugin.pluginNamespace]: plugin,
        };
        _pluginObject[plugin.pluginNamespace].link(this);
        Object.assign(this, _pluginObject);
    }
    /**
     * Will return the current provider.
     *
     * @returns Returns the current provider
     * @example
     * ```ts
     * const web3 = new Web3Context("http://localhost:8545");
     * console.log(web3.provider);
     * > HttpProvider {
     * 	clientUrl: 'http://localhost:8545',
     * 	httpProviderOptions: undefined
     *  }
     * ```
     */
    get provider() {
        return this.currentProvider;
    }
    /**
     * Will set the current provider.
     *
     * @param provider - The provider to set
     *
     * Accepted providers are of type {@link SupportedProviders}
     * @example
     * ```ts
     *  const web3Context = new web3ContextContext("http://localhost:8545");
     * web3Context.provider = "ws://localhost:8545";
     * console.log(web3Context.provider);
     * > WebSocketProvider {
     * _eventEmitter: EventEmitter {
     * _events: [Object: null prototype] {},
     * _eventsCount: 0,
     * ...
     * }
     * ```
     */
    set provider(provider) {
        this.requestManager.setProvider(provider);
    }
    /**
     * Will return the current provider. (The same as `provider`)
     *
     * @returns Returns the current provider
     * @example
     * ```ts
     * const web3Context = new Web3Context("http://localhost:8545");
     * console.log(web3Context.provider);
     * > HttpProvider {
     * 	clientUrl: 'http://localhost:8545',
     * 	httpProviderOptions: undefined
     *  }
     * ```
     */
    get currentProvider() {
        return this.requestManager.provider;
    }
    /**
     * Will set the current provider. (The same as `provider`)
     *
     * @param provider - {@link SupportedProviders} The provider to set
     *
     * @example
     * ```ts
     *  const web3Context = new Web3Context("http://localhost:8545");
     * web3Context.currentProvider = "ws://localhost:8545";
     * console.log(web3Context.provider);
     * > WebSocketProvider {
     * _eventEmitter: EventEmitter {
     * _events: [Object: null prototype] {},
     * _eventsCount: 0,
     * ...
     * }
     * ```
     */
    set currentProvider(provider) {
        this.requestManager.setProvider(provider);
    }
    /**
     * Will return the givenProvider if available.
     *
     * When using web3.js in an Ethereum compatible browser, it will set with the current native provider by that browser. Will return the given provider by the (browser) environment, otherwise `undefined`.
     */
    // eslint-disable-next-line class-methods-use-this
    get givenProvider() {
        return Web3Context.givenProvider;
    }
    /**
     * Will set the provider.
     *
     * @param provider - {@link SupportedProviders} The provider to set
     * @returns Returns true if the provider was set
     */
    setProvider(provider) {
        this.provider = provider;
        return true;
    }
    /**
     * Will return the {@link Web3BatchRequest} constructor.
     */
    get BatchRequest() {
        return web3_batch_request_js_1.Web3BatchRequest.bind(undefined, this._requestManager);
    }
}
exports.Web3Context = Web3Context;
Web3Context.providers = web3_request_manager_js_1.Web3RequestManager.providers;
/**
 * Extend this class when creating a plugin that either doesn't require {@link EthExecutionAPI},
 * or interacts with a RPC node that doesn't fully implement {@link EthExecutionAPI}.
 *
 * To add type support for RPC methods to the {@link Web3RequestManager},
 * define a {@link Web3APISpec} and pass it as a generic to Web3PluginBase like so:
 *
 * @example
 * ```ts
 * type CustomRpcApi = {
 *	custom_rpc_method: () => string;
 *	custom_rpc_method_with_parameters: (parameter1: string, parameter2: number) => string;
 * };
 *
 * class CustomPlugin extends Web3PluginBase<CustomRpcApi> {...}
 * ```
 */
class Web3PluginBase extends Web3Context {}
exports.Web3PluginBase = Web3PluginBase;
/**
 * Extend this class when creating a plugin that makes use of {@link EthExecutionAPI},
 * or depends on other Web3 packages (such as `web3-eth-contract`) that depend on {@link EthExecutionAPI}.
 *
 * To add type support for RPC methods to the {@link Web3RequestManager} (in addition to {@link EthExecutionAPI}),
 * define a {@link Web3APISpec} and pass it as a generic to Web3PluginBase like so:
 *
 * @example
 * ```ts
 * type CustomRpcApi = {
 *	custom_rpc_method: () => string;
 *	custom_rpc_method_with_parameters: (parameter1: string, parameter2: number) => string;
 * };
 *
 * class CustomPlugin extends Web3PluginBase<CustomRpcApi> {...}
 * ```
 */
class Web3EthPluginBase extends Web3PluginBase {}
exports.Web3EthPluginBase = Web3EthPluginBase;
//# sourceMappingURL=web3_context.js.map