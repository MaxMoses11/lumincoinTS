import {CheckAccess} from "../utils/check-access";

export class IncomingExpenses {
    constructor() {
        CheckAccess.check();
    }
}