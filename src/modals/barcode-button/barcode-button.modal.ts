/**
 * Created by ozknemoy on 15.05.2017.
 */
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {HttpService} from "../../modules/transfer-http/transfer-http";
import {AutoUnsubscribe} from "../../services/@AutoUnsubscribe.decorator";

declare const download:any;

@Component({
    selector: 'barcode-button-modal',
    templateUrl: 'barcode-button.html'
})
export class BarcodeButtonModal {
    private code = this.dialog.context.code;
    private imgUrl:string;
    private type:boolean = true;

    constructor(private dialog: DialogRef<any>) {}

    saveImg() {
        var selector = this.type? '.barcode' : '.qrcode';
        // имя будет как code
        download(
            document.querySelector(selector + ' > img').getAttribute('src'),
            this.code /*, по умолчанию png*/);
    }

    ngAfterViewInit() {
        //не нужно пока не строю изображение дублер
        //this.imgUrl = document.querySelector(' > img').getAttribute('src');
    }

    close() {
        this.dialog.close();
    }
}
