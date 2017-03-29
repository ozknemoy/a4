import {NgModule, Component,OnInit} from '@angular/core'
import {RouterModule,ActivatedRoute} from '@angular/router'
import {httpService} from "../../modules/transfer-http/transfer-http";
import {Inject} from "@angular/core";


@Component({
	selector: 'lazy-view',
	template: `<h3>Вопрос</h3>

	<div *ngIf="q;else notQ">
	    <p>{{q.title}}</p>
	    <a href="{{q.link}}">{{q.link}}</a>
	</div>
	<ng-template #notQ>Загрузка...</ng-template>
	`
})
export class LazyView implements OnInit {
    q;
    id:string;

    constructor(private httpService:httpService,
                private route:ActivatedRoute,
                @Inject('isBrowser') public isBrowser) {
        console.log("LazyView");
        
    }

    ngOnInit() {
        console.log("LazyView");
        this.route.params.subscribe(params=> {
            this.id=params['id'];
            console.log(this.id);
            
            if(this.isBrowser()) {
                this.httpService._get(`2.2/questions/${this.id}?order=desc&sort=activity&site=stackoverflow`).subscribe(d => {
                    this.q = d.items[0];
                    console.log(d);

                });
            }
        });

    }
}
