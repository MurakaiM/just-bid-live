import * as uuid from 'uuid/v4'

import { AwaitResult } from '../Utils/Communication/async'
import { getWinningFee } from '../Database/database.categories' 

import User from '../Models/user.model'
import Type from '../Models/type.model'
import Payout from '../Models/payout.model'
import Winning from '../Models/winning.model'
import Seller from '../Models/seller.model'
import Billing from '../Models/billing.model'
import Notifications from '../Controllers/notification.controller'

import StripeCharges from '../Payments/stripe.charges'
import RealtimeController from '../Controllers/realtime.controller'
import SellerController from '../Controllers/seller.controller'

export default class PaymentController{
    /**
     * Types declaration - 
     * orderId - 0 
     * winningId - 1
     */
   
    public static async CreateWinning(user : User, payload : any , wngId : string) : Promise<AwaitResult>{  
        //Write validation here

        try{
            let information : any = {};               
            Object.keys(payload).forEach(key => (key.indexOf('shipping') > -1? information[key] = payload[key]  : null))

            let winning = await Winning.FindWinning(user,wngId);      
                             
        
            if(!winning){
                return { success : false, error : "Wrong winning ID was provided"} 
            }

            if(winning.winnerId != user.PublicData.uid){
                return { success : false, error : "Only winner can pay for product"}
            }

            let type = await Type.FindType(winning.productId, (payload.color && payload.size) ? `${payload.color}|${payload.size}` : payload.color)
            let amount = (winning.lastBid) + (winning.product.prShipment * 100);
           
            if(!type){
                return { success : false, error : "Wrong type was provided"}
            }

            if(type.inStock <= 0){
                return { success : false, error : "Type out of stock, please choose another one"}
            }
          
            if(winning.product.prTypes.colors[payload.color].disable){
              return { success : false, error : "Wrong color type"} 
            }
           
            if(payload.size){
                if(winning.product.prTypes.sizes[payload.size].disable) return { success : false, error : "Wrong size type"} 
            }

            let application_fee = getWinningFee(winning);
            let { source, error } = await StripeCharges.Instance.CreateSource(user, (payload.stripeSecure != 'not_supported'),
             { 
                amount, 
                application_fee,
                card : payload.stripeSource,
                item : winning.winningId,
                type : 1
            } );
            
            if(error){
                return { success : false, error  }
            }

            let billing = await Billing.CreateSourceBilling(user, {
                amount : amount,
                fee : application_fee,
                type : 'auction winning',
                itemId : winning.winningId,
                sellerId : winning.sellerId,
                sourceId : source.id
            });

            winning.customerInformation = information;
            winning.billingId = billing.billingId;   
            winning.selectedTypeId = type.typeUid;
            
            await type.decrement('inStock');

            if(payload.stripeSecure == 'not_supported'){
                let { charge, error } = await StripeCharges.Instance.ChargeSource({ amount, source : payload.stripeSource }); 
                
                if(error){
                    await type.increment('inStock');
                    return { success : false, error  }
                }

                winning.status = "Paid";    
                billing.sourceId = charge.source.id;            
                billing.chargeId = charge.id;
            
                await billing.save();               
                await winning.save();

                await PaymentController.sendNotification(winning, charge);
                return { success : true, result : `/payment/successfully?source=${billing.sourceId}` }
            }else{      
                await winning.save();      
                return { success : true, result : source.redirect.url }
            }
        }catch(error){        
            console.log(error)
            return { success : false, error  }
        }
    }

    public static async WBChargeableWinning(payload : any) : Promise<AwaitResult>{
        try{        
            console.log(payload)
            let data = PaymentController.extractData(payload);

            if(!data){
                return { success : false, error : 'Data extraction failed' }
            }

            let billing = await Billing.BillingBySource(data.id);

            if(!billing){
                return { success : false, error : 'There is no related billing'}
            }

            let winning = await Winning.forPayment(data.metadata.item)

            if(!winning){
                return { success : false, error : 'Winning extraction failed' }            
            }

            let type = await Type.FindByUid(winning.selectedTypeId);
            if(!type){
                return { success : false, error : 'Wrong type id was provided'}
            }

            let amount = (winning.lastBid) + (winning.product.prShipment * 100);

            if(amount != data.amount){
                return { success : false, error : 'Mismatch in amount'}
            }

            let {charge,error} = await StripeCharges.Instance.ChargeSource({ amount, source : data.id });
           
            if(error){
                await type.increment('inStock');
                await PaymentController.sendWrongNotification(winning, { error_message : error.message });
                return { success : false, error }
            }

            winning.status = "Paid"
            
            billing.amount = amount;
            billing.chargeId = charge.id;

            
            await winning.save();
            await billing.save();

            await PaymentController.sendNotification(winning,data);

            return { success : true, result : "Saved"}            
        }catch(error){
            return { success : false, error }
        }

    }

