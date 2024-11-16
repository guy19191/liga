import express from 'express';
import {LigaUsersManager} from "../managers/ligaUsersManager.js";
const router = express.Router();

router.get('/v1/getUser',async (req, res) => {
    try {
        const userData = await LigaUsersManager.getInstance().getUser(req.headers.authorization);
        res.status(200).send(userData);
    } catch (e) {
        res.status(500).send('Error accrued while getting user data');
    }
});

router.post('/v1/createUser',async (req, res) => {
    try {
       const {nickname, league} = req.body
        await LigaUsersManager.getInstance().createUser(nickname, league, req.headers.authorization);
        res.status(200).send();
    } catch (e) {
        res.status(500).send(e);
    }
});

export default router;
