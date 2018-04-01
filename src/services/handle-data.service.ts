import {Injectable} from "@angular/core";
import {HandleDataClass} from "./handle-data.class";
/**
 * Created by ozknemoy on 04.04.2017.
 */
@Injectable()
export class HandleData extends HandleDataClass {

    /*
     * Can't resolve all parameters for SharedService: (?)  означает круговое di
     * constructor(public localStorage :LocalStorage) {
     * super(LocalStorage);
     * }
     */
    constructor() {
        super();
    }

}