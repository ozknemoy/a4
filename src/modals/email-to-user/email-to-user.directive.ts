/**
 * изначально это была модалка отправки письма юзеру
 * Created by ozknemoy on 15.05.2017.
 */
import {Directive,Input} from "@angular/core";
import {EmailToUserModal} from "./email-to-user";
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Directive({
    selector: '[email-to-user]',
    host: {
        '(click)': 'open()'
    }
})

export class EmailToUserDirective {
    /*@Input() userId:string;
    @Input() user;*/
    constructor(public modal:Modal) {}

    open() {
        this.modal.open(EmailToUserModal, overlayConfigFactory({
                isBlocking: false,// кликабельный бэкдроп
                dialogClass: 'modal-dialog',//иначе не пашет
                //user: this.user
                //userId: this.userId
            }))
            //.then(dialog => dialog.result) // необходимо
            //.then(result => console.log("SAVED", result)) // if were here ok was clicked.
            //.catch(err => console.log("CANCELED")) // if were here it was cancelled (click or non block click)

    }
}
