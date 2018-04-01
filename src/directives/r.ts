import {HostListener,Directive,Input} from "@angular/core";
import {ThousandPipe} from "../pipes/1000.pipe";


@Directive({
    selector: `[appConfirm]`
})
export class ConfirmDirective {
    @Input() appConfirm:string;

    @HostListener('click', ['$event'])
    confirmFirst(event: Event) {
        const confirmed = window.confirm(this.appConfirm || 'Are you sure you want to do this?');

        if(confirmed) {
            console.log("confirmed");
        }
        return false// ==preventDefault
    }
    
    text='reeeeeeeeet';
    
    constructor(public thousandPipe:ThousandPipe) {
        console.log(this.text);
        
    }
   
}