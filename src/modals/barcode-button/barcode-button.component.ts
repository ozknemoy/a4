/**
 * изначально это была модалка отправки письма юзеру
 * Created by ozknemoy on 15.05.2017.
 */
import {Input,Component,Inject} from "@angular/core";
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import {BarcodeButtonModal} from "./barcode-button.modal";
import {UAService} from "../../services/user-agent.service";

@Component({
    selector: 'barcode-button',
    template: '<button class="btn btn-info btn-sm" *ngIf="isMobile">Штрих/QR-код</button>',
    host: {
        '(click)': 'open()'
    }
})

export class BarcodeButtonDirective {
    @Input() code:string;
    private isMobile:boolean;

    constructor(public modal:Modal, public UAService: UAService,@Inject('isBrowser') public isBrowser) {}

    ngOnInit() {
        this.isMobile = this.isBrowser && this.UAService.isMobile.any()
    }

    open() {
        this.modal.open(BarcodeButtonModal, overlayConfigFactory({
            isBlocking: false,
            dialogClass: 'modal-dialog',
            code: this.code
        }))
    }
}
