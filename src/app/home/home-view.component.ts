import { Component, OnInit, ViewChild, Inject,ViewContainerRef } from '@angular/core';
import { HttpService } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import {ReCaptchaComponent} from "angular2-recaptcha";
import {ToastsManager} from "ng2-toastr";
import {ActivatedRoute} from "@angular/router";
import {LoginModalComponent} from "../../modals/login-modal/login-modal";
import {LocalStorage} from "../../services/localStorage.service";
import {AutoUnsubscribe} from "../../services/@AutoUnsubscribe.decorator";
import {SharedService} from "../../services/shared.service";

//declare var WOW: any;


@Component({
    selector: 'home-view',
    templateUrl: './home-view.html'
})
@AutoUnsubscribe()
export class HomeView implements OnInit {


    public pending = false;
    public ref:string;
    public isAuth: boolean;
    public categories = [];
    categories$;isLogIn$;_isLogIn$;

    constructor(public httpService:HttpService,
                @Inject('isBrowser') public isBrowser,
                @Inject('DOMEN') public DOMEN,
                private sharedService: SharedService) {}

    ngOnInit() {
        if(this.isBrowser) {
            //this._isLogIn$ = this.sharedService.listener['isLogIn']/*.map(v => v)*/;
            //this._isLogIn$ = Observable.interval(1000)/*.map(interval => interval)*/;

            this.isLogIn$ = this.sharedService.listener['isLogIn']
                .subscribe((d:boolean)=>this.isAuth = d)
        } else {
            this.isAuth = this.httpService.isAuth();
        }

        this.categories$ = this.httpService.get('categories/main?id=2&size=6').subscribe(d=>
            this.categories = d.categories
        );
        /*const timer2$ = Observable.interval(2000)
            .takeUntil(this.componentDestroy())
            .subscribe(val => console.log(val))*/

    }

    ngAfterViewInit() {
        /*if(this.isBrowser) {
            if(!location.host.includes('localhost')) new WOW().init();
        }*/

    }



}
