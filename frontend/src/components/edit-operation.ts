import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {CalcBalance} from "../services/calc-balance";
import {QueryParamsType} from "../types/query-params.type";
import {CategoriesResponseType} from "../types/categories-response.type";
import {OperationResponseType} from "../types/operation-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryOperations} from "../services/category-operations";

export class EditOperation {
    private operation: OperationResponseType | undefined;
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
                        CategoryOperations.fillCategorySelect((this.categories as CategoriesResponseType[]), this.categoryElem);
                    }
                }
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
        this.operation = await this.getOperation();
        if (!this.operation) return;
        if (this.typeElem) {
            for (let i = 0; i < this.typeElem.children.length; i++) {
                if ((this.typeElem.children[i] as HTMLInputElement).value === this.operation.type) {
                    this.typeElem.children[i].setAttribute('selected', 'selected');
                }
            }
        }

        if (this.amountElem && this.dateElem && this.commentElem) {
            this.amountElem.value = this.operation.amount.toString();
            this.dateElem.value = this.operation.date;
            this.commentElem.value = this.operation.comment;
        }

        this.categories = await CategoryOperations.getCategories(this.operation.type);
        if (this.categoryElem) {
            CategoryOperations.fillCategorySelect((this.categories as CategoriesResponseType[]), this.categoryElem);
        }

        const saveBtnElement: HTMLElement | null = document.getElementById('save-btn');
        if (saveBtnElement) {
            saveBtnElement.onclick = () => {
                return this.editOperation();
            }
        }
    }

    private async getOperation(): Promise<OperationResponseType | undefined> {
        const result: DefaultResponseType | OperationResponseType = await CustomHttp.request(config.host + 'operations/' + this.routeParams.operationId);

        if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            return result as OperationResponseType;
        }
    }

    private async editOperation(): Promise<void> {
        if (CategoryOperations.validForm()) {
            if (this.typeElem && this.amountElem && this.dateElem && this.commentElem && this.categoryElem) {
                const result: DefaultResponseType | OperationResponseType = await CustomHttp.request(config.host + 'operations/' + this.routeParams.operationId, 'PUT', {
                    type: this.typeElem.value,
                    amount: this.amountElem.value,
                    date: this.dateElem.value,
                    comment: this.commentElem.value,
                    category_id: Number(this.categoryElem.value),
                });

                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    location.href = '#/operations'
                }
            }
        }
    }
}