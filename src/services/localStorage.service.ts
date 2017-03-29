/**
 * Created by ozknemoy on 02.03.2017.
 */
import {isBrowser as _isBrowser} from '../config/is-browser'
import {Inject,Injectable} from '@angular/core';

@Injectable()
export class LocalStorage {
    storageKeyPrefix:string = 'ngStorage-';
    storageType:string = 'localstorage';
    isBrowser:boolean;
    constructor(@Inject('isBrowser') public _isBrowser:any) {
        this.isBrowser = this._isBrowser();
        console.log("isBrowser",this.isBrowser);

    }

    get(key) {
        if (this.isBrowser) {
            return (window.localStorage.getItem(this.storageKeyPrefix + key));
        } else {
            return this[key]
        }
    };

    set(key, value) {
        if (this.isBrowser) {
            return window.localStorage.setItem(this.storageKeyPrefix + key, value)
        } else {
            this[key] = value
        }
    };

    setKeys(obj) {
        if (this.isBrowser) {
            for (let key in obj) {
                window.localStorage.setItem(this.storageKeyPrefix + key, obj[key])
            }
        } else {
            for (let key in obj) {
                this[key] = obj[key]
            }
        }
    };

    // возвращает cookie с именем name, если есть, если нет, то undefined
    getCookie(name, cookie) {
        if(!cookie) return;
        const c = new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)");
        if (this.isBrowser) {
            var m = <RegExpMatchArray>document.cookie.match(c);
            return m ? decodeURIComponent(m[1]) : undefined;
        } else {
            var matches = <RegExpMatchArray>cookie.match(c);
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }


    }

    setCookie(name, value, options=<any>{expires:100000000}) {

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }

    deleteCookie(name) {
        this.setCookie(name, "", {
            expires: -1
        })
    }

    reset() {
        window.localStorage.clear();
    }

}