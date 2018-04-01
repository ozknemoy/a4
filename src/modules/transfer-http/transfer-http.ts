import { Injectable,Inject } from '@angular/core';
import { ConnectionBackend, Http, Request, RequestOptions, RequestOptionsArgs, Response,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TransferState } from '../transfer-state/transfer-state';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';
import {LocalStorage} from "../../services/localStorage.service";
import {FileUploader} from "ng2-file-upload";
import {HandleData} from "../../services/handle-data.service";

@Injectable()
export class HttpService {
    //isBrowser;
    BASE_URL_IMG: string;
    headers = Headers;
    URL_IMG = 'file/download?filename=';
    constructor(
        private http:Http,
        protected transferState:TransferState,
        @Inject('BASE_URL') public BASE_URL,
        public localStorage :LocalStorage,
        @Inject('isBrowser') public isBrowser,
        public handleData: HandleData,
        private toast:ToastsManager

    ) {
        //this.isBrowser = _isBrowser();
    }
    

    getUnlimCache(url:string,withAuth = false) {
        const headers = this.doWitAuth();
        return this.getUnlimCachedData(
            this.BASE_URL + url,
            headers && withAuth?{headers}:undefined,
            (url:string, options:RequestOptionsArgs) => {
            return this.http.get(url, options);
        })
    }

    getCacheWithCond(bool:boolean, url:string) {
        return this[bool?'getUnlimCache':'get'](url, true)
    }

    isAuth() {
       return !!this.getToken()
    }

    login(obj) {
        return this.post('users/auth',obj).map(d=> {
            this.localStorage.setAuth(d);
            this.toast.info('', 'Вы успешно вошли.', {
                showCloseButton: true,
                toastLife: 5e3
            });
            return d
        })
    }

    getToken() {
        if(this.isBrowser) {
            return this.localStorage.get('hash');
        } else {
            return this.localStorage.auth['hash']
        }

    }

    // с кешем
    get(url:string,refresh=false) {
        const headers:Headers = this.doWitAuth();
        return this.__get(this.BASE_URL + url, headers?{headers}:undefined,refresh)
    }

    // без кеша
    getWithoutCache(url,local=false) {
        const headers = this.doWitAuth();
        return this.http.get((local? '' : this.BASE_URL + url), headers?{headers}:undefined)
            ['map'](r=> r.json())
            .catch(e=> this.handleError(e,'_getWithoutCache'))
    }

    getAuthless(url:string) {
        let headers = new this.headers({'Content-Type': 'application/json'});
        return this.__get(this.BASE_URL + url, {headers})
    }

    getOnlyByBrowser(url,local=false) {
        const headers = this.doWitAuth();
        return this.http.get((local? '' : this.BASE_URL + url), headers?{headers}:undefined)
            ['map'](r=> r.json())
            .catch(e=> this.handleError(e,'_getWithoutCache'))
    }

    // обрабатываю ошибки тостами для браузера и консолью для ноды
    handleError(e,str:string) {
        if(!this.isBrowser) {
            this.setCache('node-errors',e._body);
            console.log((new Date() + '').slice(4,25) + "__handleError in httpService by " + str,e.url,e._body);
        } else {
            var err = <any>e.json();
            if(err.errors && typeof err.errors==='string') {
                this.toast.error(err.errors, 'Ошибка!', {
                    showCloseButton: true,
                    toastLife: 22e3
                });
            } else if(err.errors && typeof err.errors==='object') {
                this.handleErrObject(err.errors).forEach(e=> {
                    this.toast.error(e, 'Ошибка!', {
                        showCloseButton: true,
                        toastLife: 22e3
                    });
                })
            }
            
        }

        return Observable.throw(e)
    }

    // обрабатываю в удобоваримый вид ошибки с сервера
    handleErrObject(obj) {
        var ArrOfErrors = [];
        for(var key in obj) {
            ArrOfErrors.push(obj[key][0])
        }
        return ArrOfErrors
    }

    post(url:string,_d,textToast='',toastLife= 7e3) {//WithAuth

        var d = JSON.stringify(_d);
        var headers = this.doWitAuth(d);
        return this.http.post(this.BASE_URL + url,d, {headers})
            ['map'](r=> {
                if(textToast!=='') {
                    this.toast.success('', textToast, {
                        showCloseButton: true,
                        toastLife
                    });
                }
                return r.json()
            })
            .catch(e=> this.handleError(e,'_post'))
    }

    postWithToast(url:string,_d,text = 'Успешно сохранено',toastLife?){
        return this.post(url,_d,text,toastLife)
    }

    _post(url, d) {
        return this.http.post(this.BASE_URL + url, d)
            ['map'](r=> r.json())
            .catch(e=> this.handleError(e,'_post'))
    }

    _put(url, d) {
        return this.http.put(this.BASE_URL + url, d)['map'](r=> r.json())
    }

