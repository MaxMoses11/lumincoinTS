import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config.ts";
import {Auth} from "../services/auth.ts";
import {CalcBalance} from "../services/calc-balance.ts";

export class Form {
    constructor(process) {
        this.process = process;
        this.passwordElement = null;
        this.repeatPasswordElement = null;
        this.rememberElement = null;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
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

        let that = this;
        document.getElementById('button').onclick = () => {
            const validateData = that.validateForm();
            if (validateData) {
                that.processForm();
            }
        }
    }

    validateForm() {
        let hasError = false;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            if (!item.element.value || !item.element.value.match(item.regex)) {
                item.element.parentNode.classList.add("border-danger");
                item.element.parentNode.classList.remove("border-white");
                item.valid = false;
                hasError = true;
            } else {
                item.element.parentNode.classList.add("border-white");
                item.element.parentNode.classList.remove("border-danger");
                item.valid = true;
            }
        });

        this.passwordElement = this.fields.find(item => item.name === 'password');

        if (this.process === 'signup') {

            this.repeatPasswordElement = this.fields.find(item => item.name === 'repeat-password');

            if (!this.passwordElement.element.value || !this.repeatPasswordElement.element.value
                || this.passwordElement.element.value !== this.repeatPasswordElement.element.value
                || !this.passwordElement.valid || !this.repeatPasswordElement.valid) {
                this.passwordElement.element.parentNode.classList.add("border-danger");
                this.passwordElement.element.parentNode.classList.remove("border-white");
                this.repeatPasswordElement.element.parentNode.classList.add("border-danger");
                this.repeatPasswordElement.element.parentNode.classList.remove("border-white");
                this.passwordElement.valid = false;
                this.repeatPasswordElement.valid = false;
                hasError = true;
            } else {
                this.passwordElement.element.parentNode.classList.remove("border-danger");
                this.passwordElement.element.parentNode.classList.add("border-white");
                this.repeatPasswordElement.element.parentNode.classList.remove("border-danger");
                this.repeatPasswordElement.element.parentNode.classList.add("border-white");
                this.passwordElement.valid = true;
                this.repeatPasswordElement.valid = true;
            }
        }
        if (!hasError) {
            return true;
        }
    }

    async processForm() {
        const email = this.fields.find(item => item.name === 'email').element.value;
        const password = this.passwordElement.element.value;

        if (this.process === 'signup') {
            try {
                const username = this.fields.find(item => item.name === 'username').element.value;
                const [firstName, lastName] = username.split(' ');

                const result = await CustomHttp.request(config.host + 'signup', 'POST', {
                    name: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    passwordRepeat: this.fields.find(item => item.name === 'repeat-password').element.value,
                });

                if (result) {
                    if (result.error || !result.user) {
                        throw new Error(result.message);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }

        try {
            let rememberMe;
            this.rememberElement = document.getElementById('flexCheckDefault');
            if (this.rememberElement) {
                rememberMe = this.rememberElement.checked;
            } else {
                rememberMe = false;
            }

            const result = await CustomHttp.request(config.host + 'login', 'POST', {
                email: email,
                password: password,
                rememberMe: rememberMe,
            });

            if (result) {
                if (result.error || !result.user) {
                    throw new Error(result.message);
                }

                Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                Auth.setUserInfo(result.user.name, result.user.lastName, email);
                location.href = '/#/main';
            }
        } catch (e) {
            console.log(e);
        }
    }
}