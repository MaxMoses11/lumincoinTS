export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.balanceElement = document.getElementById('balance');
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');

        this.routes = [
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                load: () => {
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                load: () => {
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
                }
            },
            {
                route: '#/incoming',
                title: 'Категории доходов',
                template: 'templates/incoming.html',
                load: () => {
                }
            },
            {
                route: '#/expenses',
                title: 'Категории расходов',
                template: 'templates/expenses.html',
                load: () => {
                }
            },
            {
                route: '#/incoming-expenses',
                title: 'Доходы & расходы',
                template: 'templates/incoming-expenses.html',
                load: () => {
                }
            },
            {
                route: '#/create-incoming',
                title: 'Создать категорию доходов',
                template: 'templates/create-incoming.html',
                load: () => {
                }
            },
            {
                route: '#/create-expenses',
                title: 'Создать категорию расходов',
                template: 'templates/create-expenses.html',
                load: () => {
                }
            },
            {
                route: '#/edit-incoming',
                title: 'Редактировать категорию доходов',
                template: 'templates/edit-incoming.html',
                load: () => {
                }
            },
            {
                route: '#/edit-expenses',
                title: 'Редактировать категорию расходов',
                template: 'templates/edit-expenses.html',
                load: () => {
                }
            },
            {
                route: '#/create-inc-exp-item',
                title: 'Создать доход/расход',
                template: 'templates/create-inc-exp-item.html',
                load: () => {
                }
            },
            {
                route: '#/edit-inc-exp-item',
                title: 'Редактировать доход/расход',
                template: 'templates/edit-inc-exp-item.html',
                load: () => {
                }
            }
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
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

        // const userInfo = Auth.getUserInfo();
        // const accessToken = localStorage.getItem(Auth.accessTokenKey);
        // if (userInfo && accessToken) {
        //     this.profileElement.style.display = 'flex';
        //     this.profileFullNameElement.innerText = userInfo.fullName;
        // } else {
        //     this.profileElement.style.display = 'none';
        // }

        newRoute.load();
    }
}