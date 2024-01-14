import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import {config} from "../config/config.js";
import {CalcBalance} from "../services/calc-balance.js";
import {CreateOperation} from "./create-operation.js";

export class EditOperation {
    operation = null;
    categories = null;
    typeElem = document.getElementById('type-select');
    categoryElem = document.getElementById('category-select');
    amountElem = document.getElementById('amount-input');
    dateElem = document.getElementById('date-input');
    commentElem = document.getElementById('comment-input');

    constructor() {

        this.routeParams = UrlManager.getQueryParams();

        this.init();

        this.typeElem.onchange = async () => {
            this.categoryElem.innerHTML = '';
            this.categories = await EditOperation.getCategories(this.typeElem.value);
            EditOperation.fillCategorySelect(this.categories, this.categoryElem);
        }

        document.getElementById('cancel-btn').onclick = () => {
            location.href = '#/operations';
        }
    }

    async init() {
        await CalcBalance.getBalance();
        this.operation = await this.getOperation();
        if (this.operation) {
            for (let i = 0; i < this.typeElem.children.length; i++) {
                if (this.typeElem.children[i].value === this.operation.type) {
                    this.typeElem.children[i].setAttribute('selected', 'selected');
                }
            }
        }
        this.amountElem.value = this.operation.amount;
        this.dateElem.value = this.operation.date;
        this.commentElem.value = this.operation.comment;

        this.categories = await EditOperation.getCategories(this.operation.type);
        EditOperation.fillCategorySelect(this.categories, this.categoryElem);

        document.getElementById('save-btn').onclick = () => {
            return this.editOperation();
        }
    }

    async getOperation() {
        const result = await CustomHttp.request(config.host + 'operations/' + this.routeParams.operationId);

        if (result && !result.error) {
            return result;
        } else {
            throw new Error(result.error);
        }
    }

    static async getCategories(type) {
        const result = await CustomHttp.request(config.host + 'categories/' + type);

        if (result) {
            if (result.error) {
                throw new Error(result.error);
            }
            return result;
        }
    }

    static fillCategorySelect(categories, categoryElem) {
        categories.forEach(item => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', item.id);
            optionElement.innerText = item.title;
            categoryElem.appendChild(optionElement);
        })
    }

    async editOperation() {
        if (CreateOperation.validForm()) {
            const result = await CustomHttp.request(config.host + 'operations/' + this.routeParams.operationId, 'PUT', {
                type: this.typeElem.value,
                amount: this.amountElem.value,
                date: this.dateElem.value,
                comment: this.commentElem.value,
                category_id: Number(this.categoryElem.value),
            });

            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                location.href = '#/operations'
            }
        }
    }
}