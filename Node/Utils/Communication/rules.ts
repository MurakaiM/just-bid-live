import { BuildResponse, RuleController } from "./response"


export function isAuth(req, res, render = false): RuleController {
    return new RuleController(async (resolve) => {
        if (req.isAuthenticated() && req.user.isVerified()) {
            return resolve(req.user);
        } else {
            if(req.isAuthenticated()){
                await req.session.destroy();
            }
                
            if(render)
                return res.redirect('/');
            else    
                return res.send(BuildResponse(10, "You are not authenticated to call this api"));
        }
    });
}

export function isSeller(req,res, render = false) {
    return new RuleController((resolve) => {        
        if (req.isAuthenticated() && req.user.isVerified() && req.user.isSeller()) {           
            return resolve(req.user);
        } else {

            if(render)
                return res.redirect('/');
            else    
                return res.send(BuildResponse(10, "You are not authenticated to call this api"));
        }
    });
}

export function isAdmin(req,res, renderer?) {
    return new RuleController((resolve) => {        
        if (req.isAuthenticated() && req.user.isVerified() && req.user.isAdmin()) {           
            return resolve(req.user);
        } else {
            if(renderer == true)
                return res.redirect('/')
            else
                return res.send(BuildResponse(10, "You are not authenticated to call this api"));
        }
    });
}

