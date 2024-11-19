import express from 'express';
import {databaseManager} from "../managers/databaseManager.js";
import {BetsManager} from "../managers/betsManager.js";
const router = express.Router();

router.post('/v1/setBet',  async (req, res) => {
    const {teamA, teamB, dateTime, betName, communityId} = req.body;
    await BetsManager.getInstance().setBet(teamA, teamB, dateTime, betName, communityId);
    res.status(200).send();
});

router.post('/v1/setBetAsExpired', (req, res) => {
    const {id} = req.body;
    databaseManager.getInstance().updateBet(id, "expired", true)
    res.status(200).send();
});

router.post('/v1/manualWinUpdate', async (req, res) => {
    const {id, howWins} = req.body;
    await BetsManager.getInstance().updateBet(id, howWins);
    res.status(200).send();
});



export default router;
