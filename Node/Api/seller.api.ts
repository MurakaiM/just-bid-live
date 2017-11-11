import * as passport from 'passport'

import { validAuction } from '../Utils/Others/validator'
import { Fees } from '../Database/database.categories'
import { DOMAIN } from '../keys'

import { Response , BuildResponse } from '../Utils/Communication/response'
import { isSeller }  from '../Utils/Communication/rules'

import UserController from '../Controllers/user.controller'
import ProductController from '../Controllers/product.controller'
import OrderController from '../Controllers/order.controller'
import WinningController from '../Controllers/winning.controller'
import BasicController from '../Utils/Controllers/basic.controller'
import AuctionController from '../Controllers/auction.controller'
import RealtimeController from '../Controllers/realtime.controller'
import SellerController from '../Controllers/seller.controller'
import PaymentController from '../Controllers/payment.controller'

import Product from '../Models/product.model'

export default class SellerApi extends BasicController{
    constructor() {
        super();
    }

    Configure(){    
        this.Get('/seller/product/all', this.getProducts)
        this.Get('/seller/winning/all', this.getWinning)
        this.Get('/seller/product/disabled', this.getDisabled)

        this.Get('/seller/store/personal', this.getPersonal)
        this.Get('/seller/store/statistics', this.getStatistics)
        this.Get('/seller/store/payouts', this.getPayouts)
        this.Get('/seller/categories/search=:query', this.searchCategory)
        this.Get('/seller/fees', this.getFees)
    
        this.Get('/seller/auction/all', this.getAuctions)
        this.Post('/seller/signup', this.signUp)
        
        this.Post('/seller/product/types', this.getType)
        this.Post('/seller/product/stocks', this.getStock)
        this.Post('/seller/product/typesout', this.disableType)
        this.Post('/seller/product/create', this.createProduct)
        this.Post('/seller/product/stock', this.updateStock)      
        this.Post('/seller/product/delete', this.deleteProduct)   
        this.Post('/seller/product/renew', this.renewProduct)
        this.Post('/seller/product/remove', this.removeProduct)
        
        this.Post('/seller/payout/paypal/update', this.updatePaypal)
        this.Post('/seller/avatar/update', this.updateAvatar)
        this.Post('/seller/information/update', this.updatePersonal)


        //this.Post('/seller/winning/status', this.winningStatus) 
        this.Post('/seller/winning/track', this.winningTrack)    
        this.Post('/seller/winning/especial', this.winningEspecial)    

        this.Post('/seller/auction/create', this.createAuction)
        this.Post('/seller/auction/stock', this.stockAuction)
        this.Post('/seller/auction/pause', this.pauseAuction)

        /* External sign in */
        this.Get('/seller/signing/social/approval', this.externalApprove)
        this.Post('/seller/signing/social/approval', this.externalVerify)
    }

    /* External login */
    protected externalApprove(req,res){      
        if(!req.session.seller) return res.redirect('/user/signing/social/approval')
        if(!req.isAuthenticated()) return res.redirect('/')        
        if(req.user.isVerified()) return res.redirect('/')
        if(req.user.getProvider() == 'local') return res.redirect('/')

        return res.render('Sellers/approval', { 
            pageName : 'Approval', 
            domain : DOMAIN,
            user : req.user.Data,
            currentUser : req.user.Data
        })    
    }   

    protected externalVerify(req,res){
        if(!req.session.seller)
            return res.send(BuildResponse(10,"Not valid sign in type"))
        
        if(!req.isAuthenticated()) 
            return res.send(BuildResponse(10,"No user for approval"))        
    
        if(req.user.isVerified()) 
            return res.send(BuildResponse(10,"User is already verified"))
        
        if(req.user.getProvider() == 'local') 
            return res.send(BuildResponse(10,"Provider isn't social"))


        req.body.phone = `+${req.body.fphone}${req.body.lphone}`

        SellerController.SocialSignUp(req.user, req.body, req.files.userAvatar, req.files.storeAvatar)
                        .then(result => res.send( BuildResponse(0,"User was successfuly created") ))
                        .catch(error => res.send( BuildResponse(10,error) ))
    }


    /*Payouts*/
    protected getPayouts(req,res) : void{
        isSeller(req,res).allowed( seller => 
            PaymentController.fetchSellerPayout(seller)
                .then(answer => res.send( BuildResponse(0,"Payouts successfully fetched", answer) ))
                .catch(error => res.send( BuildResponse(10,"Error occurred") ))
        );
    }

