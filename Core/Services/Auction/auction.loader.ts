import Realtime from '../../Controllers/realtime.controller'
import AuctionStorage from './auction.storage'
import { LoadFirst, LoadStep } from './auction.selector'
import AuctionItem from '../../Models/auction.model'
import User from '../../Models/user.model'

import { AuctionSchema } from '../../Database/database.controller'
import TimeModule from '../../Utils/Others/time'

export interface Counted{
    [index : string] : number
}

export const PerCategory : number = 12;

export default class AuctionLoader{
    public static Instace : AuctionLoader;
    private static INTERVAL : number = TimeModule.getSeconds(5);

    private ON_AUCTION : Counted = {
        'wm' : 0, 'mn' : 0, 'wt' : 0,
        'bg' : 0, 'hl' : 0, 'ph' : 0,
        'el' : 0, 'of' : 0, 'hs' : 0,
        'ts' : 0, 'tn' : 0, 'cr' : 0,
        'hi' : 0
    }

    private Store : AuctionStorage; 
    private WaitingInterval : any;

    constructor(){
        this.Store = new AuctionStorage();        
        AuctionLoader.Instace = this;   
    }
    
    public async StartLoop( firstLoad : boolean = true) : Promise<any>{
        let auctionItems = [];
       
        if(firstLoad)
            auctionItems = await LoadFirst(this.ON_AUCTION)
        else
            auctionItems = await LoadStep(this.ON_AUCTION)


        auctionItems.forEach( async element => { 
            const item = this.Store.AddItem(element)
            await item.ForceStart();
            
            this.ON_AUCTION[element.uidCategory]+=1

            if(!firstLoad){               
                Realtime.Instance.emitNew(item.getPublic);
            }
        });
        
        return true;
    }


    public HandleExcept() : void {
        this.WaitingInterval = setInterval( async () => await this.StartLoop(false), AuctionLoader.INTERVAL)
    }


    public GetStore() : Array<any> {
        let map : Array<any> = [];
        this.Store.getItems().forEach( (item) => map.push(item.getPublic));    
        return map;
    }

    public PostBid(user : User, uid : string){    
        return this.Store.postBid(user,uid);
    }


    public FinishTrigger( data : any) : void {
        this.ON_AUCTION[this.Store.GetItem(data.id).getPrivate.uidCategory]-=1;        
        this.Store.DeleteItem(data.id);       
    }
}