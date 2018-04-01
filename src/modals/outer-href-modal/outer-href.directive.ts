/**
 * Created by ozknemoy on 15.05.2017.
 */
import {Directive,Input} from "@angular/core";
import {OuterHrefModalComponent} from "./outer-href-modal";
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import {HttpService} from "../../modules/transfer-http/transfer-http";

@Directive({
    selector: '[outerHref]',
    host: {
        '(click)': 'click()'
    }
})

export class OuterHrefDirective {
    @Input() outerHref: string;

    constructor(public modal:Modal,public httpService: HttpService) {}

    click() {
        if(this.httpService.isAuth()) {
            console.log("outerHref",this.outerHref);
            window.open(/*'http://' + */this.outerHref, "_blank")
        } else {
            this.modal.open(OuterHrefModalComponent, overlayConfigFactory({
                    isBlocking: false,// кликабельный бэкдроп
                    dialogClass: 'modal-dialog',//иначе не пашет
                    outerHref: this.outerHref// любая дата
                }))
        }

    }
}
