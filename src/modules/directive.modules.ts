/**
 * Created by ozknemoy on 15.01.2017.
 * директивы и компоненты. ангулара, сторонние и мои
 * этот модуль должен наследовать каждый модуль приложения
 *
 */


import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {ConfirmDirective} from "../directives/r";
import {CommonModule} from "@angular/common";

import {OzkNumberDirective} from '../directives/ozk-number'
import AsyncValidator from "../directives/async-validator";
import {vendorModules} from './vendor.modules';
import { MyDatePickerModule } from 'mydatepicker';//https://github.com/kekeh/mydatepicker
import {FileUploadModule} from "ng2-file-upload/file-upload/file-upload.module";


import {Ng2MaskModule} from '../../vendor/ng2-mask-ru';
//import {MdlModule } from 'angular2-mdl';
//import { MdlSelectModule } from '@angular2-mdl-ext/select';
//import { MdlPopoverModule } from '@angular2-mdl-ext/popover';

//import { /*MatSelectModule*/MdSelectModule } from '@angular/material';
import {FileUploaderComponent} from '../directives/file-uploader/file-uploader.component';
import {ScrollDirective} from "../directives/scroll-to.directive";
import {LoginModalComponent} from "../modals/login-modal/login-modal";
import {HeaderPrioriti} from "../directives/header-prioriti/header-prioriti";
import {TimeFilter} from "../directives/time-filter/time-filter";
import {OuterHrefModalComponent} from "../modals/outer-href-modal/outer-href-modal";
import {EmailToUserModal} from "../modals/email-to-user/email-to-user";
import {UserInfoModal} from "../modals/user-info-modal/user-info-modal.modal";

// helpers
// без этого не заработает модалка
import {BSModalContainer} from "angular2-modal/plugins/bootstrap/modal-container.component";
import {BSMessageModal, BSMessageModalTitle, BSMessageModalBody, BSModalFooter} from "angular2-modal/plugins/bootstrap/message-modal.component";


import {EmailToUserDirective} from "../modals/email-to-user/email-to-user.directive";
import {OuterHrefDirective} from "../modals/outer-href-modal/outer-href.directive";
import {loginModalButtonDirective} from "../modals/login-modal/login-modal.directive";
import {HrefDirective} from "../directives/href.directive";
import {UserInfoModalDirective} from "../modals/user-info-modal/user-info-modal.directive";
import {AutofocusDirective} from "../directives/autofocus.directive";
import {BarcodeButtonModal} from "../modals/barcode-button/barcode-button.modal";
import {BarcodeButtonDirective} from "../modals/barcode-button/barcode-button.component";
import {VideoButtonDirective} from "../modals/video-modal/video-modal-button.directive";
import {VideoButtonModal} from "../modals/video-modal/video-modal.modal";

const __entryComponents__ = [
    BSModalContainer,BSMessageModal, BSMessageModalTitle, BSMessageModalBody, BSModalFooter
];

export const vendorDirectiveModules = [
    Ng2MaskModule,
    MyDatePickerModule,
    FileUploadModule,
    //MdlModule,
    //MdlPopoverModule,nossr
    //MdlSelectModule,nossr
    //MdSelectModule,


];

const __modals__ = [
    EmailToUserModal,
    UserInfoModal,
    BarcodeButtonModal,
    VideoButtonModal,
    LoginModalComponent,
    OuterHrefModalComponent
];
export const routelessComponents = [
    //OuterHrefModalComponent,
    OuterHrefDirective,
    loginModalButtonDirective,
    HeaderPrioriti,
    TimeFilter,
    HrefDirective,
    UserInfoModalDirective,
    BarcodeButtonDirective,
    VideoButtonDirective,
    AutofocusDirective,
    //modal
    EmailToUserDirective,

    FileUploaderComponent,
    OzkNumberDirective,
    ConfirmDirective,
    AsyncValidator,
    ScrollDirective

];

@NgModule({
    imports: [RouterModule,CommonModule,FormsModule, vendorDirectiveModules,vendorModules],
    declarations:[routelessComponents,__modals__,__entryComponents__],
    exports:[routelessComponents,vendorDirectiveModules,CommonModule,FormsModule],
    // IMPORTANT:
    // динамические компоненты
    // Since 'EmailToUserModal' is never explicitly used (in a template)
    // we must tell angular about it.
    entryComponents: [ __modals__,__entryComponents__ ]
})
export class DirectiveModule{}