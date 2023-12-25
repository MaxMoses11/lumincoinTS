import {Pie} from "../utils/pie.js";
import {Auth} from "../services/auth.js";
import {CheckAccess} from "../utils/check-access";
import {RemoveActive} from "../utils/remove-active";

export class Main {
    constructor() {
        new Pie();

        CheckAccess.check();

        RemoveActive.remove();
        document.getElementById('main').classList.add('active');
    }
}