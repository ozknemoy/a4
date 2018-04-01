/**
 * Created by ozknemoy on 13.04.2017.
 */
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpService } from '../../../modules/transfer-http/transfer-http';
import {AutoUnsubscribe} from "../../../services/@AutoUnsubscribe.decorator";
import {HandleData} from "../../../services/handle-data.service";

/*interface IUser {


 my_bonus: number,// личный оборот
 }*/

interface IRefsTree/* extends IUser*/ {
    email: string,
    first_name: string,
    id: string,//ID пользователя
    last_name: string,
    middle_name: string,
    my_bonus:number,
    nl:number,
    parent_id:string,
    phone:number,
    ref_bonus: number,// го
    ref_number: string,
    status:string,
    active_on_1: number,//Активных в 1 уровне

    _name:string,
    _index:number,
    _status: number
}

interface IRefs /*extends IUser */ {
    first_name: string,
    id: string,//ID пользователя
    last_name: string,
    middle_name: string,
    my_bonus: number,
    ref_phone: number,
    ref_bonus: number,
    ref_email: string,
    parent: string,
    parent_email: string,
    parent_phone: number,
    status: {
        id: number,
        name: string
    }
}
// рефы начиная начиная со второго уровня
interface IRefsSecond {
    count: number,
    action: number,
    bonus: number
}

@Component({
    selector: 'bonus-refs-view',
    templateUrl: './bonus-refs-view.html'
})
@AutoUnsubscribe()
export class BonusRefsView implements OnInit {
    public tableOneSum = 0;
    public tableTwoSum = 0;
    public table = <any>[];
    public tableTwoSums = <any>{};
    public currentPage = 1;
    public currentPage2 = 1;
    public temp = <any>{};
    public tableOne = [<any>{}];
    public tableTwo = [<any>{}];
    public refsTree:IRefsTree[];
    public filter = {};
    public userGoodsTurnover: number;
    public filterTwo = {};
    public levels = [{id: '', name: 'Все'}, {id: 1, name: 1}, {id: 2, name: 2}, {id: 3, name: 3}, {
        id: 4,
        name: 4
    }, {id: 5, name: 5}];
    refs$$;
    refsTree$$;

    constructor(public httpService:HttpService, public handleData:HandleData) {
    }

    ngOnInit() {


    }

    filterCallback(obj) {
        var isNotTodayMonth = !this.handleData.isTodayMonth(obj.monthNum);
        this.refsTree$$ = this.httpService.getCacheWithCond(
            isNotTodayMonth, 'bonuses/referal-tree' + obj.queryUrl
        ).subscribe((d:IRefsTree[])=> {
            this.refsTree = d.map((row:IRefsTree, i) => {
                row._name = row.last_name + ' ' + row.first_name + ' ' + row.middle_name;
                row._index = i + 1;
                row._status = this.handleData.statusesReverse[row.status];
                return row
            });
        });
        this.refs$$ = this.httpService.getCacheWithCond(
            isNotTodayMonth,'bonuses/group-oborot' + obj.queryUrl).subscribe((d:number)=> {
            this.userGoodsTurnover = d
        });
        /*this.refs$$ = this.httpService.get('bonuses/referals' + obj.queryUrl)
            .subscribe((d:{'1':IRefs[]})=> {
                this.table = d;
                this.tableOneSum = 0;
                this.tableTwoSum = 0;
                this.table['1'].forEach((tableOne:IRefs)=> {
                    this.tableOneSum += tableOne.my_bonus
                });
                this.tableOne = this.table['1'];
                this.tableTwo = [this.table['2'], this.table['3'], this.table['4'], this.table['5']];
                this.tableTwo.forEach((row:IRefsSecond) => {
                    this.tableTwoSum += row.bonus;
                });
            });*/


    }


}