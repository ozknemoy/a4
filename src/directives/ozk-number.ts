/**
 * Created by ozknemoy on 11.03.2017.
 */
import {Directive,EventEmitter,ElementRef,Renderer,Inject } from "@angular/core";
import {Input,Output} from "@angular/core";
import {AutoUnsubscribe} from "../services/@AutoUnsubscribe.decorator";

import { Observable  } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

@Directive({
    selector: '[ozkNumber][ngModel]'
})
@AutoUnsubscribe()
export class OzkNumberDirective {
    @Output()ngModelChange = new EventEmitter();
    @Input()float;
    input$;

    constructor(@Inject('isBrowser') public isBrowser,public _renderer: Renderer, public _el: ElementRef) {}

    ngOnInit() {
        if(this.isBrowser) {
            this.input$ = Observable
                .fromEvent(this._el.nativeElement, 'input')
                .debounceTime(500)
                .subscribe(event=>  this._check(event))
        }

    }

    private _check(event) {
        const attrs = this._el.nativeElement;
        var val = event.target.value;
        let newV;
        if (this.float=='float') {
            newV = val.replace(/[^0-9.,]+/g, '');
            newV = newV.replace(',', '.');
            //если точка последняя в строке то отключаю parseFloat чтобы не убирать её
            //if a dot is last, then turn off parseFloat for save it
            if (newV.indexOf('.') !== newV.length - 1) {
                const n = parseFloat(newV);
                newV = !isNaN(n)? '' + n : '';
            }
        } else {
            newV = val.replace( /[^0-9]+/g, '');
        }

        // проверка значений min max
        if(attrs.min)newV = (+newV<+attrs.min)?attrs.min:newV;
        if(attrs.max)newV = (+newV>+attrs.max)?attrs.max:newV;
        
        if (val !== newV) {
            this._renderer.setElementProperty(this._el.nativeElement, 'value', newV);
            this.ngModelChange.emit(newV)
        }
    }

    /*@HostListener('input',['$event'])
    check(event) {
        setTimeout(()=> {
            //console.log('keypress',this._el.nativeElement.max,this.float);
            this._check(event)
        },500)
        
    }*/
    /*ngOnDestroy() {
        this.input$.unsubscribe();
    }*/

}