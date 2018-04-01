/**
 * Created by ozknemoy on 05.05.2017.
 */
import {Component,Inject} from '@angular/core';
import {HttpService} from '../../modules/transfer-http/transfer-http';
import {AutoUnsubscribe} from "../../services/@AutoUnsubscribe.decorator";
import {ActivatedRoute} from "@angular/router";
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'restore-password-view',
    templateUrl: './restore-password-view.html',
})
@AutoUnsubscribe()
export class RestorePasswordView {
    private routeParams$;
    private token: string;
    private wrongToken = true;
    private password: string;
    private passwordTwo: string;
    private pend: boolean;
    private restorePassword$;
    constructor(public httpService: HttpService,
                public routeParams: ActivatedRoute,
                public toast:ToastsManager) {


    }

    ngOnInit() {
        this.routeParams$ = this.routeParams.queryParams.map(params=>params['token'])
            .subscribe(token=> {
                this.token=token;
                this.httpService.post('users/checkToken',{token:this.token})
                    .subscribe(d=> {
                        this.wrongToken = false
                    },e=> this.wrongToken = true)
            });
    }

    check() {
        if (this.password === this.passwordTwo) {
            this.pend = true;
            this.restorePassword$ = this.httpService.postWithToast('users/resetPassword',{
                token: this.token,
                password: this.password
            },'Пароль успешно обновлен').subscribe(d =>
                this.pend = false
            , err => this.pend = false)
        } else {
            this.toast.error('Пароли не совпадают!', 'Ошибка', {
                showCloseButton: true,
                toastLife: 20e3
            });
        }
    }
}