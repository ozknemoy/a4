/**
 * Created by ozknemoy on 17.01.2017.
 */
import { TooltipModule,BsDropdownModule,CollapseModule  } from 'ng2-bootstrap';
import { ModalModule as BootstrapModalModule} from 'ng2-bootstrap/modal';
import { ModalModule } from 'angular2-modal';
import { ReCaptchaModule } from 'angular2-recaptcha';
//import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {NgxPaginationModule} from 'ngx-pagination/dist/ngx-pagination';
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import {NgxBarcodeModule} from "ngx-barcode";
import {JWBootstrapSwitchModule} from "jw-bootstrap-switch-ng2";
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";
//https://github.com/PointInside/ng2-toastr
//import {AuthConfig} from '../config/satelizer.config';
//import { HttpInterceptorModule } from 'ng-http-interceptor';

// в импорты модулей приложения. не в модуль директив!!!
export const vendorModules = [
    //Ng2UiAuthModule.forRoot(AuthConfig),
    //HttpInterceptorModule,
    ToastModule.forRoot(),
    ReCaptchaModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    NgxBarcodeModule,
    NgxQRCodeModule,
    JWBootstrapSwitchModule,

    //bootstrap Modules
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    BootstrapModalModule,
    CollapseModule.forRoot(),

];

