import {Main} from "./components/main";
import {Form} from "./components/form";
import {Auth} from "./services/auth";
import {Operations} from "./components/operations";
import {CreateOperation} from "./components/create-operation";
import {EditOperation} from "./components/edit-operation";
import {Categories} from "./components/categories";
import {EditCategory} from "./components/edit-category";
import {CreateCategory} from "./components/create-category";
import {RouteType} from "./types/route.type";

export class Router {
    private contentElement: HTMLElement | null = null;
    private titleElement: HTMLElement | null = null;
    private sidebarElement: HTMLElement | null = null;
    private profileFullNameElement: HTMLElement | null = null;
    private routes: Array<RouteType> = [];
    constructor() {
        this.contentElement = document.getElementById('content');
        this.titleElement = document.getElementById('page-title');
        this.sidebarElement = document.getElementById('sidebar');
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

    public async openRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute: RouteType | undefined = this.routes.find((item: RouteType) => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        if (this.contentElement) {
            this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        }
        if (this.titleElement) {
            this.titleElement.innerText = newRoute.title;
        }

        const userName: string = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`;
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);

        if (this.sidebarElement && this.profileFullNameElement) {
            if (userName && accessToken) {
                this.sidebarElement.classList.remove('d-none');
                this.sidebarElement.classList.add('d-flex');
                this.profileFullNameElement.innerText = userName;
            } else {
                this.sidebarElement.classList.remove('d-flex');
                this.sidebarElement.classList.add('d-none');
            }
        }

        newRoute.load();
    }
}