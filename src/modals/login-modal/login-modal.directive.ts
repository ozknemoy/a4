/**
 * Created by ozknemoy on 15.05.2017.
 */
import {Directive,Input} from "@angular/core";
import {LoginModalComponent} from "./login-modal";
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Directive({
    selector: '[loginModalButton]',
    host: {
        '(click)': 'click()'
    }
})

export class loginModalButtonDirective {

    constructor(public modal:Modal) {}

    click() {
        this.modal.open(LoginModalComponent, overlayConfigFactory({
                isBlocking: false,// кликабельный бэкдроп
                dialogClass: 'modal-dialog',//иначе не пашет
            }))
    }
}
