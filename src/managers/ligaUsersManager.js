import {AuthManager} from "./authManager.js";
import {databaseManager} from "./databaseManager.js";

export class LigaUsersManager {
    permissionManager;

    constructor() {

    }

    static getInstance() {
        if (!LigaUsersManager.instance) {
            LigaUsersManager.instance = new LigaUsersManager();
        }
        return LigaUsersManager.instance;
    }

    async getUser(token){
        try {
            const {userId} = await AuthManager.getInstance().checkToken(token);
            const userData = await databaseManager.getInstance().queryLigaUsers(userId);
            const user = userData.rows[0];
            if (!user.nickname) {
                user.nickname = `${user.firstName} ${user.lastName}`
            }
            return user;
        } catch (e) {
            return {};
        }

    }

    async createUser(nickname, leagueId = 0, token){
        try {
            const {userId} = await AuthManager.getInstance().checkToken(token);
            await databaseManager.getInstance().insetLigaUser(nickname, leagueId, userId);
        } catch (e) {
            throw e;
        }

    }
}