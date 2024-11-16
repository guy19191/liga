import express, {json, urlencoded} from 'express';
const PORT = process.env.PORT || 5000;
import cors from 'cors';
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from "./src/routes/authRoutes.js";
import betsManagerRoutes from "./src/routes/betsManagerRoutes.js";
import betsRoutes from "./src/routes/betsRoutes.js";
import leaguesRoutes from "./src/routes/leaguesRoutes.js";
import {setLocalEnvs, managerMiddleware, authMiddleware} from "./src/utils/index.js";
import teamsRoutes from "./src/routes/teamsRoutes.js";
import ligaUsersRoutes from "./src/routes/ligaUsersRoutes.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function run(){
    app.use(express.static(path.join(__dirname, 'src/client/build')));
    app.use(urlencoded({extended: true}));
    app.use(json({limit: '50mb'}))
    app.use(cors());

    app.use('/auth', authRoutes);
    app.use('/betsManager', managerMiddleware, betsManagerRoutes);
    app.use('/ligaUser', authMiddleware, ligaUsersRoutes);
    app.use('/bets', authMiddleware ,betsRoutes);
    app.use('/leagues', authMiddleware ,leaguesRoutes);
    app.use('/teams', authMiddleware, teamsRoutes);

    process.env.DEVELOPMENT && setLocalEnvs();
// Handle requests for routes not handled by static files
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'src/client/build', 'index.html'));
    });
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

}
run();

