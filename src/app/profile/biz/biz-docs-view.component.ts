/**
 * Created by ozknemoy on 13.04.2017.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../modules/transfer-http/transfer-http';
import {HandleData} from "../../../services/handle-data.service";
import {IDictUrlCaption} from "./biz-edu-view.component";


@Component({
    selector: 'biz-docs-view',
    templateUrl: 'biz-docs-view.html'
})
export class BizDocsView {
    public docs:IDictUrlCaption[];


    constructor(public httpService: HttpService,public handleData: HandleData) {

    }

    ngOnInit() {
        this.httpService.getUnlimCache('lessons/document').subscribe((d:IDictUrlCaption[])=> {
            this.docs = d
        })
    }

}