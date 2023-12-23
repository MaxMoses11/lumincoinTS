import {Expenses} from "./expenses.js";
import {CustomHttp} from "../services/custom-http.js";
import {config} from "../config/config.js";

export class EditExpenses {
    editCategoryId = Expenses.categoryId;
    nameInput = null;
    editBtn = null;
    constructor() {
        this.nameInput = document.getElementById('name-input');
        this.editBtn = document.getElementById('edit-btn');

        this.init();

        this.editBtn.onclick = () => {
            return this.editExpenseCategory();
        }
    }

    async init() {
        if (this.editCategoryId) {
            const result = await CustomHttp.request(config.host + 'categories/expense/' + this.editCategoryId);

            if (result && !result.error) {
                this.nameInput.value = result.title;
            } else {
                throw new Error(result.error);
            }
        }
    }

    async editExpenseCategory() {
        const result = await CustomHttp.request(config.host + 'categories/expense/' + this.editCategoryId, 'PUT', {
            title: this.nameInput.value,
        });

        if (result.error) {
            throw new Error(result.error);
        }

        location.href = '#/expenses';
    }
}