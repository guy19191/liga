import {databaseManager} from "./databaseManager.js";
import jwt from "jsonwebtoken"
export class AuthManager{
    AuthManager;
    constructor() {

    }

    static getInstance() {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    }

    async signIn(username,password){
        //TODO secure Password
        const user = await databaseManager.getInstance().queryUsers(username);
        if (user.rows.length === 1 && user.rows[0].password === password){
             const token = this.createToken(user.rows[0].id, user.rows[0].role);
             return token;
        }
        else {
            throw "Wrong Username or Password"
        }
    }

     createToken(userId, role){
         return {
             accessToken: jwt.sign({
                 exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
                 data: {
                     userId: userId,
                     role: role
                 },

             }, process.env.PRIVATEKEY),
             refreshToken: jwt.sign({
                 exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                 data: {
                     userId: userId,
                     role: role
                 },
             }, process.env.PRIVATEKEY)
         }
    }

    async checkToken(token){
        try {
            const [Bearer, tokenValue] = token.split('Bearer ')
            const decoded = await this.verifyToken(tokenValue);
            return decoded.data;
        } catch (e) {
            throw ("Failed to verify token");
        }
    }

    verifyToken = (token) => jwt.verify(token, process.env.PRIVATEKEY);

    async refreshToken(refreshToken){
        try {
            const userData = this.verifyToken(refreshToken);
            return this.createToken(userData.data.userId, userData.data.role)
        } catch (e) {
            throw "Failed to refresh Token"
        }
    }

    async signUp(email, password, firstName, lastName) {
        try {
            const user = await databaseManager.getInstance().queryUsers(email);
            if (user.rows.length === 1) {
                return 409;
            } else {
                await databaseManager.getInstance().insertNewUser(email, password, firstName, lastName);
                return 201
            }
        } catch (e) {
            throw e
        }
    }
}