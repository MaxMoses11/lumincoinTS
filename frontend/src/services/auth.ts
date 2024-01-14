import {config} from "../../config/config";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';

    static async processRefreshTokens() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + 'refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if(response && response.status === 200) {
                const result = await response.json()
                if(result && !result.error) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }
        }

        Auth.removeTokens();
        location.href = '#/login';
        return false;
    }

    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + 'logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if(response && !response.error) {
                const result = await response.json()
                if(result && !result.error) {
                    Auth.removeTokens();
                    Auth.removeUserInfo();
                    localStorage.clear();
                    return true;
                }
            }
        }
    }

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }
    static setUserInfo(firstName, lastName, email) {
        localStorage.setItem('name', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('email', email);
    }
    static removeUserInfo() {
        localStorage.removeItem('name');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
    }
}