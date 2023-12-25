import {CustomHttp} from "./custom-http.js";
import {config} from "../config/config.js";

export class Filter {
    static async getOperations(period = null, dateFrom = null, dateTo = null) {

        let result;

        if (!period && !dateFrom && !dateTo) {
            result = await CustomHttp.request(config.host + 'operations');
        } else if (period && !dateFrom && !dateTo) {
            result = await CustomHttp.request(config.host + 'operations?period=' + period);
        } else if (period && dateFrom && dateTo) {
            result = await CustomHttp.request(config.host + 'operations?period=' + period + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo);
        }

        if (result && !result.error) {
            return result;
        }
    }

    static activeBtnManager(filterBtnElem) {
        for (let i = 0; i < filterBtnElem.children.length; i++) {
            filterBtnElem.children[i].classList.remove('active');
        }
    }
}