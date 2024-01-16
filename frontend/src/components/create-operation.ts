import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {CalcBalance} from "../services/calc-balance";
import {CategoryOperations} from "../services/category-operations";
import {QueryParamsType} from "../types/query-params.type";
import {CategoriesResponseType} from "../types/categories-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class CreateOperation {
    private categories: CategoriesResponseType[] | undefined = [];

    private typeElem: HTMLInputElement | null = document.getElementById('type-select') as HTMLInputElement;
    private categoryElem: HTMLInputElement | null = document.getElementById('category-select') as HTMLInputElement;
    private amountElem: HTMLInputElement | null = document.getElementById('amount-input') as HTMLInputElement;
    private dateElem: HTMLInputElement | null = document.getElementById('date-input') as HTMLInputElement;
    private commentElem: HTMLInputElement | null = document.getElementById('comment-input') as HTMLInputElement;
    readonly routeParams: QueryParamsType;

    constructor() {

        this.routeParams = UrlManager.getQueryParams();

        this.init();

        if (this.typeElem) {
            this.typeElem.onchange = async (): Promise<void> => {
                if (this.categoryElem) {
                    this.categoryElem.innerHTML = '';
                    if (this.typeElem) {
                        this.categories = await CategoryOperations.getCategories(this.typeElem.value);
                    }
                    CategoryOperations.fillCategorySelect((this.categories as CategoriesResponseType[]), this.categoryElem);
                }
            }
        }

        const saveBtnElement: HTMLElement | null = document.getElementById('save-btn');
        if (saveBtnElement) {
            saveBtnElement.onclick = (): Promise<void> => {
                return this.getForm()
            }
        }

        const canselBtnElement: HTMLElement | null = document.getElementById('cancel-btn');
        if (canselBtnElement) {
            canselBtnElement.onclick = (): void => {
                location.href = '#/operations';
            }
        }
    }

    private async init(): Promise<void> {

        await CalcBalance.getBalance();
        if (this.typeElem) {
            for (let i = 0; i < this.typeElem.children.length; i++) {
                if ((this.typeElem.children[i] as HTMLInputElement).value === this.routeParams.operation) {
                    this.typeElem.children[i].setAttribute('selected', 'selected');
                }
            }
        }

        this.categories = await CategoryOperations.getCategories(this.routeParams.operation);
        if (this.categoryElem) {
            CategoryOperations.fillCategorySelect((this.categories as CategoriesResponseType[]), this.categoryElem);
        }
    }

    private async getForm(): Promise<void> {
        if (this.typeElem && this.amountElem && this.dateElem && this.commentElem && this.categoryElem) {
            if (CategoryOperations.validForm()) {
                const result: CategoriesResponseType | DefaultResponseType = await CustomHttp.request(config.host + 'operations', 'POST', {
                    type: this.typeElem.value,
                    amount: this.amountElem.value,
                    date: this.dateElem.value,
                    comment: this.commentElem.value,
                    category_id: Number(this.categoryElem.value)
                });

                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    location.href = '#/operations';
                }
            }
        }
    }

}