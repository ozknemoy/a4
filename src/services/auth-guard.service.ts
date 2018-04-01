/**
 * Created by ozknemoy on 14.01.2017.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import {HttpService} from "../modules/transfer-http/transfer-http";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(public router: Router, public $auth: HttpService) {}

    canActivate() {
        if (!this.$auth.isAuth()) {
            this.router.navigate(['']);
            return false
        }
        else {
            return true
        }
    }

}