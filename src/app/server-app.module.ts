import { NgModule,Inject } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ServerTransferStateModule } from '../modules/transfer-state/server-transfer-state.module';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { TransferState } from '../modules/transfer-state/transfer-state';
import { BrowserModule } from '@angular/platform-browser';

import {LocalStorage} from "../services/localStorage.service";
import {DirectiveModule} from "../modules/directive.modules";
import {BASE_URL} from '../config/base_url'

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({appId: 'prioritiId'}),
        ServerModule,
        ServerTransferStateModule,
        AppModule,

    ],
    providers: [
        LocalStorage,
        {provide: 'isBrowser', useValue: false},
        {provide: 'BASE_URL', useValue: BASE_URL},// меняю
    ]
})
export class ServerAppModule {

    constructor(private transferState:TransferState,
                public localStorage:LocalStorage,
                @Inject('REQUEST') req) {

        // пишу в localstorage поля из куки
        localStorage.setCookiesToLS(req.headers.cookie)

    }

    //вызывается из шаблонизатора
    ngOnBootstrap = () => {
        this.transferState.inject();
    }
}
