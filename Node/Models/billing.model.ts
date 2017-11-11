import * as uuid from 'uuid/v4'

import User from '../Models/user.model'
import { Percentage } from '../Utils/Others/currency'
import { OrderSchema, BillingSchema, WinningSchema, Database } from '../Database/database.controller'

interface SourceBilling{
    type : string,
    amount : number,
    fee : number,
    sellerId : string,
    sourceId : string
    itemId? : string
}

export default class Billing{

    public static ForceLoad(uuid : string) : Promise<any>{
        return BillingSchema.findOne({ where : { billingId : uuid} });
    }

    public static ConfirmOrder( user : User, order : string, billingId : string) : Promise<any>{
        return new Promise((resolve, reject) => {        
            OrderSchema.update(
                {
                    billingId : billingId
                }
                ,{
                    where : {
                        orderId : order,
                        customerId : user.Data.customerId
                    }
                }
            ).then( updates  => {
                if(updates[0] == 0){
                    reject("Invalid order id");
                }else{
                    resolve("Successfully updated");
                }                
            })
            .catch( err => reject(err));
            
        });
    }

    public static CreateSourceBilling(user : User, payload : SourceBilling) : Promise<any>{
        return BillingSchema.create({
            billingId : uuid(),            
            type : payload.type,
            fee : payload.fee,
            transactional_fee : Percentage(payload.amount,5),
            amount : payload.amount,
            itemId : payload.itemId,
            sellerId : payload.sellerId,
            sourceId : payload.sourceId,
            customerId : user.PublicData.uid
        });
    }


    public static BillingBySource(sourceId : string) : Promise<any>{
        return BillingSchema.findOne({
            where : { sourceId : sourceId }
        })
    }


    public static AssociatePayout( ids : Array<string>, payoutId : string) : Promise<any>{
        return BillingSchema.update({
             payoutId : payoutId
         },{
            where : { 
               billingId : { $in : ids }
            }
        })
    }

    public static FetchSellersPending(user : User){
        return BillingSchema.findAll({
            where : {
                sellerId :  user.PublicData.uid,
                chargeId : { $ne : null },
                available : false
            },
            attributes : ['billingId', 'amount', 'fee', 'available', 'chargeId', 'itemId', 'type', 'createdAt']
        });
    }

    public static FetchSellersAvailable(user : User){
        return BillingSchema.findAll({
            where : {
                sellerId :  user.PublicData.uid,
                chargeId : { $ne : null },
                payoutId : null,
                available : true
            },
            attributes : ['billingId', 'amount', 'fee', 'available', 'chargeId', 'itemId', 'type', 'createdAt']
        });
    }

    public static FetchSellersRequested(user : User, payoutId : string){
        return BillingSchema.findAll({
            where : {
                sellerId :  user.PublicData.uid,
                chargeId : { $ne : null },
                payoutId : payoutId,
                available : true
            },
            attributes : ['billingId', 'amount', 'fee', 'available', 'chargeId', 'itemId', 'type', 'createdAt']
        });
    }

}