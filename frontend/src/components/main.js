import {Pie} from "../utils/pie.js";
import {Auth} from "../services/auth.js";
import {CheckAccess} from "../utils/check-access";
import {RemoveActive} from "../utils/remove-active";
import {CalcBalance} from "../services/calc-balance.js";

export class Main {
    constructor() {
        new Pie();


        RemoveActive.remove();
        document.getElementById('main').classList.add('active');

        this.init();
    }

    async init() {
        await CalcBalance.getBalance();
    }
}