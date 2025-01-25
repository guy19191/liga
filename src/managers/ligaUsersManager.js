import {AuthManager} from "./authManager.js";
import {databaseManager} from "./databaseManager.js";
import {timestampToDateTime} from "../utils/index.js";

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
            const userExpiredBets = await databaseManager.getInstance().queryUserBets(userId, true);
            let winRate = 0
            user.betHistory = userExpiredBets.rows.map(bet => {
                let points = Number(bet.points)
                const date = timestampToDateTime(bet.date);
                if (bet.howwins === bet.howWins){
                    winRate ++;
                    points *= Number(bet.win);
                }
                return {
                    date: date,
                    points: points,
                    result: bet.howWins,
                    game: bet.betName,
                    bet: bet.howwins
                }
            });
            user.totalBets =  userExpiredBets.rows.length.toString();
            user.winRate = ((winRate / user.totalBets)*100).toString();
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