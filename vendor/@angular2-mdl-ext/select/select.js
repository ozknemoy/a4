var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef, ContentChildren, EventEmitter, forwardRef, Input, NgModule, Output, QueryList, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdlPopoverModule, MdlPopoverComponent } from '../popover/index';
import { MdlOptionComponent } from './option';
var uniq = function (array) { return Array.from(new Set(array)); };
function randomId() {
    var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
    return (S4() + S4());
}
var MDL_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdlSelectComponent; }),
    multi: true
};
export var SearchableComponent = (function () {
    function SearchableComponent(searchTimeout) {
        if (searchTimeout === void 0) { searchTimeout = 300; }
        this.clearTimeout = null;
        this.query = '';
        this.searchTimeout = searchTimeout;
    }
    SearchableComponent.prototype.updateSearchQuery = function (event) {
        var _this = this;
        if (this.clearTimeout) {
            clearTimeout(this.clearTimeout);
        }
        this.clearTimeout = setTimeout(function () {
            _this.query = '';
        }, this.searchTimeout);
        this.query += String.fromCharCode(event.keyCode).toLowerCase();
    };
    SearchableComponent.prototype.getSearchQuery = function () {
        return this.query;
    };
    return SearchableComponent;
}());
export var MdlSelectComponent = (function (_super) {
    __extends(MdlSelectComponent, _super);
    function MdlSelectComponent(changeDetectionRef) {
        _super.call(this);
        this.changeDetectionRef = changeDetectionRef;
        this.disabled = false;
        this.placeholder = '';
        this.multiple = false;
        this.change = new EventEmitter(true);
        this.text = '';
        this.textByValue = {};
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        this.focused = false;
        this.textfieldId = "mdl-textfield-" + randomId();
    }
    MdlSelectComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.bindOptions();
        this.renderValue(this.ngModel);
        this.optionComponents.changes.subscribe(function () { return _this.bindOptions(); });
    };
    MdlSelectComponent.prototype.onKeydown = function ($event) {
        if (!this.disabled && this.popoverComponent.isVisible) {
            var closeKeys = ["Escape", "Tab", "Enter"];
            var closeKeyCodes = [13, 27, 9];
            if (closeKeyCodes.indexOf($event.keyCode) != -1 || ($event.key && closeKeys.indexOf($event.key) != -1)) {
                this.popoverComponent.hide();
            }
            else if (!this.multiple) {
                if ($event.keyCode == 38 || ($event.key && $event.key == "ArrowUp")) {
                    this.onArrowUp($event);
                }
                else if ($event.keyCode == 40 || ($event.key && $event.key == "ArrowDown")) {
                    this.onArrowDown($event);
                }
                else if ($event.keyCode >= 31 && $event.keyCode <= 90) {
                    this.onCharacterKeydown($event);
                }
            }
        }
    };
    MdlSelectComponent.prototype.onCharacterKeydown = function ($event) {
        var _this = this;
        this.updateSearchQuery($event);
        var optionsList = this.optionComponents.toArray();
        var filteredOptions = optionsList.filter(function (option) {
            return option.text.toLowerCase().startsWith(_this.getSearchQuery());
        });
        var selectedOption = optionsList.find(function (option) { return option.selected; });
        if (filteredOptions.length > 0) {
            var selectedOptionInFiltered = filteredOptions.indexOf(selectedOption) != -1;
            if (!selectedOptionInFiltered && !filteredOptions[0].selected) {
                this.onSelect($event, filteredOptions[0].value);
            }
        }
        $event.preventDefault();
    };
    MdlSelectComponent.prototype.onArrowUp = function ($event) {
        var arr = this.optionComponents.toArray();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].selected) {
                if (i - 1 >= 0) {
                    this.onSelect($event, arr[i - 1].value);
                }
                break;
            }
        }
        $event.preventDefault();
    };
    MdlSelectComponent.prototype.onArrowDown = function ($event) {
        var arr = this.optionComponents.toArray();
        var selectedOption = arr.find(function (option) { return option.selected; });
        if (selectedOption) {
            var selectedOptionIndex = arr.indexOf(selectedOption);
            if (selectedOptionIndex + 1 < arr.length) {
                this.onSelect($event, arr[selectedOptionIndex + 1].value);
            }
        }
        else {
            this.onSelect($event, arr[0].value);
        }
        $event.preventDefault();
    };
    MdlSelectComponent.prototype.addFocus = function () {
        this.focused = true;
    };
    MdlSelectComponent.prototype.removeFocus = function () {
        this.focused = false;
    };
    MdlSelectComponent.prototype.isEmpty = function () {
        return this.multiple ? !this.ngModel.length : !this.ngModel;
    };
    // rebind options and reset value in connected select
    MdlSelectComponent.prototype.reset = function (resetValue) {
        if (resetValue === void 0) { resetValue = true; }
        if (resetValue && !this.isEmpty()) {
            this.ngModel = this.multiple ? [] : '';
            this.onChange(this.ngModel);
            this.change.emit(this.ngModel);
            this.renderValue(this.ngModel);
        }
    };
    MdlSelectComponent.prototype.bindOptions = function () {
        var _this = this;
        this.optionComponents.forEach(function (selectOptionComponent) {
            selectOptionComponent.setMultiple(_this.multiple);
            selectOptionComponent.onSelect = _this.onSelect.bind(_this);
            if (selectOptionComponent.value != null) {
                _this.textByValue[_this.stringifyValue(selectOptionComponent.value)] = selectOptionComponent.text;
            }
        });
    };
    MdlSelectComponent.prototype.renderValue = function (value) {
        var _this = this;
        if (this.multiple) {
            this.text = value.map(function (value) { return _this.textByValue[_this.stringifyValue(value)]; }).join(', ');
        }
        else {
            this.text = this.textByValue[this.stringifyValue(value)] || '';
        }
        this.changeDetectionRef.detectChanges();
        if (this.optionComponents) {
            this.optionComponents.forEach(function (selectOptionComponent) {
                selectOptionComponent.updateSelected(value);
            });
        }
    };
    MdlSelectComponent.prototype.stringifyValue = function (value) {
        switch (typeof value) {
            case 'number': return String(value);
            case 'object': return JSON.stringify(value);
            default: return (!!value) ? String(value) : '';
        }
    };
    MdlSelectComponent.prototype.toggle = function ($event) {
        if (!this.disabled) {
            this.popoverComponent.toggle($event);
            $event.stopPropagation();
        }
    };
    MdlSelectComponent.prototype.open = function ($event) {
        if (!this.disabled && !this.popoverComponent.isVisible) {
            this.popoverComponent.show($event);
        }
    };
    MdlSelectComponent.prototype.close = function ($event) {
        if (!this.disabled && this.popoverComponent.isVisible) {
            this.popoverComponent.hide();
        }
    };
    MdlSelectComponent.prototype.onSelect = function ($event, value) {
        if (this.multiple) {
            // prevent popup close on click inside popover when selecting multiple
            $event.stopPropagation();
        }
        else {
            var popover = this.popoverComponent.elementRef.nativeElement;
            var list = popover.querySelector(".mdl-list");
            var option_1 = null;
            this.optionComponents.forEach(function (o) {
                // not great for long lists because break is not available
                if (o.value == value) {
                    option_1 = o.contentWrapper.nativeElement;
                }
            });
            if (option_1) {
                var selectedItemElem = option_1.parentElement;
                var computedScrollTop = selectedItemElem.offsetTop - (list.clientHeight / 2) + (selectedItemElem.clientHeight / 2);
                list.scrollTop = Math.max(computedScrollTop, 0);
            }
        }
        this.writeValue(value);
        this.change.emit(this.ngModel);
    };
    MdlSelectComponent.prototype.writeValue = function (value) {
        var _this = this;
        if (this.multiple) {
            this.ngModel = this.ngModel || [];
            if (!value || this.ngModel === value) {
            }
            else if (Array.isArray(value)) {
                this.ngModel = uniq(this.ngModel.concat(value));
            }
            else if (this.ngModel.map(function (v) { return _this.stringifyValue(v); }).indexOf(this.stringifyValue(value)) != -1) {
                this.ngModel = this.ngModel.filter(function (v) { return _this.stringifyValue(v) !== _this.stringifyValue(value); }).slice();
            }
            else if (!!value) {
                this.ngModel = this.ngModel.concat([value]);
            }
        }
        else {
            this.ngModel = value;
        }
        this.onChange(this.ngModel);
        this.renderValue(this.ngModel);
    };
    MdlSelectComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    MdlSelectComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    MdlSelectComponent.prototype.getLabelVisibility = function () {
        return this.isFloatingLabel == null || (this.isFloatingLabel != null && this.text != null && this.text.length > 0) ? "block" : "none";
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdlSelectComponent.prototype, "ngModel", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdlSelectComponent.prototype, "disabled", void 0);
    __decorate([
        Input('floating-label'), 
        __metadata('design:type', Object)
    ], MdlSelectComponent.prototype, "isFloatingLabel", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdlSelectComponent.prototype, "placeholder", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdlSelectComponent.prototype, "multiple", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], MdlSelectComponent.prototype, "change", void 0);
    __decorate([
        ViewChild(MdlPopoverComponent), 
        __metadata('design:type', MdlPopoverComponent)
    ], MdlSelectComponent.prototype, "popoverComponent", void 0);
    __decorate([
        ContentChildren(MdlOptionComponent), 
        __metadata('design:type', QueryList)
    ], MdlSelectComponent.prototype, "optionComponents", void 0);
    __decorate([
        HostListener('document:keydown', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], MdlSelectComponent.prototype, "onKeydown", null);
    MdlSelectComponent = __decorate([
        Component({selector: 'mdl-select',
            host: {
                '[class.mdl-select]': 'true',
                '[class.mdl-select--floating-label]': 'isFloatingLabel != null'
            },
            template: "<div class=\"mdl-textfield is-upgraded has-placeholder\" [class.is-focused]=\"this.popoverComponent.isVisible || this.focused\" [class.is-disabled]=\"this.disabled\" [class.is-dirty]=\"text != null && text.length > 0\"> <span [attr.tabindex]=\"!this.disabled ? 0 : null\" (focus)=\"open($event);addFocus();\" (blur)=\"removeFocus()\"> <!-- don't want click to also trigger focus --> </span> <input readonly tabindex=\"-1\" [placeholder]=\"placeholder\" class=\"mdl-textfield__input\" (click)=\"toggle($event)\" [attr.id]=\"textfieldId\" [value]=\"text\"> <span class=\"mdl-select__toggle material-icons\" (click)=\"toggle($event)\"> keyboard_arrow_down </span> <label class=\"mdl-textfield__label\" [attr.for]=\"textfieldId\">{{ placeholder }}</label> <span class=\"mdl-textfield__error\"></span> <mdl-popover hide-on-click=\"!multiple\" [style.width.%]=\"100\"> <div class=\"mdl-list mdl-shadow--6dp\"> <ng-content></ng-content> </div> </mdl-popover> </div> ",
            encapsulation: ViewEncapsulation.None,
            providers: [MDL_SELECT_VALUE_ACCESSOR]
        }), 
        __metadata('design:paramtypes', [ChangeDetectorRef])
    ], MdlSelectComponent);
    return MdlSelectComponent;
}(SearchableComponent));
export var MdlSelectModule = (function () {
    function MdlSelectModule() {
    }
    MdlSelectModule.forRoot = function () {
        return {
            ngModule: MdlSelectModule,
            providers: []
        };
    };
    MdlSelectModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                MdlPopoverModule
            ],
            exports: [
                MdlSelectComponent,
                MdlOptionComponent
            ],
            declarations: [
                MdlSelectComponent,
                MdlOptionComponent
            ],
            providers: [
                MDL_SELECT_VALUE_ACCESSOR
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], MdlSelectModule);
    return MdlSelectModule;
}());

//# sourceMappingURL=select.js.map
