import { NgModule,Inject } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ɵDomAdapter } from '@angular/platform-browser';
import { ServerTransferStateModule } from '../modules/transfer-state/server-transfer-state.module';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { TransferState } from '../modules/transfer-state/transfer-state';
import { BrowserModule } from '@angular/platform-browser';
import {LocalStorage} from "../services/localStorage.service";


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'my-app-id'
    }),
    ServerModule,
    ServerTransferStateModule,
    AppModule
  ],
    providers: [
        LocalStorage,
    ]
})
export class ServerAppModule {

  constructor(private transferState: TransferState,public localStorage: LocalStorage,
              @Inject('REQUEST') req
                             //public parse5DomAdapter: Parse5DomAdapter
  ) {

      // пишу в localstorage поля из куки
      // set token for nodeServer for GET
      localStorage.set('token', localStorage.getCookie('token', req.headers.cookie));
  }
  // Gotcha
  ngOnBootstrap = () => {
    //this.transferState.inject();
  }
}
