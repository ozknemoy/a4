/**
 * Created by ozknemoy on 13.11.2017.
 */
import { Component,Inject } from '@angular/core';
import { HttpService } from '../../../modules/transfer-http/transfer-http';
import {HandleData} from "../../../services/handle-data.service";


@Component({
    selector: 'biz-actions-view',
    templateUrl: 'biz-actions-view.html'
})
export class BizActionsView {

    public currentPage = 1;
    public rest=0;// осталось дней до конца месяца
    constructor(public httpService: HttpService,public handleData: HandleData) {


    }

    ngOnInit() {

    }

}