import User from '../../Models/user.model'
import AuctionItem from '../../Models/auction.model'


export default class AuctionStorage{
    private storage : Map<string,AuctionItem>;
    

    constructor(){
        this.storage = new Map<string,AuctionItem>();        
    }

    get Storage(){
        return this.storage;
    }

    public AddItem(data : any) : AuctionItem {    
       var auctionItem : AuctionItem = new AuctionItem().ForceLoad(data);

       this.storage.set( data.uidRecord, auctionItem);     
       return auctionItem;
    }

    public GetItem(data : any) : AuctionItem {
        return this.storage.get(data);
    }

    public DeleteItem( uidRecord : string){      
       this.storage.delete(uidRecord); 
    }

    public getItems() : Map<string,AuctionItem> {
        return this.storage;
    }

    public postBid( user : User, uidRecord : string ) : Promise<any>{
        var item : AuctionItem = this.storage.get(uidRecord);
      
        return new Promise((resolve, reject) => {
            if(!item) {
                reject("Wrong auction item id");
            }
            
            item.placeBid(user).then( result => resolve("Product updated")).catch( err => reject(err));                          
        });
    }
}