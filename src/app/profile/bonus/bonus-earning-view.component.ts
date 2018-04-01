/**
 * Created by ozknemoy on 13.04.2017.
 */
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpService } from '../../../modules/transfer-http/transfer-http';
import {HandleData} from "../../../services/handle-data.service";


@Component({
    selector: 'bonus-earning-view',
    templateUrl: './bonus-earning-view.html'
})
export class BonusEarningView implements OnInit {


    table:Array<any>;
    data={
        items:{
            0:{status:{},reward:0},1:{},2:{},3:{},4:{},5:{},
        }
    };
    needRefs:number;// нужно рефералов на первом уровне
    rest:number;// осталось дней до конца месяца
    tableOneAllSum:number;// всего по первой таблиц
    tableOneAvailableSum:number;// всего доступно по первой таблице
    returnedMoney:number;
    returnedMoneyAvailable:number;
    constructor(public httpService: HttpService,public handleData: HandleData) {

        this.rest = handleData.daysBeforeEndMonth();
        
    }

    ngOnInit() {

    }

    // запускается из компонента фильтра
    filterCallback(obj) {
        this.needRefs=0;
        //this.rest=0;
        this.tableOneAllSum=0;
        this.tableOneAvailableSum=0;
        this.returnedMoneyAvailable = 0;//доступная возвратная скидка
        this.httpService.get('bonuses/earnings' + obj.queryUrl).subscribe(d=> {
            this.data = d;
            var t = this.data.items;
            this.table = [t['1'],t['2'],t['3'],t['4'],t['5']];
            this.table.forEach((row:{reward:number,status:number}, i)=> {
                this.tableOneAllSum += row.reward;
                this.needRefs += row.status;
            });
            // доступно только если сам юзер активен +
            // уровень доступен если все уровни до него доступны
            this.returnedMoney = d.items['0'].reward;//возвратная скидка
            if(d.items['0'].status.id !== 0) {
                // скидка доступна только если юзер активен
                this.returnedMoneyAvailable = this.returnedMoney;
                for (let i = 0; i < this.table.length; i++) {
                    // тут статус это количество требуемых рефералов на уровне
                    // если ноль то не требуется и уровень доступен
                    if(this.table[i].status > 0) break;
                    this.tableOneAvailableSum += this.table[i].reward
                }
            }

            //this.tableOneAllSum += t['0'].reward;
            //this.availableSum =  this.tableOneAvailableSum;



        });
    }
}