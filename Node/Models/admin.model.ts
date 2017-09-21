import { BillingSchema } from '../Database/database.controller'
import { AwaitResult } from '../Utils/Communication/async'


import Merchant from '../Payments/merchant'


export default class Admin {
 
    public static async ReleasePayout(payout_id : any) : Promise<AwaitResult>{
        try{
            let approval : any = await Merchant.Instance.ReleaseFromEscrow(payout_id);
            await BillingSchema.update({ status : "approved by service"}, { where : {payoutId : payout_id }});
    
            return { success : true, result : approval }             
        }catch(error){
            return { success : false, error }
        }
    }


}