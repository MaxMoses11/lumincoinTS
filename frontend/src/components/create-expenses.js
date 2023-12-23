import {CustomHttp} from "../services/custom-http.js";
import {config} from "../config/config.js";

export class CreateExpenses {
    nameInput = null;
    createBtn = null;
    constructor() {
        this.nameInput = document.getElementById('name-input');
        this.createBtn = document.getElementById('create-btn');

        this.createBtn.onclick = () => {return this.createExpenseCategory()};
    }

    async createExpenseCategory() {
        const result = await CustomHttp.request(config.host + 'categories/expense', 'POST', {
            title: this.nameInput.value,
        });

        if (result && !result.error) {
            location.href = '#/expenses';
        } else {
            throw new Error(result.error);
        }
    }
}