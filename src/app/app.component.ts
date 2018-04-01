import { Component, OnInit,ViewContainerRef } from '@angular/core'
import { TransferState } from '../modules/transfer-state/transfer-state';
import {ToastsManager} from "ng2-toastr/src/toast-manager";
import {Meta,Title} from "@angular/platform-browser";
import {TITLE} from '../config/small.configs'

@Component({
    selector: 'prioriti-app',
    templateUrl: './app-view.html',
})
export class AppComponent implements OnInit {
    constructor(private cache:TransferState,
                private titleService: Title,
                toast:ToastsManager, vRef:ViewContainerRef) {
        toast.setRootViewContainerRef(vRef);// всегда надо инжектить в корневой компонент
    }

    ngOnInit() {
        this.titleService.setTitle(TITLE);
        this.cache.set('cached', true);
    }
}
