import { Component, Inject } from '@angular/core'
import { HttpService } from '../../../../modules/transfer-http/transfer-http'
import {HandleData} from "../../../../services/handle-data.service"
 /*import {LocalStorage} from "../../../services/localStorage.service"*/
import {AutoUnsubscribe} from "../../../../services/@AutoUnsubscribe.decorator";
import {SharedService} from "../../../../services/shared.service";
import { Observable } from 'rxjs/Observable';
import {JqService} from "../../../../services/jq-handler.service";

interface Message {id:number,user:string,message:string,status:string,date:any}

@Component({
    selector: 'group-messages-view',
    templateUrl: './group-view.html'
})
@AutoUnsubscribe()
export class GroupMessagesView {
    public groups = <any>[];
    public user = <any>{};
    public temp = <any>{};
    get$;message$;
    constructor(private sharedService: SharedService,
                public jqService: JqService,
                @Inject('isBrowser') public isBrowser,
                public httpService: HttpService,
                public handleData: HandleData) {


    }

    ngOnInit() {
        if(this.isBrowser) {
            var name = 'Message';
            this.sharedService.makeProxy(name);

            // подписываюсь на изменения из ребенка
            this.message$ = this.sharedService.listener[name]
                .subscribe((mObj:{groupId:number,message: string,created_at:string,status:string}) => {
                    // ищу нужный элемент
                    for (var i = 0; i < this.groups.length; i++) {
                        if(this.groups[i].id===mObj.groupId) {
                            var group = {
                                message: mObj.message,
                                date: mObj.created_at,
                                status: mObj.status,
                                id: mObj.groupId,
                                user: this.groups[i].user
                            };
                            this.groups.splice(i,1);
                            //надо поднять наверх
                            this.groups.splice(0,0,group);
                            console.log(mObj,this.groups);
                            break;
                        }
                    }
                });
            this.get$ = Observable['timer'](2,60e3)
                .switchMap(()=>this.httpService.getWithoutCache('messages/groups'))
                .subscribe((d:{groups:[Message]}) => {
                    // обратный сорт
                    this.groups = d.groups.sort((a,b)=>(a.date < b.date)?1:-1);
                    this.groups.forEach((group:Message)=>{
                        group.date = this.handleDate(group.date);
                    });
                    this.jQInit();
                });
        } /*else {
            this.httpService.get('messages/groups')
                .subscribe((d:{groups:[Message]}) => {
                    // обратный сорт
                    this.groups = d.groups.sort((a,b)=>(a.date<b.date)?1:-1)
                })
        }*/
    }

    handleDate(date) {
        return this.handleData.isToday(date)?
            this.handleData.getTime(date) : this.handleData.getDDMMMYYYY(date,false)
    }

    handleGroup() {
        this.jqService.addClassInMessages()
    }

    ngOnDestroy() {
        this.sharedService.killListener('Message');
        this.jqService.destroyMessagesState()
    }

    jQInit() {
        // плачу но делаю
        this.jqService.initMessagesState()
    }
}
