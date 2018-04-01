/**
 * Created by ozknemoy on 15.05.2017.
 */
import {Directive,Input} from "@angular/core";
import {UserInfoModal} from "./user-info-modal.modal";
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Directive({
    selector: '[user-info-modal]',
    host: {
        '(click)': 'open()'
    }
})
export class UserInfoModalDirective {
    @Input() user;

    constructor(public modal:Modal) {}

    open() {
        this.modal.open(UserInfoModal, overlayConfigFactory({
                isBlocking: false,// кликабельный бэкдроп
                dialogClass: 'modal-dialog',//иначе не пашет
                size: 'sm',
                user: this.user
            }))
    }
}
