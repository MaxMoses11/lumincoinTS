import {CheckAccess} from "../utils/check-access";
import {RemoveActive} from "../utils/remove-active";

export class Operations {
    constructor() {
        CheckAccess.check();

        RemoveActive.remove();
        document.getElementById('operations').classList.add('active');
    }
}