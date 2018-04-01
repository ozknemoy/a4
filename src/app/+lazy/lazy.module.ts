import {NgModule, Component} from '@angular/core'
import {RouterModule} from '@angular/router'


@Component({
	selector: 'lazy-view',
	template: `<h3>i'm lazy: /{{lazy}}/</h3>`
})
export class LazyView {
    lazy = 'lazylazylazylazylazylazylazylazylazylazylazy';
    constructor() {

    }

    ngOnInit() {

    }
}

@NgModule({
	declarations: [LazyView],
	imports: [
		RouterModule.forChild(<any>[
			{ path: '', component: LazyView, pathMatch: 'full'}
		])
	]
})
export class LazyModule {

}
