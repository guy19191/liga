import {AuthManager} from "../managers/authManager.js";
import {permissionManager} from "../managers/permissionManager.js";

async function authMiddleware(req, res, next){
    try{
        await AuthManager.getInstance().checkToken(req.headers.authorization);
        next();
    } catch (e) {
        res.status(401).send(e);
    }
}

async function managerMiddleware(req,res,next){
    try {
        const role = await permissionManager.getInstance().getRoleByToken(req.headers.authorization);
        if (role === 'manager')
            next();
        else
            throw "Role is not manager"

    }catch (e) {
    throw "Could not authenticate request"
}
}

export {authMiddleware, managerMiddleware}