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
import { DOMAIN } from '../keys'

import UserController from '../Controllers/user.controller'
import ProductController from '../Controllers/product.controller'
import OrderController from '../Controllers/order.controller'
import BasicController from '../Utils/Controllers/basic.controller'
import AuctionController from '../Controllers/auction.controller'
import RealtimeController from '../Controllers/realtime.controller'
import NotificationsController from '../Controllers/notification.controller'

import Product from '../Models/product.model'
import Notificatior from '../Services/Norifications/email.service'



export default class UserApi extends BasicController{

    constructor() {
        super();
    }

    Configure(){
        this.Get('/user/current',this.currentUser)
        this.Get('/verification/:uid',this.verify)
        this.Get('/user/products/search=:query', this.productSearch)
       
        this.Get('/user/signing/social/approval', this.socialApproval)
        this.Post('/user/signing/social/approval', this.socialVerify)

        this.Get('/user/orders/current', this.orders)
        this.Get('/user/orders/history', this.history)

        this.Get('/user/signin/google', this.signInGoogle)
        this.Get('/user/signin/facebook', this.signInFacebook)

        this.Get('/user/notifications/new', this.newNotifications)
        this.Post('/user/notifications/review', this.reviewNotifications)

        this.Post('/user/orders/cart', this.loadCart)

        this.Post('/user/signout', this.signOut)
        this.Post('/user/signup', this.signUp)
        this.Post('/user/signin', this.signIn)
             
        this.Post('/user/password/request', this.requestPassword)
        this.Post('/user/password/reset', this.resetPassword)

        this.Post('/user/product/type', this.productType)
    }

    protected signInGoogle(req,res,next){     
        if(req.query['seller']=='true'){
            req.session.seller = true;
        }
        
        return !req.isAuthenticated() ?
             passport.authenticate('google',{ scope: ['profile','email'] })(req,res,next) :
             res.redirect('/'); 
    }   

    protected signInFacebook(req,res,next){
        if(req.query['seller']=='true'){
            req.session.seller = true;
        }

        return !req.isAuthenticated() ?
            passport.authenticate('facebook')(req,res,next) :
            res.redirect('/'); 
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

    protected signUp(req,res): void {
        req.body.phone = `+${req.body.fphone}${req.body.lphone}`;

        var values = req.body;
        var avatar = req.files ? req.files.avatar : null;   

        var hasError : UserError   = validSignUp(values); 
        
        if(hasError.invalid){
            return res.send(BuildResponse(11, hasError.reason, undefined , hasError.reason ));
        }

        UserController.SignUp(values,avatar)
          .then( answer =>  answer.success ?
            res.send(BuildResponse(0,answer.result)) :
            res.send(BuildResponse(10,answer.error)) 
          )
    }     

    protected signOut(req,res): void {    
       if(req.user) 
            var uid = req.user.PublicData.uid;
       else 
            return res.send(BuildResponse(10,"No user for sign out"));

       req.session.destroy((err) => {         
           RealtimeController.Instance.emitExit(uid);
           res.send(BuildResponse(0, "Sign out completed successfully"));
       });
    }


    protected socialApproval(req,res): void{  
        if(req.session.seller == true) return res.redirect('/seller/signing/approval')
        if(!req.isAuthenticated()) return res.redirect('/')        
        if(req.user.isVerified()) return res.redirect('/')
        if(req.user.getProvider() == 'local') return res.redirect('/')
        
        return res.render('Users/approval', { 
            pageName : 'Approval', 
            domain : DOMAIN,
            user : req.user.Data,
            currentUser : req.user
        })        
    }

    protected socialVerify(req,res): void{
        if(!req.isAuthenticated()) 
            return res.send(BuildResponse(10,"No user for approval"))        
        
        if(req.user.isVerified()) 
            return res.send(BuildResponse(10,"User is already verified"))
        
        if(req.user.getProvider() == 'local') 
            return res.send(BuildResponse(10,"Provider isn't social"))


        req.body.phone = `+${req.body.fphone}${req.body.lphone}`
        UserController.SignVerify(req.user, req.body)
                      .then( answer => res.send( answer.success ? BuildResponse(0, 'Successfully verified') : BuildResponse(10, answer.error) ))
                      .catch( error => res.send(BuildResponse(10, 'Error occurred')));
    }



    protected verify(req,res) : void{
        UserController.VerifyUser(req.params.uid)
            .then( user =>  res.render('Actions/verification', {
                pageName : "Verification",
                name : user.firstName,
                isSeller : user.isSeller,
                domain : DOMAIN
            }))
            .catch( err => res.redirect('/'));
    }

    protected currentUser(req, res): void {
        isAuth(req, res).allowed(() => res.send(BuildResponse(0, "User successfully fetched", req.user.PublicData)));
    }

    protected productType(req,res) : void{
        isAuth(req,res).allowed(user => 
            ProductController.PublicStock(user,req.body)
                .then( answer => answer.success ?
                    res.send(BuildResponse(0,"Types were fetched", answer.result)) :
                    res.send(BuildResponse(10,"Error occurred", null)),
                )
        )
    }

    protected productSearch(req,res) : void{
        Database.Instance.productSearch.search(["prUid","prTitle","prCategory","prDescription","prTypes"], req.params.query)
            .then( result => 
                result.success ?                      
                  res.send( BuildResponse(0,"Search successfully finished",result.result) ) :
                  res.send( BuildResponse(10,"Error occurred",result.error) )
            )
       
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
                    browser : agent.toAgent(),
                    operating : agent.os.toString()
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

    protected createOrder(req,res) : void{
        isAuth(req,res).allowed( user => {
            
        });
    }

    protected newNotifications(req,res) : void{
        isAuth(req,res).allowed( user => 
            NotificationsController.LastNotifications(user)
                .then( notifications => res.send( BuildResponse(0,"Notifications successfully fetched", notifications ) ))
                .catch( error => res.send( BuildResponse(0,"Notifications successfully fetched", [] ) ))
        );
    }

    protected reviewNotifications(req,res) : void{
        isAuth(req,res).allowed( user => 
            NotificationsController.LastNotifications(user)
                .then( notifications => res.send( BuildResponse(0,"Notifications successfully fetched", notifications ) ))
                .catch( error => res.send( BuildResponse(0,"Notifications successfully fetched", [] ) ))
        );
    }
}