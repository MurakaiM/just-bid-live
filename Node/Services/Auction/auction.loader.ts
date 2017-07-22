import Realtime from '../../Controllers/realtime.controller'
import AuctionStorage from './auction.storage'
import AuctionItem from '../../Models/auction.model'
import User from '../../Models/user.model'

import { AuctionSchema } from '../../Database/database.controller'

export default class AuctionLoader{
    public static Instace : AuctionLoader;
    private static ON_AUCTION : number = 50;
   
    private Store : AuctionStorage; 
    private WaitingInterval : any;
    private CurrentItems : number;

    constructor(){
        this.Store = new AuctionStorage();
        this.CurrentItems = 0;
        AuctionLoader.Instace = this;     

    }
    
    public async StartLoop( number : number =  AuctionLoader.ON_AUCTION, firstLoad : boolean = true) : Promise<any>{
        var auctionItems = await AuctionItem.LoadState(number);

        this.CurrentItems += auctionItems.length;
        auctionItems.forEach( async element => { 
            await this.Store.AddItem(element).ForceStart() 
            if(!firstLoad){
                Realtime.Instance.emitNew( [element.uidRecord,element] );
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
            await this.StartLoop(different,false);                
        }, 3000);
    }


    public GetStore() : Map<any,any> {
        var map : Map<string,any> = new Map<string,any>();
        this.Store.getItems().forEach( (value,key) => map.set(key,value.getPublic.dataValues ));     

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