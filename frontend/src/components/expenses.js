import {CustomHttp} from "../services/custom-http.js";
import {config} from "../config/config.js";

export class Expenses {
    expensesCategoriesList = null;
    expensesCardsElement = null;
    static categoryId = null;

    constructor() {
        this.expensesCardsElement = document.getElementById('expenses-cards');

        const that = this;
        this.expensesCardsElement.onclick = (event) => {
            let target = event.target;
            if (!target.classList.contains('remove-category') && !target.classList.contains('edit-category')) {
                return;
            }
            Expenses.categoryId = target.parentElement.parentElement.getAttribute('id').split('-')[1];
            console.log(Expenses.categoryId);
        }

        document.getElementById('success-remove').onclick = () => {
            return this.deleteCategoryExpense(Expenses.categoryId);
        }
        this.init();
    }

    async init() {
        const result = await CustomHttp.request(config.host + 'categories/expense');
        if (result) {
            if (result.error) {
                throw new Error(result.error);
            }
            this.expensesCategoriesList = result;
            this.createExpensesCategoriesCards();
        }
    }

    createExpensesCategoriesCards() {

        this.expensesCategoriesList.forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('id', 'expense-' + item.id);

            const cardBodyElement = document.createElement('div');
            cardBodyElement.classList.add('card-body');

            const cardBodyTitleElement = document.createElement('h3');
            cardBodyTitleElement.classList.add('card-title', 'text-primary-emphasis', 'fw-bold');
            cardBodyTitleElement.innerText = item.title;

            const cardBodyEditElement = document.createElement('a');
            cardBodyEditElement.classList.add('btn', 'btn-primary', 'me-2', 'edit-category');
            cardBodyEditElement.setAttribute('href', '#/edit-expenses');
            cardBodyEditElement.innerText = 'Редактировать';

            const cardBodyRemoveElement = document.createElement('a');
            cardBodyRemoveElement.classList.add('btn', 'btn-danger', 'remove-category');
            cardBodyRemoveElement.innerText = 'Удалить';
            cardBodyRemoveElement.setAttribute('href', '#');
            cardBodyRemoveElement.setAttribute('data-bs-toggle', 'modal');
            cardBodyRemoveElement.setAttribute('data-bs-target', '#staticBackdrop');

            cardBodyElement.appendChild(cardBodyTitleElement);
            cardBodyElement.appendChild(cardBodyEditElement);
            cardBodyElement.appendChild(cardBodyRemoveElement);

            cardElement.appendChild(cardBodyElement);

            this.expensesCardsElement.appendChild(cardElement);
        });

        const newCardElement = document.createElement('a');
        newCardElement.innerHTML =
            '<div class="card-body d-flex justify-content-center align-items-center p-5">\n' +
            '<div>\n' +
            '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
            '<path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"\n' +
            'fill="#CED4DA"/>\n' +
            '</svg>\n' +
            '</div>\n' +
            '</div>';
        newCardElement.classList.add('card', 'new-card');
        newCardElement.setAttribute('href', '#/create-expenses');

        this.expensesCardsElement.appendChild(newCardElement);
    }

    async deleteCategoryExpense(categoryId) {

        const result = await CustomHttp.request(config.host + 'categories/expense/' + categoryId, 'DELETE');

        if (result && !result.error) {
            this.expensesCardsElement.innerHTML = '';
            this.init();
        } else {
            throw new Error(result.error);
        }
    }
}