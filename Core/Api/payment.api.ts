import { isAuth, isSeller } from '../Utils/Communication/rules'
import { RESOURCES_PATH } from '../keys'

import Seller from '../Models/seller.model'
import StripeCharges from '../Payments/stripe.charges'

import BasicController from '../Utils/Controllers/basic.controller'
import PaymentController from '../Controllers/payment.controller'

export default class PaymentApi extends BasicController {

    Configure(){
        this.Post('/payment/charge', this.createCharge)

        this.Get('/payment/successfully', this.sucsPayment)
        this.Post('/seller/payout/request', this.payoutRequest)
    }

    protected payoutRequest(req,res){        
        isSeller(req,res, true).allowed(
            seller => PaymentController.fetchPayout(seller).then(answer => { 

                if(answer.error == 'Ooops, error occured' ||
                   answer.error == 'Already requested' || 
                   answer.error == 'Nothing to withdraw')
                   
                    return res.redirect('/seller/mystore')
                    
                let pageInfo = {
                    pageName : 'Withdrawal',
                    currentUser : seller,
                    login : false,
                    resources :  RESOURCES_PATH,
                    answer 
                }

                return res.render('Sellers/payout',pageInfo);        
            })    
        )
    }

    protected createCharge(req,res){ 
        isAuth(req,res).allowed( user => 
            PaymentController
                .CreateWinning(user, req.body, req.session.lastPayment)
                .then(answer =>  answer.success ? res.redirect(answer.result) : console.log(answer))
        );
    }

    protected sucsPayment(req,res){
        let sourceId = req.query['source'];

        if(!sourceId){
            return res.redirect('/');
        }

        var pageInfo = {
            pageName : "Successful payment",
            currentUser : req.user,
            resources :  RESOURCES_PATH,   
            login : false        
        };

        isAuth(req,res).allowed( user => 
            PaymentController.fetchItemByLink(user, sourceId)
                .then(answer => {
                    pageInfo['item'] = answer.result;   
                
                    return answer.success ? res.render('Payment/success', pageInfo ) : res.redirect('/')
                })
        )
    }

}