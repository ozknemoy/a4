"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var handle_data_class_1 = require("./handle-data.class");
/**
 * Created by ozknemoy on 04.04.2017.
 */
var HandleData = (function (_super) {
    __extends(HandleData, _super);
    /*
     * Can't resolve all parameters for SharedService: (?)  означает круговое di
     * constructor(public localStorage :LocalStorage) {
     * super(LocalStorage);
     * }
     */
    function HandleData() {
        return _super.call(this) || this;
    }
    return HandleData;
}(handle_data_class_1.HandleDataClass));
HandleData = __decorate([
    core_1.Injectable()
], HandleData);
exports.HandleData = HandleData;
