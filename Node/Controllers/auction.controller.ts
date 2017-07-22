import AuctionItem from '../Models/auction.model'

export default class AuctionController{
    
    constructor(){}

    public static CreateItem(data : any) : Promise<any>{
        return AuctionItem.ForceCreate(data);
    }

}