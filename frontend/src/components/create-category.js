import {CustomHttp} from "../services/custom-http.js";
import {config} from "../config/config.js";

export class CreateCategory {
    typeCategory = null;
    nameInput = null;
    createBtn = null;
    constructor(type) {
        this.typeCategory = type;

        this.nameInput = document.getElementById('name-input');
        this.createBtn = document.getElementById('create-btn');

        this.createBtn.onclick = () => {return this.createCategory()};
    }

    async createCategory() {
        const result = await CustomHttp.request(config.host + 'categories/' + this.typeCategory, 'POST', {
            title: this.nameInput.value,
        });

        if (result && !result.error) {
            location.href = this.typeCategory === 'expense' ? '#/expenses' : '#/incoming';
        } else {
            throw new Error(result.error);
        }
    }
}