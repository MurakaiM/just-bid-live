import * as passport from 'passport'

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

import UserController from '../Controllers/user.controller'
import BasicController from '../Utils/Controllers/basic.controller'
import AuctionController from '../Controllers/auction.controller'

import Product from '../Models/product.model'


export default class UserApi extends BasicController{
    constructor() {
        super();
    }

    Configure(){
        this.Get('/user/current',this.currentUser);

        
        this.Post('/user/signout', this.signOut);
        this.Post('/user/signup', this.signUp);
        this.Post('/user/signin', this.signIn);
       
        this.Post('/user/password/request', this.requestPassword);
        this.Post('/user/password/reset', this.resetPassword);

        this.Post('/user/product/new', this.createProduct);

        this.Post('/user/auction/new', this.createAuction);
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
       req.session.destroy((err) => {         
           res.send(BuildResponse(0, "Sign out completed successfully"));
       });
    }

    protected currentUser(req, res): void {
        isAuth(req, res).allowed(() => res.send(BuildResponse(0, "User successfully fetched", req.user.PublicData)));
    }

    protected requestPassword(req,res) : void {
        var values = req.body;
        var hasError : UserError =  validRequestPassword(values);

        if(hasError.invalid) return res.send(BuildResponse(11,"Invalid input values", undefined, hasError.reason));
        UserController.RequestPassword(values.email)
            .then( result => res.send(BuildResponse(0,"You successfuly requested password rest")))
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

    protected createProduct(req,res) : void{
       isSeller(req,res).allowed( () => {
           
            Product.ForceCreate({
                prTitle : 'iphone',
                prDescription : 'white',
                prSeller : "0fe98399-b1df-404c-95db-eeebf9e84da0",
                prCategory : {},
                prCost : 99           
            })
                .then( result => res.send( BuildResponse(0,"Product was successfully created") ))
                .catch( error => res.send( BuildResponse(10,"Error occurred",error) ))

       });
    }

    protected createAuction(req,res) : void{
        isSeller(req,res).allowed( () => {
            var hasError = validAuction(req.body);

            if(hasError.invalid) return res.send( BuildResponse(11,"Wrong input values"));
                
            AuctionController.CreateItem(req.body) 
                 .then( result => res.send( BuildResponse(0,"Auction item was successfully created") ))
                 .catch( error => res.send( BuildResponse(10,"Error occurred",error) ))
                 
        });
    }

}