import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { BrowserTransferStateModule } from '../modules/transfer-state/browser-transfer-state.module';
import {LocalStorage} from "../services/localStorage.service";
import {BASE_URL} from '../config/base_url'
import { enableProdMode } from '@angular/core';
import {MetrikaModule} from "ng-yandex-metrika";

enableProdMode();


@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({appId: 'prioritiId'}),
        BrowserTransferStateModule,
        AppModule,
        MetrikaModule.forRoot(
            {id:34580945, webvisor: false}, // CounterConfig | CounterConfig[]
            // Можно задать ид счетчика, либо порядковый номер в массиве, необязательный параметрб по умолчанию первый попавшийся.
            //defaultCounter, // number | string
        ),
    ],
    providers: [
        LocalStorage,
        {provide: 'isBrowser', useValue: true},
        {provide: 'BASE_URL', useValue: BASE_URL},
    ]
})
export class BrowserAppModule {}
