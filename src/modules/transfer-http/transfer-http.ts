import { Injectable,Inject } from '@angular/core';
import { ConnectionBackend, Http, Request, RequestOptions, RequestOptionsArgs, Response,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TransferState } from '../transfer-state/transfer-state';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';
import {LocalStorage} from "../../services/localStorage.service";

@Injectable()
export class httpService {
    BASE_URL_IMG: string;
    headers = Headers;
    URL_IMG = 'file/download?filename=';
    isBrowser:boolean;
    constructor(
        private http:Http, protected transferState:TransferState,
        @Inject('BASE_URL') public BASE_URL,
        public localStorage :LocalStorage,
        @Inject('isBrowser') public _isBrowser:any

    ) {
        this.isBrowser = this._isBrowser();
    }

    getToken() {
        return this.localStorage.get('token');
    }

    getWithAuth(url:string,refresh=false) {
        var headers = this.doWitAuth()
        return this.get(this.BASE_URL + url, headers?{headers}:undefined,refresh)
    }

    _get(url) {
        return this.http.get(this.BASE_URL + url).map(r=> r.json())
    }

    _post(url, d) {
        return this.http.post(this.BASE_URL + url, d).map(r=> r.json())
    }

    _put(url, d) {
        return this.http.put(this.BASE_URL + url, d).map(r=> r.json())
    }

    doWitAuth() {
        const t =  this.getToken();
        if(!t) return;
        let _headers = new this.headers();
        _headers.append('X-AUTH-TOKEN', this.getToken());
        return _headers
    }

    ////////////////////////////////////////////////

    request(uri:string | Request, options?:RequestOptionsArgs):Observable<any> {
        console.log("__request");

        return this.getData(uri, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.request(url, options);
        });
    }

    /**
     * Performs a request with `get` http method.
     */
    get(url:string, options?:RequestOptionsArgs, refresh?:boolean):Observable<any> {
        // возможно удалять через какое то время после загрузки браузера кеш на
        // выборочные урлы

        return this.getData(url, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.get(url, options);
        }, refresh);
    }

    /**
     * Performs a request with `post` http method.
     */
    post(url:string, body:any, options?:RequestOptionsArgs):Observable<any> {
        return this.getPostData(url, body, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.post(url, body.options);
        });
    }

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

    /**
     * Performs a request with `patch` http method.
     */
    patch(url:string, body:any, options?:RequestOptionsArgs):Observable<any> {
        return this.getPostData(url, body, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.patch(url, body.options);
        });
    }

    /**
     * Performs a request with `head` http method.
     */
    head(url:string, options?:RequestOptionsArgs):Observable<any> {
        return this.getData(url, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.head(url, options);
        });
    }

    /**
     * Performs a request with `options` http method.
     */
    options(url:string, options?:RequestOptionsArgs):Observable<any> {
        return this.getData(url, options, (url:string, options:RequestOptionsArgs) => {
            return this.http.options(url, options);
        });
    }

    private getData(uri:string | Request, options:RequestOptionsArgs,
                    callback:(uri:string | Request, options?:RequestOptionsArgs) => Observable<Response>,
                    refresh = false) {

        let url = uri;

        if (typeof uri !== 'string') {
            url = uri.url
        }

        const key = url + JSON.stringify(options);
        // если есть кеш и это не первое обращение браузера и не надо принудительно обновить кэш
        if (this._resolveData(key) && !this._resolveData('_' + key) && !refresh) {
            // при первом обращении браузера к этому урлу помечаю что первый запрос уже был
            if(this.isBrowser) {
                this.setCache('_' + key, '_')
            }
            console.log("from cache",key);

            return this._resolveData(key);

        } else {//кеша нет
            return callback(uri, options)
                .map(res => res.json())
                .do(data => {
                    this.setCache(key, data)
                });
        }

    }
    private getUnlimCachedData(url:string, options:RequestOptionsArgs,
                    callback:(uri:string | Request, options?:RequestOptionsArgs) => Observable<Response>) {

        const key = url + JSON.stringify(options);
        if (this._resolveData(key)) {// если есть кеш
            return this._resolveData(key)
        } else {//кеша нет
            return callback(url, options)
                .map(res => res.json())
                .do(data => {
                    this.setCache(key, data);
                })
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
                .map(res => res.json())
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

        return Observable.fromPromise(Promise.resolve(data));
    }

    private resolveData(key:string) {
        const data = this.getFromCache(key);

        if (!data) {
            throw new Error();
        }

        return Observable.fromPromise(Promise.resolve(data));
    }

    private setCache(key, data) {
        return this.transferState.set(key, data);
    }

    private getFromCache(key):any {
        return this.transferState.get(key);
    }


}
