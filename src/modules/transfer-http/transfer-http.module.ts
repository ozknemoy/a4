import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { httpService} from './transfer-http';

@NgModule({
  providers: [
      httpService
  ]
})
export class TransferHttpModule {}
