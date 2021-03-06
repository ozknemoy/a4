/**
 * Created by ozknemoy on 01.05.2017.
 */

import {Component,ViewChild,Inject} from "@angular/core";
import { HttpService } from '../../modules/transfer-http/transfer-http';
import {ReCaptchaComponent} from "angular2-recaptcha";
import {ActivatedRoute} from "@angular/router";
import {LocalStorage} from "../../services/localStorage.service";
import {Router} from "@angular/router";
import {SharedService} from "../../services/shared.service";
import {AutoUnsubscribe} from "../../services/@AutoUnsubscribe.decorator";
import {UAService} from "../../services/user-agent.service";
import {Meta,Title} from "@angular/platform-browser";
import {TITLE} from '../../config/small.configs'

@Component({
    selector: 'registration-view',
    templateUrl: './registration-view.html'
})
@AutoUnsubscribe()
export class RegistrationView{
    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
    public siteKey = '6LcR7hoUAAAAANihMjw0Lrw-HW__OohS8wZNGDVh';
    public showCapcha = false;
    public secretKey:string;
    public refUserName:string;
    public hasReferal = false;
    public userAgreement = true;
    public refUser:any;
    public form = {
        last_name: '',
        first_name: '',
        refIn:  <string>null,
        email: <string>null,
        password:  <string>null,
        phone: '',
        //recaptcha: null
    };
    // дублеры мыла и пароля должны быть одинаковы при инициализации
    public secondPassword =  <string>null;
    public secondEmail =  <string>null;
    public pending = false;
    public regSuccess = false;
    public isAndroid = false;
    public ref:string;
    public login$$;public ref$$;
    constructor(public httpService:HttpService,
                private sharedService: SharedService,
                public router: Router,
                public route: ActivatedRoute,
                public localStorage: LocalStorage,
                public uAService: UAService,
                private metaService: Meta,
                private titleService: Title,
                @Inject('isBrowser') public isBrowser,
                @Inject('dateOptions') public dateOptions) {}

    ngOnInit() {
        //https://netbasal.com/exploring-the-new-meta-service-in-angular-version-4-b5ba2403d3e6
        this.metaService.addTags([
            { name: 'twitter:title', content: 'Регистрация на приорити' },
            { property: 'og:title', content: 'Регистрация на приорити' }
        ]);
        this.titleService.setTitle('Регистрация');
        if(this.isBrowser) {
            this.isAndroid = this.uAService.is().android;
        }
    }

    // пробросить  в контроллер ключ или так this.captcha.getResponse()
    handleCorrectCaptcha(e) {
        this.secretKey = e;
    }
    captchaExpired() {
        this.secretKey = null;
        this.captcha.reset();
    }

    ngAfterViewInit() {
        if(this.isBrowser) {
            var ref = this.route.snapshot.queryParams['ref'];
            this.form.refIn = ref || this.localStorage.get('ref');
            if(this.form.refIn) {
                this.ref$$ = this.httpService.getAuthless('profiles/getuserbyrefid?ref=' + this.form.refIn).subscribe(d => {
                    this.localStorage.set('ref',this.form.refIn);
                    this.refUser = d;
                    this.refUserName =
                        (d.last_name? d.last_name : '') + ' ' +
                        (d.first_name? d.first_name : '') + ' ' +
                        (d.middle_name? d.middle_name : '');

                    //если номер есть закрою доступ на редактировние и выведу информер
                    this.hasReferal = true;
                    }, err => {
                    this.form.refIn = null;
                    this.hasReferal = false;
                    }
                )
            }
        }
    }
    setCaptcha(e) {
        this.secretKey = e;
    }

    isEqualEmail(authForm):boolean {
        return  this.secondEmail && authForm.controls.email && authForm.controls.email.valid && this.secondEmail === this.form.email
    }

    isEqualPassword(authForm):boolean {
        return  this.secondPassword && authForm.controls.password && authForm.controls.password.valid && this.secondPassword === this.form.password
    }

    check(authForm) {
        console.log("authForm",authForm);
    }

    signup() {
        this.pending = true;
        this.form.email = <any>this.form.email.toLowerCase();
        this.httpService.postWithToast('users/registration',{
            "User": this.form
        }, 'Вы успешно зарегистрировались.',11e3).subscribe(d => {
            this.regSuccess = true;
            this.localStorage.removeItem('ref');
            // сразу же логин. не обрабатываю провал тк данные верные
            this.login$$ = this.httpService.login({email: this.form.email, password: this.form.password}).subscribe(d => {
                this.sharedService.emit['isLogIn'](true);
                this.router.navigate(['/profile/main/common']);
            });
            }, err => {
                this.pending = false;
                this.captchaExpired()
            }
        )
    }

    ngOnDestroy() {
        this.metaService.removeTag("name='og:title'");
        this.metaService.removeTag("name='twitter:title'");
        this.titleService.setTitle(TITLE);
    }
}