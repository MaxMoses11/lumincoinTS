import {CustomHttp} from "./custom-http";
import {config} from "../../config/config";
import {BalanceResponseType} from "../types/balance-response.type";

export class CalcBalance {
    public static balanceElement: HTMLElement | null = document.getElementById('balance');

    public static async getBalance(param?: number): Promise<BalanceResponseType | undefined> {
        const result = await CustomHttp.request(config.host + 'balance');
        if (result) {
            if (param) {
                return result.balance;
            }
            if (CalcBalance.balanceElement) {
                CalcBalance.balanceElement.innerText = result.balance;
            }
        } else {
            throw new Error(result.statusText);
        }
    }
}