    protected updatePaypal(req,res) : void{
        isSeller(req,res).allowed( seller => 
            SellerController.UpdatePaypal(seller,req.body)
                .then(answer => res.send( BuildResponse(0,"Paypal Email successfully updated", answer) ))
                .catch(error => res.send( BuildResponse(10,error) ))
        )
    }


    /* Store information */    
    protected updateAvatar(req,res) : void{
        isSeller(req,res).allowed( seller => 
            SellerController.UpdateAvatar(seller,req.files.avatar)
                .then( 
                    answer => answer.success ? 
                        res.send(BuildResponse(0,answer.result)) :
                        res.send(BuildResponse(10,answer.error))
                )  
        )
    }

    protected updatePersonal(req,res) : void{
        isSeller(req,res).allowed(seller => 
            SellerController.UpdatePersonal(seller, req.body)
                .then( 
                    answer => answer.success ? 
                        res.send(BuildResponse(0,answer.result)) :
                        res.send(BuildResponse(10,answer.error))
                )                
        )
    }


    /*Winnings*/
    protected getWinning(req,res) : void {
        isSeller(req,res).allowed( seller => 
            WinningController.SellerWinnings(seller)
                .then(result => res.send( BuildResponse(0,"Winnings were successfully fetched", result ) ))
                .catch(error => { console.log(error); res.send( BuildResponse(10,"Error occurred", []) ) })
        )
    }

    protected winningStatus(req,res) : void{
        isSeller(req,res).allowed(seller => 
            WinningController.UpdateStatus(seller, req.body)
                .then( answer => 
                  answer.success ? 
                  res.send(BuildResponse(10,answer.result)):
                  res.send(BuildResponse(0,answer.error))
                )
        )
    }

    protected winningTrack(req,res) : void{
        isSeller(req,res).allowed(seller => 
            WinningController.UpdateTrack(seller, req.body)
                .then( answer => 
                  answer.success ? 
                  res.send(BuildResponse(0,'Track number was successfully updated',req.body.track)):
                  res.send(BuildResponse(10,answer.error))
                )
        )
    }
    
    protected winningEspecial(req,res) : void{
        isSeller(req,res).allowed(seller => 
            WinningController.EspecialWinning(seller, req.body).then(answer => 
               answer.success ? 
                res.send(BuildResponse(0,'Successfuly fetched especial',answer.result)):
                res.send(BuildResponse(10,'Successfuly fetched especial',answer.error))
            )               
        )
    }


    /*Others*/
    protected getPersonal(req,res) : void{
        isSeller(req,res).allowed( seller => 
            SellerController.GetSeller(seller)
                .then( sl => res.send( BuildResponse(0,"Seller info was successfully fetched",sl) ))
                .catch( er => res.send( BuildResponse(10,"Error occurred")) )    
        );
    }

    protected getFees(req,res) : void {
        isSeller(req,res).allowed( user => res.send(Fees));
    }

    protected getStock(req,res) : void{        
        isSeller(req,res).allowed( user => 
            ProductController.GetStock(user,req.body)
                .then( result => { console.log(result); res.send( BuildResponse(0,"Product stocks were successfully fetched",result)) })
                .catch( error => res.send( BuildResponse(10,error)))
        );
    }

    protected stockAuction(req,res) : void {
        isSeller(req,res).allowed( user => {     
            SellerController.StockAuction(user,req.body)
                .then( result => res.send( BuildResponse(0,"Auction items was successfully fetched",result)) )
                .catch( error => res.send( BuildResponse(10,error)) ); 
        });
    }

    protected pauseAuction(req,res) : void {
        isSeller(req,res).allowed( user => {     
            SellerController.PauseAuction(user,req.body)
                .then( result => res.send( BuildResponse(0,"Auction item was successfully updated",result)) )
                .catch( error => res.send( BuildResponse(10,error)) ); 
        });
    }


    protected getAuctions(req,res) : void{
        isSeller(req,res).allowed( user => {     
            SellerController.GetAuctions(user)
                .then( result => res.send( BuildResponse(0,"Auction items were successfully fetched",result)) )
                .catch( error => res.send( BuildResponse(10,error)) ); 
        });
    }

