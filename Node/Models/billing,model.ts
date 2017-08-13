import User from '../Models/user.model'
import { OrderSchema, BillingSchema } from '../Database/database.controller'


export default class Billing{

    constructor(){

    }

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

}