import {CustomHttp} from "../services/custom-http.js";
import {config} from "../config/config.js";
import {UrlManager} from "../utils/url-manager.js";

export class EditCategory {
    typeCategory = null;
    nameInput = null;
    editBtn = null;
    constructor(type) {
        this.typeCategory = type;

        this.routeParams = UrlManager.getQueryParams();
        this.nameInput = document.getElementById('name-input');
        this.editBtn = document.getElementById('edit-btn');

        this.init();

        this.editBtn.onclick = () => {
            return this.editCategory();
        }
    }

    async init() {
        if (this.routeParams.categoryId) {
            const result = await CustomHttp.request(config.host + 'categories/' + this.typeCategory + '/' + this.routeParams.categoryId);

            if (result && !result.error) {
                this.nameInput.value = result.title;
            } else {
                throw new Error(result.error);
            }
        }
    }

    async editCategory() {
        const result = await CustomHttp.request(config.host + 'categories/' + this.typeCategory + '/' + this.routeParams.categoryId, 'PUT', {
            title: this.nameInput.value,
        });

        if (result.error) {
            throw new Error(result.error);
        }

        location.href = this.typeCategory === 'expense' ? '#/expenses' : '#/incoming';
    }
}