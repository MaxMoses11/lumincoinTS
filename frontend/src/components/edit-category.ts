import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {UrlManager} from "../utils/url-manager";
import {CalcBalance} from "../services/calc-balance";
import {QueryParamsType} from "../types/query-params.type";
import {CategoriesResponseType} from "../types/categories-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class EditCategory {
    readonly typeCategory: string;
    readonly nameInput: HTMLInputElement | null = null;
    readonly editBtn: HTMLElement | null = null;
    readonly routeParams: QueryParamsType;

    constructor(type: string) {

        this.typeCategory = type;

        this.routeParams = UrlManager.getQueryParams();
        this.nameInput = document.getElementById('name-input') as HTMLInputElement;
        this.editBtn = document.getElementById('edit-btn');

        this.init();

        if (this.editBtn) {
            this.editBtn.onclick = (): Promise<void> => {
                return this.editCategory();
            }
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
        if (this.routeParams.categoryId) {
            const result: CategoriesResponseType | DefaultResponseType = await CustomHttp.request(config.host + 'categories/' + this.typeCategory + '/' + this.routeParams.categoryId);

            if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message);
                }
                if (this.nameInput) {
                    this.nameInput.value = (result as CategoriesResponseType).title;
                }
            }
        }
    }

    private async editCategory(): Promise<void> {
        if (!this.nameInput) return;
        const result: CategoriesResponseType | DefaultResponseType = await CustomHttp.request(config.host + 'categories/' + this.typeCategory + '/' + this.routeParams.categoryId, 'PUT', {
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