import * as passport from 'passport'
import * as useragent from 'useragent'

import { 
        validSignUp, 
        validRequestPassword, 
        validResetPassword, 
        validSingIn, 
        validAuction,
         UserError 
} from '../Utils/Others/validator'


import { Response , BuildResponse } from '../Utils/Communication/response'
import { isAuth, isSeller }  from '../Utils/Communication/rules'
import { Database } from '../Database/database.controller'

import UserController from '../Controllers/user.controller'
import ProductController from '../Controllers/product.controller'
import OrderController from '../Controllers/order.controller'
import BasicController from '../Utils/Controllers/basic.controller'
import AuctionController from '../Controllers/auction.controller'
import RealtimeController from '../Controllers/realtime.controller'

import Product from '../Models/product.model'
import Notificatior from '../Services/Norifications/email.service'

export default class UserApi extends BasicController{
    constructor() {
        super();
    }

    Configure(){
        this.Get('/user/current',this.currentUser);
        this.Get('/verification/:uid',this.verify);
        this.Get('/user/products/search=:query', this.productSearch);
      
        this.Get('/user/orders/current', this.orders);
        this.Get('/user/orders/history', this.history)
        this.Post('/user/orders/cart', this.loadCart)

        this.Post('/user/signout', this.signOut);
        this.Post('/user/signup', this.signUp);
        this.Post('/user/signin', this.signIn);
       

        this.Post('/user/password/request', this.requestPassword);
        this.Post('/user/password/reset', this.resetPassword);
    }


    protected productSearch(req,res) : void{
        Database.Instance.productSearch.search(["prTitle","prCategory","prDescription"], req.params.query)
            .then( result => res.send( BuildResponse(0,"Search successfully finished",result) ))
            .catch( error => res.send( BuildResponse(0,"Search finished with warnings",[]) ))
    }

    protected signIn(req, res, next): void {
        var hasError : UserError   = validSingIn(req.body);
        
        if(hasError.invalid){
           return res.send(BuildResponse(11,"Invalid input values", undefined , hasError.reason ));
        }

        passport.authenticate('local', function (err, user, info) {
            if (err) return res.send(BuildResponse(10, err , null));

            req.logIn(user,(err) => {
                if (err) {
                    return next(err);
                }

                return res.send(BuildResponse(0,"You successfully signed in", user.PublicData));                
            });

        })(req, res, next);
    }

    protected signUp(req,res) : void {
        var values = req.body;
        var avatar = req.files ? req.files.avatar : null;   

        var hasError : UserError   = validSignUp(values);

        if(hasError.invalid){
            return res.send(BuildResponse(11,"Invalid input values", undefined , hasError.reason ));
        }


        UserController.SignUp(values,avatar)
          .then( msg => res.send(BuildResponse(0,msg.reason)))
          .catch( msg => res.send(BuildResponse(10,msg.reason)));
    }

    protected signOut(req,res) : void{    
       if(req.user) 
            var uid = req.user.PublicData.uid;
       else 
            return res.send(BuildResponse(10,"No user for sign out"));

       req.session.destroy((err) => {         
           RealtimeController.Instance.emitExit(uid);
           res.send(BuildResponse(0, "Sign out completed successfully"));
       });
    }

    protected verify(req,res) : void{
        UserController.VerifyUser(req.params.uid)
            .then( user => {
                const pageInfo = {
                    pageName : "Verification",
                    name : user.firstName,
                    isSeller : user.isSeller
                };

                res.render('Actions/verification', pageInfo)
            })
            .catch( err => res.redirect('/'));
    }

    protected currentUser(req, res): void {
        isAuth(req, res).allowed(() => res.send(BuildResponse(0, "User successfully fetched", req.user.PublicData)));
    }

    protected requestPassword(req,res) : void {
        var values = req.body;
        var hasError : UserError =  validRequestPassword(values);
        var agent = useragent.parse(req.headers['user-agent']);
        
        if(hasError.invalid) return res.send(BuildResponse(11,"Invalid input values", undefined, hasError.reason));
        UserController.RequestPassword(values.email)
            .then( user => {          
                Notificatior.Instance.sendPasswordreset({
                    name : user.firstName,
                    link : user.password_link,
                    email : user.email,
                    browser : "",
                    operating : ""
                });
                res.send(BuildResponse(0,"You successfuly requested password rest"))
            })
            .catch( error => res.send(BuildResponse(11,"Something went wrong")));
        

    }

    protected resetPassword(req,res) : void{
        var values = req.body;    
        var hasError : UserError =  validResetPassword(values);
        
        if(hasError.invalid) return res.send(BuildResponse(11,"Invalid input values", undefined, hasError.reason));

        UserController.ResetPassword(values)
            .then( result => res.send(BuildResponse(0,"You successfuly reset password")) )
            .catch( error => res.send(BuildResponse(11,error)));

    }

    protected orders(req,res) : void{
        isAuth(req,res).allowed( user => {
            OrderController.CustomerOrders(user)
                .then( orders => res.send(BuildResponse(0,"Orders successfully fetched",orders)) )
                .catch( err => res.send(BuildResponse(10,"Error occurred")) );
        });
    }

    protected history(req,res) : void{
        isAuth(req,res).allowed( user => {
            OrderController.CustomerHistory(user)
                .then( orders => res.send(BuildResponse(0,"Orders successfully fetched",orders)) )
                .catch( err => res.send(BuildResponse(10,"Error occurred")) );
        });
    }

    protected loadCart(req,res) : void{
        ProductController.LoadCart(req.body.cart)
            .then( items => res.send( BuildResponse(0,"Cart was successfully loaded",items) ))
            .catch( error => {console.log(error); res.send( BuildResponse(10,error) ) })
    }
}