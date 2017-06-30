import passport from 'passport'

import { Response , BuildResponse } from '../Utils/response'
import { isAuth}  from '../Utils/rules'


class UserApi {
    constructor() {}

    public static signIn(req, res, next): void {
        passport.authenticate('login', function (err, user, info) {
            if (err) return res.send(BuildResponse(10, err , null));

            req.logIn(user,(err) => {
                if (err) {
                    return next(err);
                }

                return res.send(BuildResponse(0,"You successfully signed in"), user.PublicData);                
            });

        })(req, res, next);
    }

    public static singUp(req,res) : void {
        var values = req.body;


    }

    public static currentUser(req, res): void {
        isAuth(req, res).allowed(() => res.send(BuildResponse(0, "User successfully fetched"), req.user.PublicData));
    }



}