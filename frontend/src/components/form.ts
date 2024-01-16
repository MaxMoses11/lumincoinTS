import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {Auth} from "../services/auth";
import {FormFieldType} from "../types/form-field.type";
import {DefaultResponseType} from "../types/default-response.type";
import {SignupResponseType} from "../types/signup-response.type";
import {LoginResponseType} from "../types/login-response.type";

export class Form {
    readonly process: string;
    private passwordElement: FormFieldType | undefined;
    private repeatPasswordElement: FormFieldType | undefined
    private rememberElement: HTMLInputElement | null;
    private fields: FormFieldType[] = [];

    constructor(type: string) {
        this.process = type;
        this.rememberElement = null;

        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/main';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ]

        if (this.process === 'signup') {
            this.fields.unshift({
                    name: 'username',
                    id: 'username',
                    element: null,
                    regex: /^[А-Я][а-яА-Я]{3,}(?: [А-Я][а-яА-Я]*){0,2}$/gm,
                    valid: false,
                },
                {
                    name: 'repeat-password',
                    id: 'repeat-password',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                });
        }

        let that: Form = this;
        const buttonElement: HTMLElement | null = document.getElementById('button');
        if (buttonElement) {
            buttonElement.onclick = (): void => {
                const validateData: boolean = that.validateForm();
                if (validateData) {
                    that.processForm();
                }
            }
        }
    }

    validateForm(): boolean {
        let hasError: boolean = false;
        this.fields.forEach((item: FormFieldType): void => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (!item.element) return;
            if (!item.element.value || !item.element.value.match(item.regex)) {
                const itemParent: HTMLElement | null = (item.element as HTMLInputElement).parentElement;
                (itemParent as HTMLElement).classList.add("border-danger");
                (itemParent as HTMLElement).classList.remove("border-white");
                item.valid = false;
                hasError = true;
            } else {
                const itemParent: HTMLElement | null = (item.element as HTMLInputElement).parentElement;
                (itemParent as HTMLElement).classList.add("border-white");
                (itemParent as HTMLElement).classList.remove("border-danger");
                item.valid = true;
            }
        });

        this.passwordElement = this.fields.find(item => item.name === 'password');

        if (this.process === 'signup') {

            this.repeatPasswordElement = this.fields.find(item => item.name === 'repeat-password');

            if (this.passwordElement && this.passwordElement.element
                && this.repeatPasswordElement && this.repeatPasswordElement.element) {

                const passwordParentElement: HTMLElement | null = this.passwordElement.element.parentElement;
                const repeatPasswordParentElement: HTMLElement | null = this.repeatPasswordElement.element.parentElement;

                if (passwordParentElement && repeatPasswordParentElement) {

                    if (!this.passwordElement.element.value || !this.repeatPasswordElement.element.value
                        || this.passwordElement.element.value !== this.repeatPasswordElement.element.value
                        || !this.passwordElement.valid || !this.repeatPasswordElement.valid) {

                        passwordParentElement.classList.add("border-danger");
                        passwordParentElement.classList.remove("border-white");
                        repeatPasswordParentElement.classList.add("border-danger");
                        repeatPasswordParentElement.classList.remove("border-white");
                        this.passwordElement.valid = false;
                        this.repeatPasswordElement.valid = false;
                        hasError = true;

                    } else {

                        passwordParentElement.classList.remove("border-danger");
                        passwordParentElement.classList.add("border-white");
                        repeatPasswordParentElement.classList.remove("border-danger");
                        repeatPasswordParentElement.classList.add("border-white");
                        this.passwordElement.valid = true;
                        this.repeatPasswordElement.valid = true;

                    }
                }
            }
        }
        return !hasError;
    }

    private async processForm(): Promise<void> {
        const emailElement: FormFieldType | undefined = this.fields.find(item => (item as FormFieldType).name === 'email');
        if (!emailElement || !emailElement.element) return;
        const email: string = emailElement.element.value;

        const password: string = ((this.passwordElement as FormFieldType).element as HTMLInputElement).value;

        if (this.process === 'signup') {
            try {
                const userNameElement: FormFieldType | undefined = this.fields.find(item => item.name === 'username');
                if (!userNameElement || !userNameElement.element) return;
                const username: string = userNameElement.element.value;

                const repeatPasswordElement: FormFieldType | undefined = this.fields.find(item => item.name === 'repeat-password');
                if (!repeatPasswordElement || !repeatPasswordElement.element) return;
                const repeatPassword: string = repeatPasswordElement.element.value;

                const [firstName, lastName]: string[] = username.split(' ');

                const result: DefaultResponseType | SignupResponseType = await CustomHttp.request(config.host + 'signup', 'POST', {
                    name: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    passwordRepeat: repeatPassword,
                });

                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                }
            } catch (e) {
                console.log(e);
                return;
            }
        }

        try {
            let rememberMe: boolean;
            this.rememberElement = document.getElementById('flexCheckDefault') as HTMLInputElement;
            if (this.rememberElement) {
                rememberMe = this.rememberElement.checked;
            } else {
                rememberMe = false;
            }

            const result: DefaultResponseType | LoginResponseType = await CustomHttp.request(config.host + 'login', 'POST', {
                email: email,
                password: password,
                rememberMe: rememberMe,
            });

            if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message);
                }

                Auth.setTokens((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken);
                Auth.setUserInfo((result as LoginResponseType).user.name, (result as LoginResponseType).user.lastName, email);
                location.href = '/#/main';
            }
        } catch (e) {
            console.log(e);
        }
    }
}