"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
require("rxjs/add/observable/fromPromise");
var ng2_file_upload_1 = require("ng2-file-upload");
var HttpService = (function () {
    function HttpService(http, transferState, BASE_URL, localStorage, isBrowser, handleData, toast) {
        this.http = http;
        this.transferState = transferState;
        this.BASE_URL = BASE_URL;
        this.localStorage = localStorage;
        this.isBrowser = isBrowser;
        this.handleData = handleData;
        this.toast = toast;
        this.headers = http_1.Headers;
        this.URL_IMG = 'file/download?filename=';
        //this.isBrowser = _isBrowser();
    }
    HttpService.prototype.getProjCategory = function () {
        var _this = this;
        var url = 'ref/project-field-of-activity?projectTypeId=1';
        return this.getUnlimCachedData(this.BASE_URL + url, undefined, function (url, options) {
            return _this.http.get(url, options);
        });
    };
    ;
    HttpService.prototype.getUnlimCache = function (url) {
        var _this = this;
        return this.getUnlimCachedData(this.BASE_URL + url, undefined, function (url, options) {
            return _this.http.get(url, options);
        });
    };
    HttpService.prototype.isAuth = function () {
        return !!this.getToken();
    };
    HttpService.prototype.getToken = function () {
        if (this.isBrowser) {
            return this.localStorage.get('hash');
        }
        else {
            return this.localStorage.auth['hash'];
        }
    };
    // с кешем
    HttpService.prototype.get = function (url, refresh) {
        if (refresh === void 0) { refresh = false; }
        var headers = this.doWitAuth();
        return this.__get(this.BASE_URL + url, headers ? { headers: headers } : undefined, refresh);
    };
    // без кеша
    HttpService.prototype.getWithoutCache = function (url, local) {
        var _this = this;
        if (local === void 0) { local = false; }
        var headers = this.doWitAuth();
        return this.http.get((local ? '' : this.BASE_URL + url), headers ? { headers: headers } : undefined)
            .map(function (r) { return r.json(); })["catch"](function (e) { return _this.handleError(e, '_getWithoutCache'); });
    };
    // обрабатываю ошибки тостами для браузера и консолью для ноды
    HttpService.prototype.handleError = function (e, str) {
        var _this = this;
        if (!this.isBrowser) {
            this.setCache('node-errors', e._body);
            console.log((new Date() + '').slice(4, 25) + "__handleError in httpService by " + str, e.url, e._body);
        }
        else {
            var err = e.json();
            if (err.errors && typeof err.errors === 'string') {
                this.toast.error(err.errors, 'Ошибка!', {
                    showCloseButton: true,
                    toastLife: 22e3
                });
            }
            else if (err.errors && typeof err.errors === 'object') {
                this.handleErrObject(err.errors).forEach(function (e) {
                    _this.toast.error(e, 'Ошибка!', {
                        showCloseButton: true,
                        toastLife: 22e3
                    });
                });
            }
        }
        return Observable_1.Observable["throw"](e);
    };
    // обрабатываю в удобоваримый вид ошибки с сервера
    HttpService.prototype.handleErrObject = function (obj) {
        var ArrOfErrors = [];
        for (var key in obj) {
            ArrOfErrors.push(obj[key][0]);
        }
        return ArrOfErrors;
    };
    HttpService.prototype.post = function (url, _d, textToast, toastLife) {
        var _this = this;
        if (textToast === void 0) { textToast = ''; }
        if (toastLife === void 0) { toastLife = 7e3; }
        var d = JSON.stringify(_d);
        var headers = this.doWitAuth(d);
        return this.http.post(this.BASE_URL + url, d, { headers: headers })
            .map(function (r) {
            if (textToast !== '') {
                _this.toast.success('', textToast, {
                    showCloseButton: true,
                    toastLife: toastLife
                });
            }
            return r.json();
        })["catch"](function (e) { return _this.handleError(e, '_post'); });
    };
    HttpService.prototype.postWithToast = function (url, _d, text, toastLife) {
        if (text === void 0) { text = 'Успешно сохранено'; }
        return this.post(url, _d, text, toastLife);
    };
    HttpService.prototype._post = function (url, d) {
        var _this = this;
        return this.http.post(this.BASE_URL + url, d)
            .map(function (r) { return r.json(); })["catch"](function (e) { return _this.handleError(e, '_post'); });
    };
    HttpService.prototype._put = function (url, d) {
        return this.http.put(this.BASE_URL + url, d).map(function (r) { return r.json(); });
    };
    HttpService.prototype.doWitAuth = function (str) {
        if (str === void 0) { str = ''; }
        var t = this.getToken();
        var _headers = new this.headers();
        var hash = this.handleData.getHash(str);
        if (t)
            _headers.append('X-AUTH-TOKEN', 'PiU ' + t);
        _headers.append('X-DUDE', 'ANG ' + hash);
        _headers.append('Content-Type', 'application/json');
        return _headers;
    };
    HttpService.prototype.restorePassword = function (password) {
        return this.postWithToast('users/requestPasswordReset', { "email": password }, 'Вы успешно сменили пароль.');
    };
    ;
    HttpService.prototype.preRestorePassword = function (email) {
        return this.postWithToast('users/requestPasswordReset', { "email": email.toLowerCase() }, 'Вам на почту отправлено письмо с инструкцией по смене пароля.', 20e3);
    };
    ;
    ////////////////////////////////////////////////
    HttpService.prototype.request = function (uri, options) {
        var _this = this;
        return this.getData(uri, options, function (url, options) {
            return _this.http.request(url, options);
        });
    };
    /**
     * Performs a request with `get` http method.
     */
    HttpService.prototype.__get = function (url, options, refresh) {
        // возможно удалять через какое то время после загрузки браузера кеш на
        //url = this.BASE_URL + url;
        // выборочные урлы
        var _this = this;
        return this.getData(url, options, function (url, options) {
            return _this.http.get(url, options);
        }, refresh);
    };
    /*post(url:string, body:any, options?:RequestOptionsArgs):Observable<any> {
        return this.getPostData(url, body, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.post(url, body.options);
        });
    }*/
    /**
     * Performs a request with `put` http method.
     */
    HttpService.prototype.put = function (url, body, options) {
        var _this = this;
        return this.getData(url, options, function (url, options) {
            return _this.http.put(url, options);
        });
    };
    /**
     * Performs a request with `delete` http method.
     */
    HttpService.prototype["delete"] = function (url, options) {
        var _this = this;
        return this.getData(url, options, function (url, options) {
            return _this.http["delete"](url, options);
        });
    };
    /*patch(url:string, body:any, options?:RequestOptionsArgs):Observable<any> {
        return this.getPostData(url, body, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.patch(url, body.options);
        });
    }

    head(url:string, options?:RequestOptionsArgs):Observable<any> {
        return this.getData(url, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.head(url, options);
        });
    }

    options(url:string, options?:RequestOptionsArgs):Observable<any> {
        return this.getData(url, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.options(url, options);
        });
    }*/
    HttpService.prototype.getData = function (uri, options, callback, refresh) {
        var _this = this;
        if (refresh === void 0) { refresh = false; }
        var url = uri;
        if (typeof uri !== 'string') {
            url = uri.url;
        }
        var key = url + JSON.stringify(options);
        // если есть кеш и это не первое обращение браузера и не надо принудительно обновить кэш
        if (this._resolveData(key) && !this._resolveData('_' + key) && !refresh) {
            // при первом обращении браузера к этому урлу помечаю что первый запрос уже был
            if (this.isBrowser) {
                this.setCache('_' + key, '_');
            }
            //console.log("from cache",key);
            return this._resolveData(key);
        }
        else {
            return callback(uri, options)
                .map(function (res) { return res.json(); })["do"](function (data) {
                _this.setCache(key, data);
            })["catch"](function (e) { return _this.handleError(e, '_getData'); });
        }
    };
    HttpService.prototype.getUnlimCachedData = function (url, options, callback) {
        var _this = this;
        if (this._resolveData(url)) {
            return this._resolveData(url);
        }
        else {
            return callback(url, options)
                .map(function (res) { return res.json(); })["do"](function (data) { return _this.setCache(url, data); })["catch"](function (e) { return _this.handleError(e, '_getUnlimCachedData'); });
        }
    };
    HttpService.prototype.getPostData = function (uri, body, options, callback) {
        var _this = this;
        var url = uri;
        if (typeof uri !== 'string') {
            url = uri.url;
        }
        var key = url + JSON.stringify(body) + JSON.stringify(options);
        try {
            return this.resolveData(key);
        }
        catch (e) {
            return callback(uri, body, options)
                .map(function (res) { return res.json(); })["do"](function (data) {
                _this.setCache(key, data);
            });
        }
    };
    HttpService.prototype._resolveData = function (key) {
        var data = this.getFromCache(key);
        if (!data) {
            return;
        }
        return Observable_1.Observable.fromPromise(Promise.resolve(data));
    };
    HttpService.prototype.resolveData = function (key) {
        var data = this.getFromCache(key);
        if (!data) {
            throw new Error();
        }
        return Observable_1.Observable.fromPromise(Promise.resolve(data));
    };
    HttpService.prototype.setCache = function (key, data) {
        return this.transferState.set(key, data);
    };
    HttpService.prototype.getFromCache = function (key) {
        return this.transferState.get(key);
    };
    HttpService.prototype.uploadFileWithAuth = function (maxFileSize, url, filename) {
        if (filename === void 0) { filename = "file"; }
        return new ng2_file_upload_1.FileUploader({
            url: this.BASE_URL + url,
            "itemAlias": filename,
            autoUpload: true,
            maxFileSize: maxFileSize,
            //withCredentials: false,
            headers: [{
                    name: 'X-AUTH-TOKEN',
                    value: 'PiU ' + this.getToken()
                }]
        });
    };
    return HttpService;
}());
HttpService = __decorate([
    core_1.Injectable(),
    __param(2, core_1.Inject('BASE_URL')),
    __param(4, core_1.Inject('isBrowser'))
], HttpService);
exports.HttpService = HttpService;
