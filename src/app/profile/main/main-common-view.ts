/**
 * Created by ozknemoy on 26.04.2017.
 */
import {Component,Inject} from '@angular/core';
import {HttpService} from '../../../modules/transfer-http/transfer-http';
import {HandleData} from "../../../services/handle-data.service";
import {LocalStorage} from "../../../services/localStorage.service";
import {AutoUnsubscribe} from "../../../services/@AutoUnsubscribe.decorator";

/*контроллер сохранения фио*/
@Component({
    selector: 'main-common-view',
    templateUrl: './main-common-view.html',
})
@AutoUnsubscribe()
export class ProfileMainCommonView {

    temp = <any>{};
    pend = false;
    main$;post$;
    public user = <any>{};

    constructor(public httpService:HttpService,
                public handleData:HandleData,
                public localStorage:LocalStorage,
                @Inject('dateOptions') public dateOptions) {


    }

    ngOnInit() {
        this.main$ = this.httpService.get('profiles/main').subscribe(d => {
            this.user = d.User;
        });
    }


    save() {
        this.pend = true;
        this.user.phone += '';
        this.post$ = this.httpService.postWithToast('profiles/main', {User: this.user}).subscribe(d => {
            this.pend = false;
            // обновляю фио в хранищах
            this.localStorage.setAuth({
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                middle_name: this.user.middle_name
            });
        }, e => this.pend = false);
    }

    restorePassword() {
        this.pend = true;
        this.httpService.preRestorePassword(this.user.email).subscribe(d=> {


            },e=> {}
            ,()=> this.pend = false)
    }

}
