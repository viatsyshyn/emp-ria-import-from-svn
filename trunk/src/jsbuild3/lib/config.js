"use strict";

var PATH = require('path');

function merge(obj, ext) {
    for (var i in ext) if (ext.hasOwnProperty(i)) {
        obj[i] = ext[i];
    }
    return obj;
}

/**
 * @class PluginConfiguration
 * @constructor
 * @param {String} path
 * @param {Object} config
 */
function PluginConfiguration(path, config) {
    this.path = PATH.resolve(path);
    this.config = merge({}, config);
}

/**
 * @class ModuleConfiguration
 * @constructor
 * @param {Object} params
 * @param {Configuration} config
 */
function ModuleConfiguration(params, config) {
    this.prepend = [].slice.call(params.prepend || []);
    this.exclude = [].slice.call(params.exclude || []);
    this.options = merge({}, params.options || {});
    this.name = params.name;
    this.inFile = params['in'];
    this.outFile = params['out'];
    this.appDir = params.appDir ? PATH.resolve(config.getBasePath() + (params.appDir || 'app')) + '/' : null;
    this.assetDir = params.assetDir ? PATH.resolve(config.getBasePath() + (params.assetDir || 'assets')) + '/' : null;
}

ModuleConfiguration.prototype = {
    /** @returns {String[]} */
    getPrepend: function () { return this.prepend; },
    /** @returns {String[]} */
    getExclude: function () { return this.exclude; },
    /** @returns Object */
    getOptions: function () { return this.options; },
    /** @returns String */
    getName: function () { return this.name; },
    /** @returns String */
    getInFile: function () { return this.inFile; },
    /** @returns String */
    getOutFile: function () { return this.outFile; },
    /** @returns String */
    getAppDir: function () { return this.appDir; },
    /** @returns String */
    getAssetDir: function () { return this.assetDir; }
};

/**
 * @class Configuration
 * @constructor
 * @param {String} config
 * @param {String} path
 */
function Configuration(config, path) {
    this.basePath = PATH.dirname(path) + '/';

    this.appDir = PATH.resolve(this.basePath + (config.appDir || 'app')) + '/';
    this.assetDir = PATH.resolve(this.basePath + (config.assetDir || 'assets')) + '/';

    this.options = merge({}, config.options || {});
    this.moduleConfig = null;

    var that = this;
    this.plugins = (config.plugins || []).map(function (plugin) { return new PluginConfiguration(that.basePath + plugin, that); });
    this.modules = (config.modules || []).map(function (module) { return new ModuleConfiguration(module, that); });
}

Configuration.prototype = {
    /** @returns String */
    getBasePath: function () { return this.basePath; },
    /** @returns String */
    getAppDir: function () { return this.moduleConfig.getAppDir() || this.appDir; },
    /** @returns String */
    getAssetDir: function () { return this.moduleConfig.getAssetDir() || this.assetDir; },
    /** @returns ModuleConfiguration[] */
    getModules: function () { return [].slice.call(this.modules); },
    /** @returns PluginConfiguration[] */
    getPlugins: function () { return [].slice.call(this.plugins); },
    /** @returns String */
    resolveFilePath: function (name) { return PATH.resolve(this.getAppDir() + name); },
    /** @returns String */
    resolveAssetPath: function (name) { return PATH.resolve(this.getAssetDir() + name); },
    /**
     * @param {String} name
     * @returns Object
     */
    getPluginConfiguration: function (name) {
        var cfg = merge(merge({}, this.options), this.moduleConfig.getOptions() || {});
        return cfg.hasOwnProperty(name) ? cfg[name] : {};
    },
    /** @param {ModuleConfiguration} config */
    setModuleConfig: function (config) { this.moduleConfig = config; }
};

exports.Configuration = Configuration;