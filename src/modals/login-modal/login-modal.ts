/**
 * Created by ozknemoy on 20.04.2017.
 *
 * <login-modal #loginModal></login-modal>
 *
 * <button class="btn btn-success"  (click)="loginModal.show()">Войти</button>
 */

import {Component,ChangeDetectorRef} from "@angular/core";
import {HttpService} from "../../modules/transfer-http/transfer-http";
import {ModalDirective} from "ng2-bootstrap/modal";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";
import { DialogRef } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {SharedService} from "../../services/shared.service";

@Component({
    selector: 'login-modal',
    templateUrl: 'login-modal.html'
})
export class LoginModalComponent {
    toggle = false;
    restoreErr:string|boolean = false;
    loginErr:string|boolean = false;
    pend:boolean = false;
    constructor(public httpService: HttpService,
                public router: Router,
                public changeDetectorRef: ChangeDetectorRef,
                private sharedService: SharedService,
                public dialog: DialogRef<BSModalContext>,
                public toast:ToastsManager) {

    }

    login(form) {
        if(form.invalid) return;
        this.pend = true;
        this.httpService.login({
            password: form.value.password,
            email: form.value.email.toLowerCase()
        }).subscribe(d => {
            this.loginErr = false;
            this.hide();
            setTimeout(()=> {
                this.sharedService.emit['isLogIn'](true);
                this.router.navigate(['/profile/main/common']);
            },100)

        },e=> this.loginErr = e.message,()=> this.pend = false);
    }

    restore(obj) {
        this.pend = true;
        this.httpService.preRestorePassword(obj.email).subscribe(d=> {
            this.restoreErr = false;
                this.hide();
        },e=> this.restoreErr = e.message
         ,()=> this.pend = false)
    }
    hide() {
        this.dialog.close()
    }
}
