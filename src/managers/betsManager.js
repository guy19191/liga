import {AuthManager} from "./authManager.js";
import {databaseManager} from "./databaseManager.js";
import {dateToTimestamp, timestampToDateTime} from "../utils/index.js";

export class BetsManager {
     constructor(communityId = 0) {
        databaseManager.getInstance().queryBets(communityId).then(betQuery => {
            betQuery.rows.filter(bet => !Boolean(bet.disabled)).forEach(bet => {
                setTimeout(() => this.disableBet(bet.id), Number(bet.date) - new Date().getTime());
            });
        });
    }

    static getInstance() {
        if (!BetsManager.instance) {
            BetsManager.instance = new BetsManager();
        }
        return BetsManager.instance;
    }

    async setBet(teamA, teamB, dateTime, betName, communityId){
        const timestamp = dateToTimestamp(dateTime)
        const id = await databaseManager.getInstance().insertBet(teamA, teamB, timestamp, betName, communityId);
        setTimeout(() => this.disableBet(id), timestamp - new Date().getTime());
    }

    async setUserBets(id, points, team, token){
        try {
            const {userId} = await AuthManager.getInstance().checkToken(token);
            const hasBetQuery = await databaseManager.getInstance().queryHasBet(id, userId);
            if (hasBetQuery.rows.length !==0){
                await databaseManager.getInstance().updateUserBet(id, userId, team, points);
                const oldPoints = hasBetQuery.rows[0].points;
                points = oldPoints - points;
            } else {
                await databaseManager.getInstance().insertUserBet(id, userId, team, points);
                points= -points
            }
            return this.setPoints(userId, points);
        } catch (e) {
            throw e;
        }
    }

    async updateBet(id, howWins) {
       const queryUsersBets = await databaseManager.getInstance().queryUserBetsByBetId(id);
       const betQuery = await databaseManager.getInstance().queryBetsById(id);
       if (betQuery.rows[0].disable) {
           const promises = queryUsersBets.rows.map(bet => {
               if (howWins == bet.howwins && betQuery.rows[0].howWins != howWins) {
                   return this.setPoints(bet.userid, Number(bet.win) * Number(bet.points));
               } else {
                   if (betQuery.rows[0].howWins != 0 && betQuery.rows[0].howWins != howWins)
                       return this.setPoints(bet.userid, -Number(bet.win) * Number(bet.points));
               }
           })
           await Promise.all(promises);
           await databaseManager.getInstance().updateBet(id, "howWins", howWins);

       }
    }

    async disableBet(betId){
         const betsByLeague = {}
        const queryUsersBets = await databaseManager.getInstance().queryUserBetsByBetId(betId);
        queryUsersBets.rows.forEach(userBet => {
            if (!betsByLeague[userBet.leagueid])
                betsByLeague[userBet.leagueid] = {};
            if (!betsByLeague[userBet.leagueid][userBet.howwins])
                betsByLeague[userBet.leagueid][userBet.howwins] = 1;
            else
                betsByLeague[userBet.leagueid][userBet.howwins] ++;

        });

        for (let i in betsByLeague){
            if (!betsByLeague[i]["1"] && betsByLeague[i]["2"] === 1)
                betsByLeague[i]["2"] = 10
            else if (betsByLeague[i]["1"] === 1 && !betsByLeague[i]["2"])
                betsByLeague[i]["1"] = 10
            else if (betsByLeague[i]["1"] && betsByLeague[i]["2"]) {
                const a = (betsByLeague[i]["2"] / betsByLeague[i]["1"] + 1).toFixed(2);
                const b = (betsByLeague[i]["1"] / betsByLeague[i]["2"] + 1).toFixed(2);
                betsByLeague[i]["1"] = a
                betsByLeague[i]["2"] = b
            } else {
                betsByLeague[i]["1"] = 1
                betsByLeague[i]["2"] = 1
            }
        }

        const promise = queryUsersBets.rows.map(userBet =>{
            return databaseManager.getInstance().updateUserBetWin(betId, userBet.userid, betsByLeague[userBet.leagueid]?.[userBet.howwins]);
        });
        promise.push(databaseManager.getInstance().updateBet(betId, 'disable',true));
        await Promise.all(promise);
    }

    async setPoints(userId, points){
        try {
            const user = await databaseManager.getInstance().queryLigaUsers(userId);
            const userPoints = user.rows[0].points;
            const newPoints = Number(userPoints) + Number(points);
            await databaseManager.getInstance().updateLigaUser(userId, 'points', newPoints.toString());
        }catch(e){
            throw e;
        }
    }


    async getBets(communityId){
        const betQuery = await databaseManager.getInstance().queryBets(communityId);
        const bets = betQuery.rows.map(bet => {
           bet.dateTime = timestampToDateTime(Number(bet.date));
           return bet;
        });
        return bets;
    }

    async getUserBets(communityId, token){
        const {userId} = await AuthManager.getInstance().checkToken(token);
        const userQuery = await databaseManager.getInstance().queryUserBets(userId);
        return userQuery.rows;
    }
}