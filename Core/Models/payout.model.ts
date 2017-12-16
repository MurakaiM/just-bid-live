import * as uuid from 'uuid/v4'

import { PayoutSchema, BillingSchema, UserSchema, SellerSchema } from '../Database/database.controller'

import User from './user.model'

export default class Payout {
    
    public static RequestPayout( seller : User, amount : number, fee : number, transactional_fee : number ) : Promise<any>{
        return PayoutSchema.create({
            payoutId : uuid(),
            sellerId : seller.PublicData.uid,
            status : 'Waiting for review',
            transactional_fee,
            amount,
            fee
        });
    }

    public static UpdatePayoutStatus( payoutId : string, status : string ): Promise<any>{
        return PayoutSchema.update({ status
         },{
          where : { payoutId : payoutId }  
        });
    }


    public static FetchRequest( payoutId : string ){
        return PayoutSchema.findOne({
            attributes : ['payoutId','amount','fee','createdAt','status'],
            where : { payoutId : payoutId },
            include : [
                { model : UserSchema, as : 'requestor', include : { model : SellerSchema, as : 'seller' } },
                { model : BillingSchema, as : 'billings', include : { model : UserSchema , as : 'customer'} }                
            ]           
        });
    }


    public static FetchNewPayouts(){
        return PayoutSchema.findAll({
            attributes : ['payoutId','amount','fee','createdAt','status'],
            where : { 
                payingId : null,
                status : 'Waiting for review'               
            },
            include : [{ model : UserSchema, as : 'requestor', attributes: ['firstName','lastName'] }]           
        });
    }

    public static FetchProgressPayouts(){
        return PayoutSchema.findAll({
            attributes : ['payoutId','amount','fee','createdAt','status'],
            where : { 
                payingId : null,
                status : { 
                    $and : [
                        { $ne : 'Paid' },
                        { $ne : 'Waiting for review' }
                    ]
                 }             
            },
            include : [{ model : UserSchema, as : 'requestor', attributes: ['firstName','lastName'] }]           
        });
    }

    public static FetchFinishedPayouts(){
        return PayoutSchema.findAll({
            attributes : ['payoutId','amount','fee','createdAt','status'],
            where : { 
                payingId : null,
                status : 'Paid'               
            },
            include : [{ model : UserSchema, as : 'requestor', attributes: ['firstName','lastName'] }]           
        });
    }

}