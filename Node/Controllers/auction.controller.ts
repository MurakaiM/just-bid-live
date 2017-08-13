import AuctionItem from '../Models/auction.model'
import User from '../Models/user.model'

export default class AuctionController{
    
    constructor(){}

    public static CreateItem(user : User , data : any) : Promise<any>{
        return AuctionItem.ForceCreate(user,data);
    }

}