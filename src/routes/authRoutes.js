import express from 'express';
import {AuthManager} from "../managers/authManager.js";
import {permissionManager} from "../managers/permissionManager.js";
const router = express.Router();

router.post('/v1/signIn',async (req, res) => {
    try {
        const {username, password} = req.body;
        const token = await AuthManager.getInstance().signIn(username, password);
        res.status(200).send(token);
    } catch (e) {
        res.status(401).send('Your username or password is incorrect');
    }
});

router.post('/v1/refreshToken',async (req, res) => {
    try {
        const {refreshToken} = req.body;
        const token = await AuthManager.getInstance().refreshToken(refreshToken);
        res.status(200).send(token);
    } catch (e) {
        res.status(401).send('Your username or password is incorrect');
    }
});
router.get('/v1/getPermission',async (req, res) => {
    try {
        const {role} = req.query;
        const roleOfUser = await permissionManager.getInstance().getRoleByToken(req.headers.authorization);
        const hasPermit = role === roleOfUser;
        res.status(200).send(hasPermit);
    } catch (e) {
        res.status(401).send('Your username or password is incorrect');
    }
});

router.post('/v1/signup', async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    try {
        const statusCode = await AuthManager.getInstance().signUp(email, password, firstName, lastName);
        res.status(statusCode).send();
    } catch (e) {
        res.status(500).send(e);

    }
});

export default router;
