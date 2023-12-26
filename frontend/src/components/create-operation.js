import {UrlManager} from "../utils/url-manager.js";
import {EditOperation} from "./edit-operation.js";
import {CustomHttp} from "../services/custom-http.js";
import {config} from "../config/config.js";

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
    }

    async init() {
        for (let i = 0; i < this.typeElem.children.length; i++) {
            if (this.typeElem.children[i].value === this.routeParams.operation) {
                this.typeElem.children[i].setAttribute('selected', 'selected');
            }
        }

        this.categories = await EditOperation.getCategories(this.routeParams.operation);
        EditOperation.fillCategorySelect(this.categories, this.categoryElem);
    }

    async getForm() {
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

            location.href = '#/operations';
        }
    }
}