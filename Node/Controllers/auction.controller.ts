import { validAuctionPay } from '../Utils/Others/validator'
import { AwaitResult } from '../Utils/Communication/async'

import AuctionItem from '../Models/auction.model'
import Customer from '../Payments/customer'

import Winning from '../Models/winning.model'
import Billing from '../Models/billing,model'
import User from '../Models/user.model'

export default class AuctionController{
   
    public static CreateItem(user : User , data : any) : Promise<any>{
        return AuctionItem.ForceCreate(user,data);
    }

    public static async PayItem(user : User , data : any) : Promise<AwaitResult>{
        try{            
            let hasError = validAuctionPay(data);

            if(data.hasError)
                return { success : false, error : hasError.reason }
            
            let winning = await Winning.FindWinning(data.winningId)

            if(winning == null)
                return { success : false, error : "No winning item is provided" }
            
            
            let transaction = await Customer.Instance.AuctionSale(winning.lastBid, data.nonce, data.winningId, winning.selectedType);
            
            if(!transaction.success) 
                return { success : false , error : "Transaction creation failed" }
        

            let billing = await Billing.CreateAuctionBilling(winning.winningId, winning.sellerId, winning.userId, transaction.result)

            winning.billingId = billing.billingId;
            
            await winning.save()

            return { success : true, result : "Auction item was successfully paid."}
        }catch(error){
            return { success : false , error : "Error occurred" }
        }
    }
    
}