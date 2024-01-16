import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {CalcBalance} from "../services/calc-balance";
import {CategoriesResponseType} from "../types/categories-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class CreateCategory {
    readonly typeCategory: string;
    readonly nameInput: HTMLInputElement | null = null;
    readonly createBtn: HTMLElement | null = null;

    constructor(type: string) {

        this.typeCategory = type;

        this.nameInput = document.getElementById('name-input') as HTMLInputElement;
        this.createBtn = document.getElementById('create-btn');
        this.init();

        if (this.createBtn) {
            this.createBtn.onclick = () => {
                return this.createCategory()
            };
        }

        const cancelBtnElement: HTMLElement | null = document.getElementById('cancel-btn');
        if (cancelBtnElement) {
            cancelBtnElement.onclick = (): void => {
                if (this.typeCategory === 'income') {
                    location.href = '#/incoming';
                } else {
                    location.href = '#/expenses';
                }
            }
        }
    }

    private async init(): Promise<void> {
        await CalcBalance.getBalance();
    }

    private async createCategory(): Promise<void> {
        if (!this.nameInput) return;
        const result: CategoriesResponseType | DefaultResponseType = await CustomHttp.request(config.host + 'categories/' + this.typeCategory, 'POST', {
            title: this.nameInput.value,
        });

        if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            location.href = this.typeCategory === 'expense' ? '#/expenses' : '#/incoming';
        }
    }
}