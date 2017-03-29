import { Component, OnInit, Inject } from '@angular/core';
import { httpService } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
/**/
@Component({
    selector: 'home-view',
    template: `

    <div *ngIf="qs && isBrowser; else notQS">
    <table>
        <tr>
            <th>но</th>
            <th>автор</th>
            <th>заголовок</th>
            <th>дата создания</th>
            <th>с ответом</th>
        </tr>
        <tr *ngFor="let q of qs;let i = index"
            routerLink="question/{{q.question_id}}"
            class="link">
            <td>{{i}}</td>
            <td [innerHTML]="q.owner.display_name"></td>
            <td [innerHTML]="q.title"></td>
            <td>{{1000*q.creation_date | date:'dd-MM-yyyy'}}</td>
            <td>{{q.is_answered ? 'да':'нет'}}</td>
        </tr>
	</table>
	<span
	        infinite-scroll
		    [infiniteScrollDistance]="1.5"
		    [infiniteScrollThrottle]="300"
		    (scrolled)="load()">
	</span>
    </div>

	<ng-template #notQS>Загрузка...</ng-template>

	`,
    styles: [
        `
        table{width:100%}
        .link{
            cursor: pointer;

        }
        .link:hover{
            background-color: grey;

        }
        `
    ]
})
export class HomeView implements OnInit {

    pageNum = 1;
    qs;
    isBrowser: boolean;
    constructor(private httpService:httpService,@Inject('isBrowser') public _isBrowser) {
        this.isBrowser = _isBrowser();
    }

    ngOnInit() {
        if(this.isBrowser) {
            this.httpService._get(`2.2/questions?page=${this.pageNum}&pagesize=50&order=desc&sort=activity&site=stackoverflow`)
                .subscribe(d => {
                    this.qs = d.items
                });
        }
    }

    load() {
        this.pageNum++;
        this.httpService._get(`2.2/questions?page=${this.pageNum}&pagesize=50&order=desc&sort=activity&site=stackoverflow`)
            .subscribe(d => {
                this.qs = this.qs.concat(d.items)
            });
    }

}
