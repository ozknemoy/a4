
/**
 * Created by ozknemoy on 20.02.2017.
 * скрол по клику до элемента с помощью querySelector() или число в пикселях
 */

import {Directive,ElementRef,Inject,Input} from "@angular/core";


@Directive({
    selector: '[scrollTo]',
    host: {
        '(click)': 'click()'
    }
})
export class ScrollDirective {
    @Input() scrollTo:string|number;
    constructor( @Inject('scrollTo') private scrollToF) {}
    click() {
        var num = parseInt(<any>this.scrollTo);
        this.scrollToF(num==this.scrollTo? num : this.scrollTo)
    }
}