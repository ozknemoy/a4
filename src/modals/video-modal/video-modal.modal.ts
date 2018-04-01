/**
 * Created by ozknemoy on 11.11.2017.
 */
import { Component } from '@angular/core';
import { DialogRef } from 'angular2-modal';

declare const download:any;

@Component({
    selector: 'video-modal-modal',
    template: '<iframe width="100%" height="500px" [src]="url" frameborder="0" allowfullscreen></iframe>'
})
export class VideoButtonModal {
    private url = this.dialog.context.url;
    private imgUrl:string;

    constructor(private dialog: DialogRef<any>) {}

    close() {
        this.dialog.close();
    }
}
