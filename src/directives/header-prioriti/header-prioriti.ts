/**
 * Created by ozknemoy on 24.04.2017.
 */

import {Component,ChangeDetectorRef,Inject} from "@angular/core";
import {LocalStorage} from "../../services/localStorage.service";
import {ToastsManager} from "ng2-toastr";
import { Observable } from 'rxjs/Observable';
import {HttpService} from "../../modules/transfer-http/transfer-http";
import {AutoUnsubscribe} from "../../services/@AutoUnsubscribe.decorator";
import {SharedService} from "../../services/shared.service";

@Component({
    selector: 'header-prioriti',
    templateUrl: './header-prioriti.html'
})
@AutoUnsubscribe()
export class HeaderPrioriti {

    private countMessages$;
    private countMessages:number;
    public auth = <any>{};
    constructor(public localStorage: LocalStorage,
                public httpService:HttpService,
                @Inject('isBrowser') public isBrowser,
                private sharedService: SharedService,
                private toast:ToastsManager) {
        this.auth = localStorage.auth
    }

    ngOnInit() {
        // за счет того что при логине бросает в профиль то навбар
        // инициализируется по новой и можно тут ничего не городить
        // тоже самое и при разлогине но только если чел не на главной
        /*if(this.isBrowser && this.httpService.isAuth()) {
            // нода виснет на интервалах поэтому только для браузера
            this.countMessages$ = Observable['timer'](2,60e3)
                .switchMap(() => this.httpService.getWithoutCache('messages/new'))
                //.takeUntil(this.componentDestroy())
                .subscribe((val:any) => this.countMessages = val.count)
        }*/
    }

    logout() {
        this.localStorage.clearAuth();
        this.toast.info('', 'Вы успешно вышли.', {
            showCloseButton: true,
            toastLife: 4e3
        });
        this.auth = this.localStorage.auth;
        this.sharedService.emit['isLogIn'](false);
    }

    ngOnDestroy() {
        if(this.countMessages$) this.countMessages$.unsubscribe()
    }

}