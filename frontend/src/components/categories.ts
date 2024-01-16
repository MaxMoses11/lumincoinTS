import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {RemoveActive} from "../utils/remove-active";
import {HtmlBlocks} from "../utils/html-blocks";
import {CalcBalance} from "../services/calc-balance";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoriesResponseType} from "../types/categories-response.type";

export class Categories {
    readonly typeCategories: string = '';
    private categoriesList: CategoriesResponseType[] = [];
    readonly cardsElement: HTMLElement | null = null;
    private categoryId: string = '';

    constructor(type: string) {
        this.typeCategories = type;
        RemoveActive.remove();

        if (this.typeCategories === 'income') {
            const incomeBtn: HTMLElement | null = document.getElementById('income');
            if (incomeBtn) {
                incomeBtn.classList.add('active');
            }
        } else {
            const expenseBtn: HTMLElement | null = document.getElementById('expense');
            if (expenseBtn) {
                expenseBtn.classList.add('active');
            }
        }

        this.cardsElement = document.getElementById('cards');
        if (this.cardsElement) {
            this.cardsElement.onclick = (event): void => {
                let target: any = event.target;
                if (!target.classList.contains('remove-category') && !target.classList.contains('edit-category')) {
                    return;
                }
                this.categoryId = target.parentElement.parentElement.getAttribute('id').split('-')[1];
                if (target.classList.contains('edit-category')) {
                    if (this.typeCategories === 'income') {
                        location.href = '#/edit-incoming?categoryId=' + this.categoryId;
                    } else {
                        location.href = '#/edit-expenses?categoryId=' + this.categoryId;
                    }
                }
            }
        }
        const successRemoveBtn: HTMLElement | null = document.getElementById('success-remove');
        if (successRemoveBtn) {
            successRemoveBtn.onclick = () => {
                return this.deleteCategory(this.categoryId);
            }
        }
        this.init();
    }

    async init(): Promise<void> {
        await CalcBalance.getBalance();
        const result: DefaultResponseType | CategoriesResponseType[] = await CustomHttp.request(config.host + 'categories/' + this.typeCategories);

        if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            this.categoriesList = result as CategoriesResponseType[];
            this.createCategoriesCards();
        }
    }

    private createCategoriesCards(): void {

        this.categoriesList.forEach((item: CategoriesResponseType): void => {
            const cardElement: HTMLElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('id', 'card-' + item.id);

            const cardBodyElement: HTMLElement = document.createElement('div');
            cardBodyElement.classList.add('card-body');

            const cardBodyTitleElement: HTMLElement = document.createElement('h3');
            cardBodyTitleElement.classList.add('card-title', 'text-primary-emphasis', 'fw-bold');
            cardBodyTitleElement.innerText = item.title;

            const cardBodyEditElement: HTMLElement = document.createElement('button');
            cardBodyEditElement.classList.add('btn', 'btn-primary', 'me-2', 'edit-category');
            cardBodyEditElement.innerText = 'Редактировать';

            const cardBodyRemoveElement: HTMLElement = document.createElement('button');
            cardBodyRemoveElement.classList.add('btn', 'btn-danger', 'remove-category');
            cardBodyRemoveElement.innerText = 'Удалить';
            cardBodyRemoveElement.setAttribute('data-bs-toggle', 'modal');
            cardBodyRemoveElement.setAttribute('data-bs-target', '#staticBackdrop');

            cardBodyElement.appendChild(cardBodyTitleElement);
            cardBodyElement.appendChild(cardBodyEditElement);
            cardBodyElement.appendChild(cardBodyRemoveElement);

            cardElement.appendChild(cardBodyElement);

            if (this.cardsElement) {
                this.cardsElement.appendChild(cardElement);
            }
        });

        const newCardElement: HTMLElement = document.createElement('a');
        newCardElement.innerHTML = HtmlBlocks.cardElement;

        newCardElement.classList.add('card', 'new-card');
        newCardElement.setAttribute('href', this.typeCategories === 'expense' ? '#/create-expenses' : '#/create-incoming');

        if (this.cardsElement) {
            this.cardsElement.appendChild(newCardElement);
        }
    }

    private async deleteCategory(categoryId: string): Promise<void> {

        const result: DefaultResponseType = await CustomHttp.request(config.host + 'categories/' + this.typeCategories + '/' + categoryId, 'DELETE');

        if (result && this.cardsElement) {
            if (result.error) {
                throw new Error(result.message);
            }

            this.cardsElement.innerHTML = '';
            this.init();
        }
    }
}