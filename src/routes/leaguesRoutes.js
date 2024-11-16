import {databaseManager} from "../managers/databaseManager.js";
import express from "express";
import {LeagueManager} from "../managers/leagueManager.js";
const router = express.Router();

router.get('/v1/getAllLeagues',async (req, res) => {
    try {
        const leagues = await LeagueManager.getInstance().getAllLeagues();
        res.status(200).send(leagues);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/v1/insertLeague',async (req, res) => {
    try {
        const {leagueName} = req.body;
        await LeagueManager.getInstance().insertLeague(leagueName);
        res.status(200).send(leagues);
    } catch (e) {
        res.status(500).send(e);
    }
});


router.get('/v1/getUserLeague',async (req, res) => {
    try {
        const league = await LeagueManager.getInstance().getUserLeague(req.headers.authorization);
        res.status(200).send(league);
    } catch (e) {
        res.status(500).send(e);
    }
});
export default router;
