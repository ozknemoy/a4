/**
 * Created by ozknemoy on 13.04.2017.
 */
import { Component, Inject } from '@angular/core';
import { HttpService } from '../../modules/transfer-http/transfer-http';
import {AutoUnsubscribe} from "../../services/@AutoUnsubscribe.decorator";

interface IShop {
    id:number,
    image: string,
    name: string,
    token: string,
    url: string,
}

@Component({
    selector: 'profile-suppliers-view',
    templateUrl: './profile-suppliers-view.html'
})
@AutoUnsubscribe()
export class ProfileSuppliersView {
    shops: IShop[];

    constructor(@Inject('DOMEN') public DOMEN,
                public httpService: HttpService) {}

    ngOnInit() {
        this.httpService.get('shops/external').subscribe((shops:IShop[])=>this.shops = shops)
    }

    checkBackend(shop:IShop) {
        this.httpService.get(`shops/link?id=${shop.id}`).subscribe(({url})=>{
            window.open(url, '_self')
        })


    }
}