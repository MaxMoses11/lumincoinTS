import {Pie} from "../pie.js";
import {Auth} from "../services/auth.js";
import {CheckAccess} from "../utils/check-access";

export class Main {
    constructor() {
        new Pie();

        CheckAccess.check();
    }
}