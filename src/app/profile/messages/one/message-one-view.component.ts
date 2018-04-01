import { Component, Inject } from '@angular/core'
import { HttpService } from '../../../../modules/transfer-http/transfer-http'
import {HandleData} from "../../../../services/handle-data.service"
import {LocalStorage} from "../../../../services/localStorage.service"
import {ActivatedRoute} from "@angular/router";
import {AutoUnsubscribe} from "../../../../services/@AutoUnsubscribe.decorator";
import {SharedService} from "../../../../services/shared.service";
import { Observable } from 'rxjs/Observable';
import {JqService} from "../../../../services/jq-handler.service";
declare var $: any;
interface Mes {created_at:string,user_id:number,my:boolean,message:string}

@Component({
    selector: 'messages-one-view',
    templateUrl: './message-one-view.html'
})
@AutoUnsubscribe()
export class MessageOneView {
    public messages = <any>[];
    public temp = <any>{};
    private groupId: number;
    private userId: number;
    private host: string;
    private _message = '';
    params$;send$;messages$;get$;_update$;
    constructor(public localStorage: LocalStorage,
                private sharedService: SharedService,
                public activatedRoute: ActivatedRoute,
                public httpService: HttpService,
                public jqService: JqService,
                @Inject('isBrowser') public isBrowser,
                public handleData: HandleData) {


    }

    ngOnInit() {
        // изза построения высоты блоков с помощью jq нет смысла запрашивать данные нодом
        if(this.isBrowser) {
            this.host = this.localStorage.auth.data.last_name + " " + this.localStorage.auth.data.first_name;
            this.params$ = this.activatedRoute.params.subscribe(params=> {
                this.groupId = +params['id'];
                this.getMessages();
            })
            //console.log("this.activatedRoute.snapshot",this.activatedRoute.snapshot);

        }

    }

    ngAfterViewInit() {

    }

    ngAfterViewChecked() {

    }

    getMessages() {
        this.messages$ = this.httpService.getWithoutCache('messages?group=' + this.groupId)
            .subscribe((d:{messages:[Mes],user_id:number}) => {
                d.messages.forEach((m:Mes)=> {
                    m.my = m.user_id !== d.user_id;
                    m.created_at = this.handleData.isToday(m.created_at)?
                        this.handleData.getTime(m.created_at) : this.handleData.getDDMMMYYYY(m.created_at,true)
                });
                this.messages = d.messages;
                if(this.isBrowser) {
                    this.jQInit();
                    this.scroll(400);
                }
                this.userId = d.user_id;
            });
        if(this.isBrowser) {
            // подписываюсь на новые сообщения
            this._update$ = Observable['interval'](60e3)
                .switchMapTo(this.httpService.getWithoutCache('messages/updateGroup?group=' + this.groupId))
                .subscribe((newMessages:{messages:[Mes]}) => {
                        this.scroll(400);
                    if(newMessages.messages.length) this.messages = this.messages.concat(newMessages.messages)
                })
        }
    }

    send() {
        // перед отправкой делаю запрос на новые сообщения
        this.get$ = this.httpService.getWithoutCache('messages/updateGroup?group=' + this.groupId).subscribe(d=> {

            // если есть новые сообщения
            if(d.messages.length) this.messages = this.messages.concat(d.messages);


            this.send$ = this.httpService.post('messages',{
                message: this._message,
                id: this.userId
            }).subscribe(d=> {
                var body:Mes = {
                    created_at: this.handleData.getTime(),
                    user_id: 0,// лиш бы не равно контрагенту
                    //user: this.host,
                    my: true,
                    message: this._message
                };
                // прокинуть сообщение и в чат и в groups
                this.messages = this.messages.concat(body);
                this.sharedService.emit['Message']({
                    groupId:this.groupId,
                    message: this._message,
                    created_at: body.created_at,
                    status: 0
                });
                this._message = '';
                this.scroll()
            });
        });

    }

    canDeactivate(): boolean {
        return this._message === ''? true : confirm('Текст сообщения будет потерян. Уйти со страницы?');
    }

    scroll(time=250) {
        if(this.isBrowser) {
            setTimeout(()=>{
                var block = document.getElementById("chat_scroll");
                if(block) block.scrollTop = block.scrollHeight;
            },time)
        }
    }

    jQInit() {
        // плачу но делаю
        this.jqService.initMessagesState();
        this.jqService.addClassInMessages()
    }

    deleteClass() {
        this.jqService.deleteClassInMessages()
    }

    ngOnDestroy() {
        // почему то не удаляется декоратором
        this._update$.unsubscribe()
    }
}
