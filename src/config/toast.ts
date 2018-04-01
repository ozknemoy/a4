/**
 * Created by ozknemoy on 12.04.2017.
 */
import {ToastOptions} from 'ng2-toastr';
export class PrioritiToastOption extends ToastOptions {

    animate = 'flyRight';
    newestOnTop = false;
    positionClass = 'toast-top-full-width';
    showCloseButton = true;
}