import * as uuid from 'uuid/v4'

import TimeModule from '../Utils/Others/time'
import AuctionLoader from '../Services/Auction/auction.loader'
import RealtimeController from '../Controllers/realtime.controller'

import { Database } from '../Database/database.controller'
import { AuctionSchema, ProductSchema } from '../Database/database.controller'
import { AuctionStreamData } from '../Interfaces/auction.interfaces'

import User from './user.model'


export default class AuctionItem{
    private dbAution : any; //Database model representation
    private timeout : any;  //Timeout for auction
    private number : number;

    constructor(){}

    
    public ForceLoad( data : any ) : AuctionItem{
        this.dbAution = data;
        this.number = AuctionItem.startTimer;
        return this;
    }

    public ForceStart() : Promise<any>{     
        this.dbAution.onAuction = true;
        this.dbAution.currentUser = null;
        this.dbAution.auctionEnds = new Date( new Date().getTime() + AuctionItem.startTimer + AuctionItem.goingTimer );        
        return this.dbAution.save();
    }

    public finish() : void{  
        this.dbAution.inStock = this.dbAution.inStock - 1;

        if(this.dbAution.inStock == 0){
            this.dbAution.isCompleted = true;
           
            RealtimeController.Instance.emitEnd(this.dbAution.uidRecord);
            AuctionLoader.Instace.FinishTrigger(this.dbAution.uidRecord);
            
            this.dbAution.save();
        }else{          
            this.ForceStart().then( saved => RealtimeController.Instance.emitStock([ this.dbAution.uidRecord,this.dbAution ]) );
        }
    }

    public placeBid(user : User) : Promise<any> {
        var newDate : number = this.number;
        var newBid : number = Math.round( this.dbAution.currentBid + ( this.dbAution.currentBid * 0.20 ) );
   
        this.number =  newDate -  newDate * 0.05;

        this.dbAution.auctionEnds = new Date( new Date().getTime() + AuctionItem.goingTimer + this.number);
        this.dbAution.currentBid = newBid;
        this.dbAution.currentUser = user.Data.uid;


        return new Promise((resolve, reject) => {
            this.dbAution.save()
             .then( result => {
                //Refresh timeout and emit to stream
                RealtimeController.Instance.emitBid(this.StreamData)
                this.setTimer(AuctionItem.goingTimer + this.number);   
                resolve("Updated");             
             })           
             .catch( error => {
                //Rollback to previous state
                this.dbAution.auctionEnds -= this.number;
                this.dbAution.currentBid -= newBid;
                reject(error);
             });
        });
    }

    public get getPublic(){
        return this.dbAution;
    }

    public get StreamData() : AuctionStreamData {
        return {
            uid : this.dbAution.uidRecord,
            price : this.dbAution.currentBid,
            ending : this.dbAution.auctionEnds           
        }
    }    

    private setTimer(time : number) : void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout( () => this.finish(), time);
    }

    public static LoadState(number : number) : Promise<any>{
        return new Promise((resolve, reject) => {         

            AuctionSchema.findAll({
                order : [[ 'auctionStart' , 'DESC' ]],
                limit : number,
                where : { 
                    isCompleted : false,       
                    onAuction : false,                    
                    inStock : { $gt : 0 }                        
                },
                include: [ ProductSchema ]
            })
                .then( items => resolve(items))
                .catch( error => resolve([]));
        });
    }

    public static LoadNext() : Promise<any>{
        return new Promise((resolve, reject) => {
            AuctionSchema.findOne({
                order : [ 'auctionStart' , 'DESC' ],              
                where : { onAuction : false , isCompleted : false }
            })
                .then( items => resolve(items))
                .catch( error => reject("There is no next items"));
        });
    }

    public static async ForceCreate( data : any ) : Promise<any>{         
        delete data.currentUser;

        data.onAuction = false;
        data.uidRecord = uuid();
        data.isCompleted = false;
        data.auctionStart = new Date();
        data.auctionEnds = new Date(data.auctionStart.getTime() + AuctionItem.startTimer + AuctionItem.goingTimer );

        var product = await ProductSchema.findOne({ where : { prUid : data.uidProduct } });
        var newItem;

        return new Promise((resolve, reject) => {

            if(product){
              newItem = AuctionSchema.build(data);             
              newItem.save()
                .then( result => resolve("Successfuly saved"))
                .catch( error => reject(error));
                
            }else reject("There is no product with such id"); 


        });
    }

    private static startTimer : number = 25000; //Default start timer value in ms
    private static goingTimer : number = 20000; //Default end timer value in ms
}