import {Main} from "./components/main.js";
import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import {Operations} from "./components/operations.js";
import {CreateOperation} from "./components/create-operation.js";
import {EditOperation} from "./components/edit-operation.js";
import {Categories} from "./components/categories.js";
import {EditCategory} from "./components/edit-category.js";
import {CreateCategory} from "./components/create-category.js";

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
                    new Categories('income');
                }
            },
            {
                route: '#/expenses',
                title: 'Категории расходов',
                template: 'templates/expenses.html',
                load: () => {
                    new Categories('expense');
                }
            },
            {
                route: '#/operations',
                title: 'Доходы & расходы',
                template: 'templates/operations.html',
                load: () => {
                    new Operations();
                }
            },
            {
                route: '#/create-incoming',
                title: 'Создать категорию доходов',
                template: 'templates/create-incoming.html',
                load: () => {
                    new CreateCategory('income');
                }
            },
            {
                route: '#/create-expenses',
                title: 'Создать категорию расходов',
                template: 'templates/create-expenses.html',
                load: () => {
                    new CreateCategory('expense');
                }
            },
            {
                route: '#/edit-incoming',
                title: 'Редактировать категорию доходов',
                template: 'templates/edit-incoming.html',
                load: () => {
                    new EditCategory('income');
                }
            },
            {
                route: '#/edit-expenses',
                title: 'Редактировать категорию расходов',
                template: 'templates/edit-expenses.html',
                load: () => {
                    new EditCategory('expense');
                }
            },
            {
                route: '#/create-operation',
                title: 'Создать доход/расход',
                template: 'templates/create-operation.html',
                load: () => {
                    new CreateOperation();
                }
            },
            {
                route: '#/edit-operation',
                title: 'Редактировать доход/расход',
                template: 'templates/edit-operation.html',
                load: () => {
                    new EditOperation();
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