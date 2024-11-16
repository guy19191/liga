import {AuthManager} from "./authManager.js";

export class permissionManager {
    permissionManager;

    constructor() {

    }

    static getInstance() {
        if (!permissionManager.instance) {
            permissionManager.instance = new permissionManager();
        }
        return permissionManager.instance;
    }

    getRoleByNumber(number){
        switch (number){
            case 0:
                return "manager"
            case 1:
                return "manager"
            case 2:
                return "guest"
            case 3:
                return "guest"
        }
    }

    async getRoleByToken(token){
        const {role} = await AuthManager.getInstance().checkToken(token);
        const roleName = this.getRoleByNumber(role)
        return roleName;
    }
}