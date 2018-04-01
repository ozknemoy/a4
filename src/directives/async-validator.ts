/**
 * Created by ozknemoy on 11.03.2017.
 * https://netbasal.com/angular-2-forms-create-async-validator-directive-dd3fd026cb45#.p9hmn35vg
 */
import { Directive, forwardRef } from "@angular/core";
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs";
@Directive({
    selector: "[asyncValidator][ngModel]",
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            //forwardRef Allows to refer to references which are not yet defined
            useExisting: forwardRef(() => AsyncValidator), multi: true
        }
    ]
})
export default class AsyncValidator  {//implements Validator

    //call this function every time you make a change in your form field
    validate( c : AbstractControl ) : Promise<{[key : string] : any}>|Observable<{[key : string] : any}> {


        return this.validateUniqueEmailPromise(c.value)
    }

    validateUniqueEmailPromise( email : string ) {
        //If the validation pass we need to return null and if not we need to
        // return an object with the error as the key.
        return new Promise(resolve => {
            setTimeout(() => {
                if( email === "alreadyExistsEmail@gmail.com" ) {
                    resolve({
                        asyncInvalid: true
                    })
                } else {
                    console.log('validate Promise');
                    resolve(null);
                }
            }, 800);
        })
    }
    validateUniqueEmailObservable( email : string ) {
        return new Observable(observer => {
            if( email === "alreadyExistsEmail@gmail.com" ) {
                observer.next({asyncInvalid: true});
            } else {
                console.log('validate Observable');
                observer.next(null);
            }
        });
    }
}