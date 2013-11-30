/*!
 * ChatWork - JavaScript SDK for ChatWork API v1 Preview
 *
 * Copyright 2013, Tetsuwo OISHI.
 * Dual license under the MIT license.
 * http://tetsuwo.tumblr.com
 *
 * Version: 0.0.1
 * Date: 2013-11-29
 */

function ChatWork(param) {
    this.initialize.apply(this, arguments);
}

ChatWork.prototype.initialize = function(param) {
    this.apiBaseUrl = 'https://api.chatwork.com/v1';
    this.name       = '_chatwork';
    this.times      = 0;
    this.requests   = [];
    this.data       = [];
    this.debug      = false;
    this.win        = document.defaultView || document.parentWindow;

    this.config = {
        apiToken: null
    };

    if (param) {
        if (param.debug) {
            this.debug = param.debug;
        }
        if (param.apiKey) {
            this.config.apiToken = param.apiToken;
        }
    }

    this.output(param);
};

ChatWork.prototype.setApiToken = function(val) {
    this.config.apiToken = val;
    return this;
};

ChatWork.prototype.output = function(val) {
    if (this.debug) {
        console.log(val);
    }
};

ChatWork.prototype.serialize = function(param, prefix) {
    var query = [];

    for(var p in param) {
        var k = prefix ? prefix + '[' + p + ']' : p, v = param[p];
        query.push(
            typeof v == 'object' ?
                this.serialize(v, k) :
                encodeURIComponent(k) + '=' + encodeURIComponent(v)
        );
    }

    return query.join('&');
};

ChatWork.prototype.api = function(method, param, callback) {
    var callbackName = this.name + '_cb_' + this.times;
    this.win[callbackName] = callback;

    param = param || {};
    param.api_key = this.config.apiKey;
    param.jsonp   = callbackName;

    this.requests[this.times] = {
        method: method,
        param: param,
        callback: callback,
        callbackName: callbackName
    };

    if (param.limit === 'all') {
        param.limit = null;
    }

    this.times++;

    (function(that, d, t) {
        var e = d.createElement(t);
        e.type = 'text/javascript';
        e.async = true;
        e.src = that.apiUrl;
        e.src += method;
        e.src += '?' + that.serialize(param);
        that.output(e.src);
        var s = d.getElementsByTagName(t)[0];
        s.parentNode.insertBefore(e, s);
    })(this, document, 'script');

    return this;
};

