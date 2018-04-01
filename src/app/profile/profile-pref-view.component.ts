import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpService } from '../../modules/transfer-http/transfer-http';
//import { Observable } from 'rxjs/Observable';


@Component({
    selector: 'profile-pref-view',
    templateUrl: './profile-pref-view.html'
})
export class ProfilePrefView implements OnInit {



    constructor(public httpService: HttpService) {



    }

    ngOnInit() {

    }
}
