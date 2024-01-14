import {CustomHttp} from "./custom-http";
import {config} from "../../config/config";

export class CalcBalance {
    static balanceElement = document.getElementById('balance');

    static async getBalance(param) {
        const result = await CustomHttp.request(config.host + 'balance');
        if (result && !result.error) {
            if (param) {
                return result.balance;
            }
            CalcBalance.balanceElement.innerText = result.balance;
        } else {
            throw new Error(result.error);
        }
    }

    static async init() {

        await CalcBalance.getBalance();
        // let newBalance = null;
        //
        // const currentOperations = await CustomHttp.request(config.host + 'operations/?period=all');
        // if(currentOperations && !currentOperations.error) {
        //     currentOperations.forEach(item => {
        //         if (item.type === 'income') {
        //             newBalance += Number(item.amount);
        //         } else {
        //             newBalance -= Number(item.amount);
        //         }
        //     });
        //
        //     const result = await CustomHttp.request(config.host + 'balance', 'PUT', {
        //         newBalance: newBalance,
        //     });
        //
        //     if (result && !result.error) {
        //         // localStorage.setItem('balance', result.balance);
        //     } else {
        //         throw new Error(result.error);
        //     }
        // } else {
        //     throw new Error(currentOperations.error);
        // }
    }

    static async changeBalance(typeOperation, sum) {
        let currentBalance = await CalcBalance.getBalance(1);
        if (currentBalance) {
            if (typeOperation === 'income') {
                currentBalance += Number(sum);
            } else {
                currentBalance -= Number(sum);
            }

            const result = await CustomHttp.request(config.host + 'balance', 'PUT', {
                newBalance: currentBalance,
            });

            if (!result || result.error) {
                throw new Error(result.error);
            }
        }
    }
}