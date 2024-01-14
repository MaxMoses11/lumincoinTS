import {UrlManager} from "../utils/url-manager.ts";
import {EditOperation} from "./edit-operation";
import {CustomHttp} from "../services/custom-http.ts";
import {config} from "../../config/config.ts";
import {CalcBalance} from "../services/calc-balance.ts";

export class CreateOperation {
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

        document.getElementById('save-btn').onclick = () => {
            return this.getForm()
        };

        document.getElementById('cancel-btn').onclick = () => {
            location.href = '#/operations';
        }
    }

    async init() {
        await CalcBalance.getBalance();
        for (let i = 0; i < this.typeElem.children.length; i++) {
            if (this.typeElem.children[i].value === this.routeParams.operation) {
                this.typeElem.children[i].setAttribute('selected', 'selected');
            }
        }

        this.categories = await EditOperation.getCategories(this.routeParams.operation);
        EditOperation.fillCategorySelect(this.categories, this.categoryElem);
    }

    async getForm() {
        if (CreateOperation.validForm()) {
            const result = await CustomHttp.request(config.host + 'operations', 'POST', {
                type: this.typeElem.value,
                amount: this.amountElem.value,
                date: this.dateElem.value,
                comment: this.commentElem.value,
                category_id: Number(this.categoryElem.value)
            });

            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                // await CalcBalance.changeBalance(this.typeElem.value, this.amountElem.value);
                location.href = '#/operations';
            }
        }
    }

    static validForm() {
        const formItems = document.getElementById('form').children;
        let isValid = true;
        for (let i = 0; i < formItems.length; i++) {
            if (isValid) {
                if (!formItems[i].value) {
                    formItems[i].classList.add('border-danger', 'border-opacity-100');
                    formItems[i].classList.remove('border-secondary', 'border-opacity-25');
                    isValid = false;
                } else {
                    formItems[i].classList.remove('border-danger', 'border-opacity-100');
                    formItems[i].classList.add('border-secondary', 'border-opacity-25');
                    isValid = true;
                }
            } else {
                break;
            }
        }
        return isValid;
    }
}