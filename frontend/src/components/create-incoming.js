import {CheckAccess} from "../utils/check-access";

export class CreateIncoming {
    constructor() {
        CheckAccess.check();
    }
}