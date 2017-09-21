import * as uuid from 'uuid/v4'

import User from '../Models/user.model'
import { OrderSchema, BillingSchema } from '../Database/database.controller'


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

    public static CreateAuctionBilling(item : string, seller : string, user : string,  transation : any ) : Promise<any>{
        return BillingSchema.create({
            billingId : uuid(),
            itemId : item,
            sellerId : seller,
            customerId : user,
            paymentId : transation.id,
            paymentStatus : transation.status,
            amount : parseFloat( parseFloat(transation.amount).toFixed(2) ), 
            status : 'created',
            type : 'auction winning'
        });
    } 

}