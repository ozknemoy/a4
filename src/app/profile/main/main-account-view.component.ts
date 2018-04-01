import { Component, Inject, ViewChild } from '@angular/core';
import { HttpService } from '../../../modules/transfer-http/transfer-http';
import {ModalDirective} from "ng2-bootstrap/modal";
import {AutoUnsubscribe} from "../../../services/@AutoUnsubscribe.decorator";

interface IBilling {
    items: IBillingTableRow[],
    balance: number,
    received: number,
    spent: number
}
interface IBillingTableRow {
    date: string,
    name: string,
    partner: string,
    sum: string | number
}
/*     мои счет    */
@Component({
    selector: 'main-account-view',
    templateUrl: 'main-account-view.html'
})
@AutoUnsubscribe()
export class MainAccountView {
    public temp = <any>{};
    public table = <any>[];
    public currentPage = 1;
    get$$;
    @ViewChild('moneyModal') public moneyModal:ModalDirective;
    constructor(public httpService: HttpService) {}

    ngOnInit() {

    }

    filterCallback(obj) {
        this.temp.startDotted = obj.startDotted;
        this.temp.endDotted = obj.endDotted;
        this.get$$ = this.httpService.get('payments/billing' + obj.queryUrl).subscribe( (d:IBilling)=> {
            d.items.forEach((row:IBillingTableRow)=> {
                row.sum = +row.sum;
                row.date = row.date.slice(0, 19);
            });
            this.table = d
        });
    }

    getMoney() {

    }
}
