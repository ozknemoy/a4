import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeView } from './home/home-view.component';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';
import {BASE_URL} from '../config/base_url'
import {isBrowser} from '../config/is-browser'

import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import {LazyView} from "./+lazy/lazy.module";

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        TransferHttpModule,
        InfiniteScrollModule,
        RouterModule.forRoot([
            {path: '', component: HomeView, pathMatch: 'full'},
            {path: 'question/:id', component: LazyView}
        ],{
            useHash: false
        })
    ],
    declarations: [
        AppComponent, HomeView,LazyView
    ],
    exports: [AppComponent],
    providers: [

        {provide: 'BASE_URL', useValue: BASE_URL},
        {provide: 'isBrowser', useValue: isBrowser},//useFactory не работает!!!???
    ]
})
export class AppModule {
}
