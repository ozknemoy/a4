/**
 * Created by ozknemoy on 26.04.2017.
 */
/**
 * Created by ozknemoy on 26.04.2017.
 */
import {Component,Inject} from '@angular/core';
import {HttpService} from '../../../modules/transfer-http/transfer-http';
import {HandleData} from "../../../services/handle-data.service";
import {AutoUnsubscribe} from "../../../services/@AutoUnsubscribe.decorator";


@Component({
    selector: 'main-bank-view',
    templateUrl: './main-bank-view.html',
})
@AutoUnsubscribe()
export class ProfileMainBankView {

    public temp = <any>{};
    public pend = false;
    public bank$;
    public user = {
        name: null,
        bik: null,
        corr: null,
        account: null
    };

    constructor(public httpService: HttpService,
                @Inject('dateOptions') public dateOptions) {

    }

    ngOnInit() {
        this.bank$ = this.httpService.get('profiles/bank').subscribe(
            d => {
                this.user = d.UserBank;
                //this.pend = false;
            });
    }

    save() {
        this.pend = true;
        this.httpService.postWithToast('profiles/bank',{UserBank: this.user}).subscribe(
            d => {
                //this.user = d;
                this.pend = false;
            }, e => this.pend = false);
    }


}
