import { NgModule } from '@angular/core';
//import { Http, HttpModule } from '@angular/http';
import { HttpService} from './transfer-http';

@NgModule({
  providers: [
      HttpService
  ]
})
export class TransferHttpModule {}
