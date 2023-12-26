import {CheckAccess} from "../utils/check-access";

export class CreateExpenses {
    constructor() {
        CheckAccess.check();
    }
}