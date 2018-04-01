/**
 * Created by ozknemoy on 13.04.2017.
 */
import { Component,Inject } from '@angular/core';
import { HttpService } from '../../../modules/transfer-http/transfer-http';
import {HandleData} from "../../../services/handle-data.service";

/*     мои бонусы    */
@Component({
    selector: 'bonus-main-view',
    templateUrl: './bonus-main-view.html'
})
export class BonusMainView {
    public temp = <any>{};
    public data = <any>{status:{}};
    public statuses: Array<any>;
    public currentPage = 1;
    public rest=0;// осталось дней до конца месяца
    constructor(public httpService: HttpService,public handleData: HandleData) {

        this.rest = handleData.daysBeforeEndMonth();
        this.statuses = handleData.statuses
    }

    ngOnInit() {
        /*this.table = [
            {date:'14.04.2017',name:'Ананас 13 шт.',name_store:'Чистинский продукт',price:260},
            {date:'01.04.2017',name:'Ананас 1 шт.',name_store:'Чистинский продукт',price:1260},
            {date:'01.03.2017',name:'Ананас 4 шт.',name_store:'Чистинский продукт',price:2600},
            {date:'01.02.2017',name:'Ананас 7 шт.',name_store:'Чистинский продукт',price:2660},
            {date:'31.01.2017',name:'Ананас 1 шт.',name_store:'Чистинский продукт',price:4260},
            {date:'25.01.2017',name:'Ананас 1 шт.',name_store:'Чистинский продукт',price:60},
            {date:'21.01.2017',name:'Ананас 1 шт.',name_store:'Чистинский продукт',price:260},
            {date:'17.01.2017',name:'Ананас 1 шт.',name_store:'Чистинский продукт',price:26},
            {date:'14.01.2017',name:'Ананас 1 шт.',name_store:'Чистинский продукт',price:42},
            {date:'11.01.2017',name:'Ананас 1 шт.',name_store:'Чистинский продукт',price:942},
            {date:'01.01.2017',name:'Ананас 1 шт.',name_store:'Чистинский продукт',price:426}
        ]*/
    }

    filterCallback(obj) {
        this.temp.period = obj.period;
        /*this.temp.startDotted = obj.startDotted;
        this.temp.endDotted = obj.endDotted;*/
        this.httpService.get('bonuses/orders' + obj.queryUrl).subscribe(d=> {
            this.data = d
        });
    }

}