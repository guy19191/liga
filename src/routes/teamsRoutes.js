import express from 'express';
import {databaseManager} from "../managers/databaseManager.js";
const router = express.Router();
router.get('/v1/getTeams', async (req, res) => {
    const {communityId} = req.query;
    const query = await databaseManager.getInstance().queryTeams(communityId)
    res.status(200).send(query.rows);
});

router.post('/v1/setTeam', (req, res) => {
    //Todo Handle Images
    const { name, image, communityId} = req.body;
    databaseManager.getInstance().insertTeam(name, image, communityId )
    res.status(200).send();
});

export default router;
