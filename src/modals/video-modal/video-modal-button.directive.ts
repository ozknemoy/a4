/**
 * изначально это была модалка отправки письма юзеру
 * Created by ozknemoy on 11.11.2017.
 */
import {Input,Directive} from "@angular/core";
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import {UAService} from "../../services/user-agent.service";
import {VideoButtonModal} from "./video-modal.modal";
import {DomSanitizer} from "@angular/platform-browser";
import {HandleData} from "../../services/handle-data.service";
import {ToastsManager} from "../../../node_modules/ng2-toastr/src/toast-manager";

@Directive({
    selector: '[video-modal-button]',
    host: {
        '(click)': 'open()'
    }
})

export class VideoButtonDirective {
    @Input() url:any;

    constructor(public modal:Modal,
                public handleData:HandleData,
                private sanitizer:DomSanitizer,
                private toast:ToastsManager) {}

    open() {
        if(this.handleData.getIdFromYoutubeURL(this.url)) {
            this.modal.open(VideoButtonModal, overlayConfigFactory({
                isBlocking: false,
                dialogClass: 'modal-dialog',
                size: 'lg',
                url: this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
            }))
        } else {
            this.toast.error('Урл ролика не валиден', 'Ошибка', {
                showCloseButton: true,
                toastLife: 7e3
            });
        }

    }
}
