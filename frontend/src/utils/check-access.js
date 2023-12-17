import {Auth} from "../services/auth.js";

export class CheckAccess {
    static check() {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login';
        }
    }
}