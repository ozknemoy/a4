import { Component, Inject } from '@angular/core'
import { HttpService } from '../../modules/transfer-http/transfer-http'
import {HandleData} from "../../services/handle-data.service"
import {LocalStorage} from "../../services/localStorage.service"


@Component({
    selector: 'profile-view',
    templateUrl: './parent-view.html'
})
export class ProfileView {
    // statuses 0 - Неактивен, 1 - Классик, 2 - Премиум, 3 - Элит
    public auth = <any>{};
    public user = <any>{};
    public temp = <any>{};
    constructor(public localStorage: LocalStorage,
                public httpService: HttpService,
                public handleData: HandleData,
                @Inject('DOMEN') public DOMEN,
                @Inject('dateOptions') public dateOptions) {

        this.auth = this.localStorage.auth

    }

    ngOnInit() {
        this.httpService.get('profiles').subscribe(d => {
            this.user = d;
            this.temp.ref = this.DOMEN + '/registration?ref=' + this.user.ref;
        });
    }

    copy(str) {
        this.handleData.copyToClipboard(str)
    }
}
