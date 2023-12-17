import {CheckAccess} from "../utils/check-access";

export class EditExpenses {
    constructor() {
        CheckAccess.check();
    }
}