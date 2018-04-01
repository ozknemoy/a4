"use strict";
exports.__esModule = true;
/**
 * Created by ozknemoy on 25.03.2017.
 */
function isBrowser() {
    return typeof window !== 'undefined';
    /*try {
        return !!(window)
    } catch (e) {
        return false
    }*/
}
exports.isBrowser = isBrowser;
