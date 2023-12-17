import {CheckAccess} from "../utils/check-access";

export class Expenses {
    constructor() {
        CheckAccess.check();
    }
}