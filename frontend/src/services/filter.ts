import {CustomHttp} from "./custom-http";
import {config} from "../../config/config";
import {OperationResponseType} from "../types/operation-response.type";

export class Filter {
    public static async getOperations(period: string | null = null, dateFrom: string | null = null, dateTo: string | null = null): Promise<OperationResponseType[] | undefined> {

        let result: OperationResponseType[] | undefined;

        if (!period && !dateFrom && !dateTo) {
            result = await CustomHttp.request(config.host + 'operations');
        } else if (period && !dateFrom && !dateTo) {
            result = await CustomHttp.request(config.host + 'operations?period=' + period);
        } else if (period && dateFrom && dateTo) {
            result = await CustomHttp.request(config.host + 'operations?period=' + period + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo);
        }

        if (result) {
            return result;
        }
    }

    public static activeBtnManager(filterBtnElem: HTMLElement | null): void {
        if (!filterBtnElem) return;
        for (let i = 0; i < filterBtnElem.children.length; i++) {
            filterBtnElem.children[i].classList.remove('active');
        }
    }
}