/**
 * Created by ozknemoy on 20.04.2017.
 *
 * <login-modal #loginModal></login-modal>
 *
 * <button class="btn btn-success"  (click)="loginModal.show()">Войти</button>
 */

import {Component} from "@angular/core";
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'outer-href-modal',
    templateUrl: 'outer-href-modal.html'
})
export class OuterHrefModalComponent implements ModalComponent<BSModalContext>  {
    ref:string;
    constructor(public dialog: DialogRef<any>) {
        this.ref = dialog.context.outerHref;
    }

    /*yes() {
        location.href = this.ref
    }*/

    hide() {
        this.dialog.close()
    }
}
