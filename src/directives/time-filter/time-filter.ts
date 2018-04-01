/**
 * Created by ozknemoy on 26.04.2017.
 */
import {Component,Inject,Output,Input,EventEmitter,ViewChild} from "@angular/core";
import {HandleData} from "../../services/handle-data.service";
import {IMyOptions} from "mydatepicker/dist/interfaces/my-options.interface";

@Component({
    selector: 'time-filter',
    templateUrl: './time-filter.html',
})
export class TimeFilter {
    @Output() callback = new EventEmitter();
    private temp = <any>{};
    private period:string;
    private month:number;
    private year:number;
    private dateOptions: IMyOptions;
    private years = [];
    private months: string[];
    constructor(@Inject('dateOptions') private _dateOptions: IMyOptions,
                public handleData: HandleData) {
        this.dateOptions = Object.assign({},_dateOptions);
        this.dateOptions.showClearDateBtn = false;
        this.dateOptions.showInputField = false;
        this.dateOptions.disableUntil = handleData.transformDate('2017-01-01').date;
        this.dateOptions.disableSince = handleData.transformDate(new Date()).date;

    }

    ngOnInit() {
        this.months = this.handleData.months.slice(1);
        this.temp.start = this.handleData.transformDate(new Date());
        const now = new Date();
        this.month = now.getMonth() + 1;
        this.year = now.getFullYear();
        this.setDateRange();

        for (var i = 2017; i <= this.year; i++) {
            this.years.push(i)
        }
    }

    setDateRange() {
        /* реализация для дата пикера
        var year = this.temp.start.date.year;
        var month = this.temp.start.date.month;
        this.period = `${this.handleData.months[month]} ${year}`;
        var queryUrl = `?year=${year}&month=${month}`;
        this.callback.emit({
            queryUrl,
            period: this.period
        });*/
        this.period = `${this.handleData.months[this.month]} ${this.year}`;
        var queryUrl = `?year=${this.year}&month=${this.month}`;
        this.callback.emit({
            queryUrl,
            monthNum: this.month,
            period: this.period
        });
    }
}