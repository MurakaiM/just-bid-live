import Realtime from '../../Controllers/realtime.controller'
import AuctionStorage from './auction.storage'
import AuctionItem from '../../Models/auction.model'
import User from '../../Models/user.model'

import { AuctionSchema } from '../../Database/database.controller'
import TimeModule from '../../Utils/Others/time'

export default class AuctionLoader{
    public static Instace : AuctionLoader;
    private static ON_AUCTION : number = 50;
    private static INTERVAL : number = TimeModule.getSeconds(5);
   
    private Store : AuctionStorage; 
    private WaitingInterval : any;
    private CurrentItems : number;

    constructor(){
        this.Store = new AuctionStorage();
        this.CurrentItems = 0;
        AuctionLoader.Instace = this;     

    }
    
    public async StartLoop( number : number =  AuctionLoader.ON_AUCTION, firstLoad : boolean = true) : Promise<any>{
        let auctionItems = [];
       
        if(firstLoad)
            auctionItems = await AuctionItem.LoadFirst(number);
        else
            auctionItems = await AuctionItem.LoadState(number);

        this.CurrentItems += auctionItems.length;
        auctionItems.forEach( async element => { 
            const item = await this.Store.AddItem(element);
            item.ForceStart();
            
            if(!firstLoad){
                Realtime.Instance.emitNew(item.getPublic);
            }
        });
        return true;
    }

    private LoadNext() : void {
        AuctionItem.LoadNext()
            .then( item => this.Store.AddItem(item).ForceStart() )
            .catch( err => this.HandleExcept());
    }

    public HandleExcept() : void {
        this.WaitingInterval = setInterval( async () => {            
            let different = AuctionLoader.ON_AUCTION - this.CurrentItems;       
            
            if(different > 0)
                await this.StartLoop(different,false);        
                    
        }, AuctionLoader.INTERVAL);
    }


    public GetStore() : Array<any> {
        let map : Array<any> = [];
        this.Store.getItems().forEach( (item) => map.push(item.getPublic));    
        return map;
    }

    public PostBid(user : User, uid : string){    
        return this.Store.postBid(user,uid);
    }


    
    public FinishTrigger( uid : string) : void {
        var item : AuctionItem = this.Store.GetItem(uid);        
        this.Store.DeleteItem(uid);
        this.CurrentItems--;  
    }


}