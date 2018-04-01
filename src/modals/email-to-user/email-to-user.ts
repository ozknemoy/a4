/**
 * Created by ozknemoy on 15.05.2017.
 */
import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {HttpService} from "../../modules/transfer-http/transfer-http";
import {AutoUnsubscribe} from "../../services/@AutoUnsubscribe.decorator";

@Component({
    selector: 'email-to-user-modal',
    templateUrl: './email-to-user.html'
})
@AutoUnsubscribe()
export class EmailToUserModal implements ModalComponent<BSModalContext> {
    user: any;
    text = '';
    private form = {
        message: '',
        email: ''
    };
    private emailList:any[];
    emailList$$;sendMessages$$;
    constructor(public dialog: DialogRef<any>, public httpService: HttpService) {}

    ngOnInit() {
        this.emailList$$ = this.httpService.get('messages/thema').subscribe(d=> {
            this.emailList = d
        })
    }

    send() {
        this.sendMessages$$ = this.httpService.postWithToast('messages/send',{
            message: this.form.message,
            email: this.form.email
        },'Сообщение успешно отправлено').subscribe(d=> {
            this.close();
        })

    }

    close() {
        this.dialog.close();
    }


    /*beforeDismiss(): boolean {
        return true;
    }

    beforeClose(): boolean {
        return true
    }*/
}
