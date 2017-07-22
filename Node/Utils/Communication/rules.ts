import { BuildResponse, RuleController } from "./response"


export function isAuth(req, res): RuleController {
    return new RuleController((resolve) => {
        if (req.isAuthenticated() && req.user.isVerified()) {
            return resolve(req.user);
        } else {
            return res.send(BuildResponse(10, "You are not authenticated to call this api"));
        }
    });
}

export function isSeller(req,res) {
    return new RuleController((resolve) => {
        if (req.isAuthenticated() && req.user.isVerified() && req.user.isSeller()) {
            return resolve(req.user);
        } else {
            return res.send(BuildResponse(10, "You are not authenticated to call this api"));
        }
    });
}

export function isAdmin() {

}