/**
 * Created by ozknemoy on 26.04.2017.
 */

import {Component,Inject} from '@angular/core';
import {HttpService} from '../../../modules/transfer-http/transfer-http';
import {HandleData} from "../../../services/handle-data.service";
import {AutoUnsubscribe} from "../../../services/@AutoUnsubscribe.decorator";

interface ProfileDoc {
    "items": ProfileDocItem[],
    "types": {
        "0": "Паспорт",
        "10": "Водительское удостоверение"
    },
    "files": {
        "passport_two": ProfileDocFile,
        "passport_one": ProfileDocFile
    }
}

interface ProfileDocFile {
    url: string,
    status: boolean,
}

interface ProfileDocItem {
    id: number,
    type_id: number,
    type_name: string,
    number: string,
    who_issued: string,
    when_issued: string,
    unit_code: number,
    date_birth: string,
    place_registration: string,
    place_birth: string,
}

@Component({
    selector: 'main-passport-view',
    templateUrl: './main-passport-view.html',
})
@AutoUnsubscribe()
export class ProfileMainPassportView {

    private temp = <any>{
        noFile:'Файл не выбран...',
        hasFile:'Файл загружен',
        passport_one: {},passport_two: {},snils: {}};
    private pend = false;
    private documents$;
    private uPassport = <any>{};

    constructor(private httpService: HttpService,
                private handleData: HandleData,
                @Inject('dateOptions') private dateOptions) {


    }

    ngOnInit() {
        this.documents$ = this.httpService.get('profiles/document').subscribe((d:ProfileDoc) => {
            this.uPassport = d.items['0'] || {};// 0 для паспорта
            for(const fileType in d.files) {
                // перезаписываю дефолтные значения
                this.temp[fileType] = d.files[fileType]
            }
            this.initUser();
            this.pend = false;
        });
    }

    initUser() {
        this.temp.when_issued = this.handleData.transformDate(this.uPassport.when_issued);
        this.temp.date_birth = this.handleData.transformDate(this.uPassport.date_birth);

    }

    beforeSave() {
        this.uPassport.when_issued = this.handleData.transformDateReverse(this.temp.when_issued);
        this.uPassport.date_birth = this.handleData.transformDateReverse(this.temp.date_birth);

    }

    save() {
        this.pend = true;
        this.beforeSave();
        this.uPassport.type_id = 0;// 0 для паспорта
        this.httpService.postWithToast('profiles/document',{documents: [this.uPassport]}).subscribe(
            d => this.pend = false,
            e => this.pend = false);
    }
}