    public static async fetchItemByLink(user : User, sourceId : string) : Promise<AwaitResult>{
        try{
            let billing = await Billing.BillingBySource(sourceId);

            if(!billing){
                return { success : false, error : 'There is no such billing' }
            }

            if(billing.customerId != user.PublicData.uid){
                return { success : false, error : 'Wrong user association' }
            }

            if(billing.type == 'auction winning'){            
                let item = await Winning.FindByBilling(billing.billingId);
                item.colorImage = item.type.typeId.split('|')[0];

                if(!item){
                    return { success : false , error : 'No associated item presented' }
                }

                return { success : true, result : item } 
            }else{
                //Notification for orders should be implemented here
            }            
        }catch(error){
            console.log(error)
            return { success : false, error }
        }
    }

    public static async fetchSellerPayout(seller : User) : Promise<AwaitResult>{
        try{
            let result = {};
            result['pending'] = await Billing.FetchSellersPending(seller);
            result['available'] = await Billing.FetchSellersAvailable(seller);
            result['requested'] = await Seller.PayoutRequested(seller);
            result['listed'] = [];
           
            if(result['requested'].requested)
                result['listed'] = await Billing.FetchSellersRequested(seller, result['requested'].payout.payoutId )

            return { success : true, result}
        }catch(error){
            console.log(error)
            throw Error(error)
        }
    } 


    /* Charges */
    public static async fetchPayout(seller : User) : Promise<AwaitResult>{
        try{
            let already = await Seller.PayoutRequested(seller);
            let available = await Billing.FetchSellersAvailable(seller)     
            let pSeller = await SellerController.GetSeller(seller)

            let overall = 0;
            let fee = 0;
            let transactional_fee = 0;

            let ids = await available.map( e => {
              transactional_fee+=e.transactional_fee;
              overall+= (e.amount - e.fee - e.transactional_fee);
              fee += e.fee;            
              return e.billingId 
            })

            if(!pSeller.paypalAccepted || !pSeller.paypalEmail){
                return { success : false, error : 'No email' }
            }

            if(new Date().getTime() < new Date(pSeller.paypalAccepted).getTime()){
                return { success : false, error : 'Pending email' }
            }            
            
            if(already.requested){
                return { success : false, error : 'Already requested'}
            }

            if(overall == 0){
                return { success : false, error : 'Nothing to withdraw' }
            }
         
            let payout = await Payout.RequestPayout(seller, overall, fee,transactional_fee);
            let updated = await Billing.AssociatePayout(ids, payout.payoutId);
            
            return { success : true, result : { overall, fee }}
        }catch(error){
            console.log(error)
            return { success : false, error : 'Ooops, error occured' }
        }
    }



    private static async sendNotification(winning : any, data : any ){
        let notification = await Notifications.TypePaid(winning.winnerId,{
                action : winning.winnerId,
                amount : data.amount,
                title : winning.product.prTitle
            });

        RealtimeController.Instance.emitNewNotification(winning.winnerId, notification)
    }

    private static async sendWrongNotification(winning : any, data : any){
        let notification = await Notifications.TypePaidError(winning.winnerId,{
            action : winning.winningId,      
            error_message : data.error_message,
            title : winning.product.prTitle
        });

        RealtimeController.Instance.emitNewNotification(winning.winnerId, notification)
    }


    /* Admin payouys approval */
    public static async getRequest(payoutId : string) : Promise<AwaitResult>{
        try {
            let request = await Payout.FetchRequest(payoutId)
            let charges = await Promise.all(request.billings.map(e => StripeCharges.Instance.RetrieveCharge(e.chargeId)));
            console.log(charges)
            return { success: true, result : { request,charges } }
        } catch (error) {
            return { success: false, error };
        }
    }

    public static async getRequestedPayouts() : Promise<any>{      
        try{
            
            let payouts = await Payout.FetchNewPayouts();
            return payouts ? payouts : []

        }catch(error){           
            return []
        }     
    }

    public static async getProgressPayouts() : Promise<any>{
        try{
            
            let payouts = await Payout.FetchProgressPayouts();
            return payouts ? payouts : []

        }catch(error){           
            return []
        }  
    }
    
    public static async getFinishedPayouts() : Promise<any>{
        try{
            
            let payouts = await Payout.FetchFinishedPayouts();
            return payouts ? payouts : []

        }catch(error){           
            return []
        }   
    }


    private static extractData(payload : any):any{    
        if(payload.data.object.status != 'chargeable')
            return null;

        return payload.data.object;
    }
}