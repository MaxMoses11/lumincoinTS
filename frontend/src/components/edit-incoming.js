import {CheckAccess} from "../utils/check-access";

export class EditIncoming {
    constructor() {
        CheckAccess.check();
    }
}