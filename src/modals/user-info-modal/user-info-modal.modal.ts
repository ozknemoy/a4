/**
 * Created by ozknemoy on 15.05.2017.
 */
import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {HttpService} from "../../modules/transfer-http/transfer-http";

@Component({
    selector: 'user-info',
    templateUrl: './user-info-modal.html'
})
export class UserInfoModal implements ModalComponent<BSModalContext> {
    user: any;
    text = '';

    constructor(public dialog: DialogRef<any>, public httpService: HttpService) {
        this.user = dialog.context.user;

    }

    close() {
        this.dialog.close();
    }
}
