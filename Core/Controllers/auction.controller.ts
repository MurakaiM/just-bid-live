import { validAuctionPay } from '../Utils/Others/validator'
import { AwaitResult } from '../Utils/Communication/async'

import AuctionItem from '../Models/auction.model'

import Winning from '../Models/winning.model'
import Billing from '../Models/billing.model'
import User from '../Models/user.model'

export default class AuctionController{
   
    public static CreateItem(user : User , data : any) : Promise<any>{
        return AuctionItem.ForceCreate(user,data);
    }
    
}