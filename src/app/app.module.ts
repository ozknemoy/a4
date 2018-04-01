import { NgModule,ViewContainerRef,ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component'
import {DirectiveModule} from "../modules/directive.modules"
import {vendorModules} from '../modules/vendor.modules'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'
import {ToastsManager} from "../../node_modules/ng2-toastr/src/toast-manager"
import {ToastOptions} from "ng2-toastr/src/toast-options"
import {PrioritiToastOption} from "../config/toast"
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module'

// providers
import { Modal } from 'angular2-modal/plugins/bootstrap';

// configs
import {isBrowser} from '../config/is-browser'
import {dateOptions} from '../config/date-options'
import {PipeModule} from '../pipes/index'
import {DOMEN} from '../config/base_url'

//services
import {HandleData} from "../services/handle-data.service"
import {scrollToFactory} from "../services/scroll-to.factory"
import {AuthGuard} from "../services/auth-guard.service"
import {SharedService} from "../services/shared.service";
import {UAService} from "../services/user-agent.service";

// вьюшки
import {HomeView} from "./home/home-view.component"
import {ProfileView} from "./profile/parent-view.component"
import {ProfileBonusView} from "./profile/bonus/parent-view.component"
import {BonusMainView} from "./profile/bonus/bonus-main-view.component"
import {BonusRefsView} from "./profile/bonus/bonus-refs-view.component"
import {BonusEarningView} from "./profile/bonus/bonus-earning-view.component"
import {ProfileMainView} from "./profile/main/parent-view.component"
import {ProfileMainBankView} from "./profile/main/main-bank-view"
import {ProfileMainPassportView} from "./profile/main/main-passport-view"
import {ProfileMainCommonView} from "./profile/main/main-common-view"
import {ProfilePrefView} from "./profile/profile-pref-view.component"
import {MainAccountView} from "./profile/main/main-account-view.component"
import {ProfileSuppliersView} from "./profile/profile-suppliers-view.component"
import {GroupMessagesView} from "./profile/messages/group/group-view.component"
import {RegistrationView} from "./registration/registration-view"
import {RestorePasswordView} from "./restore-password/restore-password-view"
import {MessageOneView} from "./profile/messages/one/message-one-view.component";
import {JqService} from "../services/jq-handler.service";
import {CanDeactivateGuard} from "../services/can-deactivate-guard.service";
import {ProfileBizView} from "./profile/biz/parent-view.component";
import {BizDocsView} from "./profile/biz/biz-docs-view.component";
import {BizActionsView} from "./profile/biz/biz-actions-view.component";
import {BizEduView} from "./profile/biz/biz-edu-view.component";



const ROUTE_COMPONENTS = [
    ProfileView,ProfileSuppliersView,
    ProfileMainView,ProfileMainCommonView,ProfileMainPassportView,
    ProfileBonusView,BonusMainView,BonusRefsView,BonusEarningView,ProfileMainBankView,
    MainAccountView,GroupMessagesView,MessageOneView,ProfilePrefView,
    HomeView,RegistrationView,RestorePasswordView,ProfileBizView,
    BizDocsView,BizActionsView,BizEduView

];
export const ROUTES = [// не убирать маршруты из этого файла изза lazy view
    {path: '', component: HomeView, pathMatch: 'full'},
    {
        path: 'profile', component: ProfileView, canActivate: [AuthGuard],
        children: [
            {path: 'suppliers', component: ProfileSuppliersView},
            {path: 'main', component: ProfileMainView,children: [
                {path: 'common', component: ProfileMainCommonView},
                {path: 'passport', component: ProfileMainPassportView},
                //{path: 'bank', component: ProfileMainBankView}, перенесен в паспорт
                {path: 'account', component: MainAccountView},
            ]},
            {path: 'bonus', component: ProfileBonusView, children: [
                    {path: 'main', component: BonusMainView},
                    {path: 'refs', component: BonusRefsView},
                    {path: 'earning', component: BonusEarningView}
            ]},
            {path: 'pref', component: ProfilePrefView},
            {path: 'biz', component: ProfileBizView, children: [
                {path: 'docs', component: BizDocsView},
                {path: 'actions', component: BizActionsView},
                {path: 'education', component: BizEduView}
            ]},
        ]
    },
    {path: 'messages', component: GroupMessagesView, canActivate: [AuthGuard],
        children: [
            {path: ':id', component: MessageOneView, canDeactivate: [CanDeactivateGuard]}
    ]},
    {path: 'registration', component: RegistrationView},
    {path: 'restorePassword', component: RestorePasswordView},
    {path: 'lazy', loadChildren: './+lazy/lazy.module#LazyModule'}
];

@NgModule({
    imports: [
        HttpModule,
        TransferHttpModule,
        DirectiveModule,
        NoopAnimationsModule,
        vendorModules,
        PipeModule,
        RouterModule.forRoot(ROUTES)
    ],
    declarations: [
        AppComponent, ROUTE_COMPONENTS
    ],
    exports: [AppComponent,],
    providers: [
        {provide: ToastOptions, useClass: PrioritiToastOption},
        HandleData, AuthGuard,Modal,SharedService,JqService,CanDeactivateGuard,
        UAService,
        {provide: 'DOMEN', useValue: DOMEN},
        {provide: 'scrollTo',useFactory: scrollToFactory},
        {provide: 'dateOptions', useValue: dateOptions},
        {provide: 'isBrowser', useValue: isBrowser},//useFactory не работает!!!???
    ]
})
export class AppModule {

}

/*
 <a [routerLink]="['item', '5']">item 5</a>
 this.router.navigate(['/item', { id: 5 }]); или this.router.navigateByUrl('main')
 синтаксисы [routerLink]="['item', '5'] и routerLink="/item/5" функционально равнозначны, но
 первый привязывается к набору параметров маршрута, второй - к строковому представлению маршрута.
 router: Router  для переходов
 route: ActivatedRoute для получения параметров

 this.sub = this.route.params.subscribe(params => {

 activateRoute.params.subscribe(params=>this.id=params['id']);
 activateRoute.snapshot.params['id'];
 // для queryParams   ?session_id=12
 <a [routerLink]="['product-list']" [queryParams]="{ page: 99 }">Go to Page 99</a>
 this.router.navigate(['/product-list'], { queryParams: { page: pageNum } });

 this.sessionId = this.route
 .queryParams
 .map(params => params['session_id'] || null);

 // Capture the fragment if available
 this.token = this.route
 .fragment
 .map(fragment => fragment || 'None');

 <a [routerLink]="['route-one']">Route One</a> none	Current component children routes
 <a [routerLink]="['../route-two']">Route Two</a> ../	Current component parent routes
 <a [routerLink]="['/route-three']">Route Three</a> /	Root of the application

 */