    doWitAuth(str='') {
        const t =  this.getToken();
        let _headers = new this.headers();
        let hash = this.handleData.getHash(str);
        if(t) _headers.append('X-AUTH-TOKEN', 'PiU ' + t);
        _headers.append('X-DUDE', 'ANG ' + hash);
        _headers.append('Content-Type', 'application/json');
        return _headers
    }

    restorePassword(password:string) {
        return this.postWithToast(
            'users/requestPasswordReset',
            {"email": password},
            'Вы успешно сменили пароль.')
    };

    preRestorePassword(email:string) {
        return this.postWithToast(
            'users/requestPasswordReset',
            {"email": email.toLowerCase()},
            'Вам на почту отправлено письмо с инструкцией по смене пароля.',20e3)
    };











    ////////////////////////////////////////////////

    request(uri:string | Request, options?:RequestOptionsArgs):Observable<any> {
                return this.getData(uri, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.request(url, options);
        });
    }

    /**
     * Performs a request with `get` http method.
     */
    __get(url:string, options?:RequestOptionsArgs, refresh?:boolean):Observable<any> {
        // возможно удалять через какое то время после загрузки браузера кеш на
        //url = this.BASE_URL + url;
        // выборочные урлы

        return this.getData(url, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.get(url, options);
        }, refresh);
    }


    /*post(url:string, body:any, options?:RequestOptionsArgs):Observable<any> {
        return this.getPostData(url, body, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.post(url, body.options);
        });
    }*/

    /**
     * Performs a request with `put` http method.
     */
    put(url:string, body:any, options?:RequestOptionsArgs):Observable<any> {
        return this.getData(url, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.put(url, options);
        });
    }

    /**
     * Performs a request with `delete` http method.
     */
    delete(url:string, options?:RequestOptionsArgs):Observable<any> {
        return this.getData(url, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.delete(url, options);
        });
    }


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

    private getData(uri:string | Request, options:RequestOptionsArgs,
                    callback:(uri:string | Request, options?:RequestOptionsArgs) => Observable<Response>,
                    refresh = false) {

        let url = uri;

        if (typeof uri !== 'string') {
            url = uri.url
        }

        const key = url + JSON.stringify(options);
        // первое обращение браузера берет значение из кеша, потом из сервера

        // если есть кеш и это не первое обращение браузера и не надо принудительно обновить кэш
        if (this._resolveData(key) && !this._resolveData('_' + key) && !refresh) {
            // при первом обращении браузера к этому урлу помечаю что первый запрос уже был
            if(this.isBrowser) {
                this.setCache('_' + key, '_')
            }
            //console.log("from cache",key);

            return this._resolveData(key);

        } else {//кеша нет
            return callback(uri, options)
                ['map'](res => res.json())
                .do(data => {
                    this.setCache(key, data)
                })
                .catch(e=> this.handleError(e,'_getData'))
        }
    }

    private getUnlimCachedData(url:string, options:RequestOptionsArgs,
                    callback:(uri:string, options?:RequestOptionsArgs) => Observable<Response>) {

        if (this._resolveData(url)) {
            return this._resolveData(url)
        } else {
            return callback(url, options)
                ['map'](res => res.json())
                .do(data => this.setCache(url, data))
                .catch(e=> this.handleError(e,'_getUnlimCachedData'))
        }
    }

    private getPostData(uri:string | Request, body:any, options:RequestOptionsArgs, callback:(uri:string | Request, body:any, options?:RequestOptionsArgs) => Observable<Response>) {

        let url = uri;

        if (typeof uri !== 'string') {
            url = uri.url
        }

        const key = url + JSON.stringify(body) + JSON.stringify(options);

        try {

            return this.resolveData(key);

        } catch (e) {
            return callback(uri, body, options)
                ['map'](res => res.json())
                .do(data => {
                    this.setCache(key, data);
                });
        }
    }

    private _resolveData(key:string) {
        const data = this.getFromCache(key);

        if (!data) {
            return
        }

        return Observable['fromPromise'](Promise.resolve(data));
    }

    private resolveData(key:string) {
        const data = this.getFromCache(key);

        if (!data) {
            throw new Error();
        }

        return Observable['fromPromise'](Promise.resolve(data));
    }

    private setCache(key, data) {
        return this.transferState.set(key, data);
    }

    private getFromCache(key):any {
        return this.transferState.get(key);
    }

    uploadFileWithAuth(maxFileSize, url, filename="file") {
        return new FileUploader({
            url: this.BASE_URL + url,
            "itemAlias": filename,
            autoUpload: true,
            maxFileSize,
            //withCredentials: false,
            headers: [{
                name: 'X-AUTH-TOKEN',
                value: 'PiU ' + this.getToken()
            }]
        })
    }
}
