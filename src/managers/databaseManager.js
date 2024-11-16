import pg from 'pg'
import {v6} from 'uuid';

const { Pool } = pg

export class databaseManager {
    databaseManager
    pool

    constructor() {
        this.pool = new Pool({
            user: process.env.USER,
            host: process.env.HOST,
            database: process.env.DATABASE,
            password: process.env.PASSWORD,
            port: process.env.DB_PORT
        })
    }

    static getInstance() {
        if (!databaseManager.instance) {
            databaseManager.instance = new databaseManager();
        }
        return databaseManager.instance;
    }

    queryUsers = (username) => this.pool.query(`SELECT * FROM public.users WHERE username='${username}'`);

    queryUserBets = (id) => this.pool.query(`SELECT usersbets.betid, usersbets.points, usersbets.howwins, usersbets.win FROM usersbets INNER JOIN bets ON "bets".id=usersbets.betid WHERE usersbets.userid='${id}' AND bets.expired=false`);

    queryUserBetsByBetId = (id) => this.pool.query(`SELECT usersbets.betid, usersbets.points, usersbets.howwins, usersbets.win, usersbets.userid, "ligaUsers".leagueid FROM usersbets INNER JOIN "ligaUsers" ON "ligaUsers".id=usersbets.userid INNER JOIN bets ON "bets".id=usersbets.betid  WHERE usersbets.betid='${id}'`);

    queryHasBet = (betId,userId) => this.pool.query(`SELECT * FROM public.usersbets WHERE betid='${betId}' AND userid='${userId}'`);
    updateUserBet = (betId, userId, howWins, points) => this.pool.query(
        `UPDATE public.usersbets SET "howwins"=${howWins}, "points"=${points} WHERE betid='${betId}' AND userid='${userId}'`);
    updateUserBetWin = (betId, userId, win) => this.pool.query(
        `UPDATE public.usersbets SET "win"=${win} WHERE betid='${betId}' AND userid='${userId}'`);

    queryLigaUsers = (id) => this.pool.query(`SELECT "ligaUsers".points, "ligaUsers".leagueid, "ligaUsers".nickname, users."firstName", users."lastName" FROM "ligaUsers" INNER JOIN users ON "ligaUsers".id=users.id WHERE users.id='${id}'`);
    queryLigaUsersByLeague = (leagueId) => this.pool.query(`SELECT "ligaUsers".points, "ligaUsers".nickname FROM "ligaUsers" WHERE leagueid='${leagueId}'`);
    queryLeagueById = (id) => this.pool.query(`SELECT name FROM public.leagues WHERE id='${id}'`)
    queryLeagues = (communityid='test') => this.pool.query(`SELECT * FROM public.leagues WHERE communityid='${communityid}'`);
    queryTeams = (communityId = 0) => this.pool.query(`SELECT * FROM public.teams WHERE communityId=${communityId}`);
    queryBets = (communityId = 0) => this.pool.query(`SELECT * FROM public.bets WHERE expired=false AND communityId=${communityId}`);
    queryBetsById = (id) => this.pool.query(`SELECT "howWins", disable FROM public.bets WHERE id='${id}'`);

    queryBetsHistory = (communityId = 0) => this.pool.query(`SELECT * FROM public.bets WHERE expired=true AND communityId=${communityId}`);

    insertTeam = (name, image, communityId = 0) => this.pool.query(
        `INSERT INTO public.teams(name, communityid, image, id)	VALUES ('${name}', ${communityId}, '${image}', '${v6()}')`);

    insertBet = (teamA, teamB, date, betName, communityId = 0) => {
        const id = v6();
        this.pool.query(
            `INSERT INTO public.bets("teamA", "teamB", "betName", communityid, "date", id) VALUES ('${teamA}', '${teamB}', '${betName}', ${communityId}, '${date}', '${id}')`)
        return id;
    };
    insetLigaUser = (nickname, leagueId, userId) => this.pool.query(
`INSERT INTO public."ligaUsers"(nickname, leagueId, id) VALUES ('${nickname}', '${leagueId}', '${userId}')`);

insertNewUser = (email, password, firstName, lastName, communityIds=[0], role=2) => this.pool.query(
        `INSERT INTO public.users(id, role, username, password, "firstName", "lastName") VALUES ('${v6()}', ${role}, '${email}', '${password}', '${firstName}', '${lastName}')`);

    insertUserBet = (betId, userId, howWins, points) => this.pool.query(
        `INSERT INTO public.usersbets(betid, userid, howwins, points) VALUES ('${betId}', '${userId}', ${howWins}, ${points})`);

    updateBet = (id, what, to) => this.pool.query(
        `UPDATE public.bets SET "${what}"=${to} WHERE "id"='${id}'`);

    updateLigaUser = (id, what, to) => this.pool.query(
        `UPDATE public."ligaUsers" SET "${what}"=${to} WHERE "id"='${id}'`);
}