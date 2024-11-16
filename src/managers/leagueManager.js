import {AuthManager} from "./authManager.js";
import {databaseManager} from "./databaseManager.js";

export class LeagueManager {
    permissionManager;

    constructor() {

    }

    static getInstance() {
        if (!LeagueManager.instance) {
            LeagueManager.instance = new LeagueManager();
        }
        return LeagueManager.instance;
    }

    async getAllLeagues(){
        try {
            const userData = await databaseManager.getInstance().queryLeagues();
            return userData.rows
        } catch (e) {
            throw e;
        }
    }

    async getUserLeague(token){
        try {
            const {userId} = await AuthManager.getInstance().checkToken(token);
            const userData = await databaseManager.getInstance().queryLigaUsers(userId);
            const user = userData.rows[0];
            const usersData = await databaseManager.getInstance().queryLigaUsersByLeague(user.leagueid);
            const leagueData = await databaseManager.getInstance().queryLeagueById(user.leagueid);
            const league = leagueData.rows[0];
            league.players = usersData.rows;
            return league;
        } catch (e) {
            throw e;
        }
    }

}