import {Main} from "./components/main.js";
import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import {CreateIncoming} from "./components/create-incoming.js";
import {Incoming} from "./components/incoming.js";
import {Expenses} from "./components/expenses.js";
import {IncomingExpenses} from "./components/incoming-expenses.js";
import {CreateExpenses} from "./components/create-expenses.js";
import {EditIncoming} from "./components/edit-incoming.js";
import {CreateIncExpItem} from "./components/create-inc-exp-item.js";
import {EditIncExpItem} from "./components/edit-inc-exp-item.js";
import {EditExpenses} from "./components/edit-expenses.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.balanceElement = document.getElementById('balance');
        this.titleElement = document.getElementById('page-title');
        this.sidebarElement = document.getElementById('sidebar');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');

        this.routes = [
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
                    new Main()
                }
            },
            {
                route: '#/incoming',
                title: 'Категории доходов',
                template: 'templates/incoming.html',
                load: () => {
                    new Incoming();
                }
            },
            {
                route: '#/expenses',
                title: 'Категории расходов',
                template: 'templates/expenses.html',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '#/incoming-expenses',
                title: 'Доходы & расходы',
                template: 'templates/incoming-expenses.html',
                load: () => {
                    new IncomingExpenses();
                }
            },
            {
                route: '#/create-incoming',
                title: 'Создать категорию доходов',
                template: 'templates/create-incoming.html',
                load: () => {
                    new CreateIncoming();
                }
            },
            {
                route: '#/create-expenses',
                title: 'Создать категорию расходов',
                template: 'templates/create-expenses.html',
                load: () => {
                    new CreateExpenses();
                }
            },
            {
                route: '#/edit-incoming',
                title: 'Редактировать категорию доходов',
                template: 'templates/edit-incoming.html',
                load: () => {
                    new EditIncoming();
                }
            },
            {
                route: '#/edit-expenses',
                title: 'Редактировать категорию расходов',
                template: 'templates/edit-expenses.html',
                load: () => {
                    new EditExpenses();
                }
            },
            {
                route: '#/create-inc-exp-item',
                title: 'Создать доход/расход',
                template: 'templates/create-inc-exp-item.html',
                load: () => {
                    new CreateIncExpItem();
                }
            },
            {
                route: '#/edit-inc-exp-item',
                title: 'Редактировать доход/расход',
                template: 'templates/edit-inc-exp-item.html',
                load: () => {
                    new EditIncExpItem();
                }
            }
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.titleElement.innerText = newRoute.title;

        const userName = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`;
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userName && accessToken) {
            this.sidebarElement.classList.remove('d-none');
            this.sidebarElement.classList.add('d-flex');
            this.profileFullNameElement.innerText = userName;
        } else {
            this.sidebarElement.classList.remove('d-flex');
            this.sidebarElement.classList.add('d-none');
        }

        newRoute.load();
    }
}