    protected getStatistics(req,res) : void {
        isSeller(req,res).allowed( user => {     
            SellerController.GetStatistics(user)
                .then( result => res.send( BuildResponse(0,"Store was successfully fetched",result)) )
                .catch( error => res.send( BuildResponse(10,error)) ); 
        });
    }

    protected createProduct(req,res) : void{         
        isSeller(req,res).allowed( user => {  
            ProductController.CreateProduct(user, req.body,req.files)
                .then( result =>{
                        console.log(result);
                        if(result.succ)
                            return res.send( BuildResponse(0,"Product was successfully created",result.product)) 
                        else
                            return res.send( BuildResponse(10,result.err))
                })                
        });
    }
 
    protected createAuction(req,res) : void{
         isSeller(req,res).allowed( user => {            
             var hasError = validAuction(req.body);
 
             if(hasError.invalid) return res.send( BuildResponse(11,hasError.reason));
                 
             AuctionController.CreateItem(user, req.body) 
                  .then( result => res.send( BuildResponse(0,"Auction item was successfully created") ))
                  .catch( error => res.send( BuildResponse(10,error,error)))
                  
         });
    }

    protected updateStock(req,res) : void{    
        isSeller(req,res).allowed( user => {
            ProductController.UpdateStock(user, req.body)
                .then( product => res.send(BuildResponse(0,"Product stock number was successfully updated",product)) )
                .catch( error => res.send(BuildResponse(10,error)) );
        });
    }

    protected getType(req,res) : void{
        isSeller(req,res).allowed( user => {
            ProductController.GetType(user, req.body)
                .then( result => res.send(BuildResponse(0,"Product types were successfully fetched", result)) )
                .catch( error => res.send(BuildResponse(10,"Error occurred")));
        });
    }

    protected disableType(req,res) : void{
        isSeller(req,res).allowed( user => {
            ProductController.DisableType(user, req.body)
                .then( result => res.send( BuildResponse(0,"Successfully updated")) )
                .catch( error => res.send( BuildResponse(10,error)))
        });      
    }

    protected signUp(req,res) : void{
        SellerController.SignUp(req.body, req.files.userAvatar, req.files.storeAvatar)
            .then( result => res.send( BuildResponse(0,"User was successfuly created")) )
            .catch( error => res.send( BuildResponse(10, error)))
    }

    protected getProducts(req,res) : void{
        isSeller(req,res).allowed( user => {
            SellerController.GetProducts(user)
                .then( result => res.send( BuildResponse(0,"Successfully fetched", result)) )
                .catch( error => res.send( BuildResponse(10,"Error occurred")))
        });    
    }

    protected getDisabled(req,res) : void{
        isSeller(req,res).allowed( user => {
            SellerController.GetDisabled(user)
                .then( result => res.send( BuildResponse(0,"Successfully fetched", result)) )
                .catch( error => res.send( BuildResponse(10,"Error occurred")))
        });  
    }

    protected searchCategory(req,res) : void{
        isSeller(req,res).allowed( user => res.send( BuildResponse(0,"Successfully fetched", SellerController.CategorySearch(req.params.query)) ));   
    }

    protected deleteProduct(req,res) : void {
        isSeller(req,res).allowed( user => {
            SellerController.DeleteProduct(user, req.body)
                .then( result => res.send( BuildResponse(0,"Successfully deleted")) )
                .catch( error => res.send( BuildResponse(10,"Error occurred")))
        });
    }

    protected removeProduct(req,res) : void {
        isSeller(req,res).allowed( user => {
            SellerController.RemoveProduct(user, req.body)
                .then( result => res.send( BuildResponse(0,"Successfully renewed")) )
                .catch( error => res.send( BuildResponse(10,"Error occurred", null, error)))
        });
    }

    protected renewProduct(req,res) : void{
        isSeller(req,res).allowed( user => {
            SellerController.RenewProduct(user, req.body)
                .then( result => res.send( BuildResponse(0,"Successfully renewed")) )
                .catch( error => res.send( BuildResponse(10,"Error occurred")))
        });
    }


    protected sellerSignout(req,res) : void{
        if(req.user) 
            var uid = req.user.PublicData.uid;
       else 
            return res.redirect('/');

       req.session.destroy((err) => {      
           console.log(err);   
           RealtimeController.Instance.emitExit(uid);
           return res.redirect('/seller/signin');
       });
    }
}
