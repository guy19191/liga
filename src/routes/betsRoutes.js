import express from 'express';
import {databaseManager} from "../managers/databaseManager.js";
import {BetsManager} from "../managers/betsManager.js";
const router = express.Router();
router.get('/v1/getBets', async (req, res) => {
    try {
        const {communityId} = req.query;
        const query = await BetsManager.getInstance().getBets(communityId)
        res.status(200).send(query);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/v1/getUserBets', async (req, res) => {
    try {
        const {communityId} = req.query;
        const query = await BetsManager.getInstance().getUserBets(communityId,  req.headers.authorization)
        res.status(200).send(query);
    } catch (e) {
        res.status(500)
    }
});

router.post('/v1/setBet', async (req, res) => {
    try {
        const {id, points, team} = req.body;
        await BetsManager.getInstance().setUserBets(id, points, team, req.headers.authorization);
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});


router.get('/v1/getUserExpiredBets', async (req, res) => {
        try {
            const query = await databaseManager.getInstance().queryBets(communityId)
            res.status(200).send(query.rows);
        } catch (e) {
            res.status(500).send();
        }

});


export default router;
