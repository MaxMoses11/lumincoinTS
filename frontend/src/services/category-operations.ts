import {CustomHttp} from "./custom-http";
import {config} from "../../config/config";
import {CategoriesResponseType} from "../types/categories-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class CategoryOperations {
    public static async getCategories(type: string): Promise<CategoriesResponseType[] | undefined> {
        const result: DefaultResponseType | CategoriesResponseType[] = await CustomHttp.request(config.host + 'categories/' + type);

        if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            return result as CategoriesResponseType[];
        }
    }

    public static fillCategorySelect(categories: CategoriesResponseType[], categoryElem: HTMLElement): void {
        categories.forEach((item: CategoriesResponseType): void => {
            const optionElement: HTMLElement = document.createElement('option');
            optionElement.setAttribute('value', item.id.toString());
            optionElement.innerText = item.title;
            categoryElem.appendChild(optionElement);
        })
    }


    public static validForm(): boolean {

        const formElement: HTMLElement | null = document.getElementById('form');
        if (formElement) {
            const formItems: HTMLCollection = formElement.children;
            let isValid: boolean = true;
            for (let i = 0; i < formItems.length; i++) {
                if (isValid) {
                    if (!(formItems[i] as HTMLInputElement).value) {
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
        return false;
    }
}