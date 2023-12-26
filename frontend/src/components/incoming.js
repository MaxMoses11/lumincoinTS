import {CheckAccess} from "../utils/check-access";

export class Incoming {
    constructor() {
        CheckAccess.check();
    }
}