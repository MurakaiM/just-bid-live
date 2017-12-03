import * as uuid from 'uuid/v4'
import * as moment from 'moment'

import TimeModule from '../Utils/Others/time'
import AuctionLoader from '../Services/Auction/auction.loader'
import RealtimeController from '../Controllers/realtime.controller'
import NotificationController from '../Controllers/notification.controller'

import { Database } from '../Database/database.controller'
import { Fees } from '../Database/database.categories'
import { AuctionSchema, ProductSchema } from '../Database/database.controller'
import { AuctionStreamData } from '../Interfaces/auction.interfaces'

import User from './user.model'
import Winning from './winning.model'

export default class AuctionItem{
    private dbAution : any; //Database model representation
    private timeout : any;  //Timeout for auction
    private number : number;

    private name : string;   

    constructor(){
        this.name = "";
    }

    
    public ForceLoad( data : any ) : AuctionItem{       
        this.dbAution = data;
        this.number = AuctionItem.startTimer;
        return this;
    }

    public async ForceStart() : Promise<any>{     
        var random = TimeModule.getRandomSeconds(180, 350)

        this.dbAution.onAuction = true;
        this.dbAution.currentUser = null;
        
        this.dbAution.auctionStart = new Date();
        this.dbAution.auctionEnds = new Date( this.dbAution.auctionStart.getTime() + random);  
        this.setTimer(random);

        return this.dbAution.save();
    }

    public placeBid(user : User) : Promise<any> {
        var newDate : number = this.number;
        var newBid : number = 0;

        if(Fees[this.dbAution.uidFee].goes.type == 'dollar')
            newBid =  Fees[this.dbAution.uidFee].goes.by;
        else
            newBid = AuctionItem.toCurrency((Fees[this.dbAution.uidFee].goes.by/100) * this.dbAution.currentBid);

        
        this.number =  newDate -  newDate * 0.05;

        this.dbAution.auctionStart = new Date();
        this.dbAution.auctionEnds = new Date( this.dbAution.auctionStart.getTime() + AuctionItem.goingTimer + this.number);
        this.dbAution.currentBid = this.dbAution.currentBid + newBid;
        this.dbAution.currentUser = user.Data.uid;

        return new Promise((resolve, reject) => {
            this.dbAution.save()
             .then( result => {
                //Refresh timeout and emit to stream
                this.name = user.PublicData.firstName;               
                this.setTimer(AuctionItem.goingTimer + this.number);  
                
                RealtimeController.Instance.emitBid(this.StreamData) 
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
        return { 
            id : this.getInside('uidRecord'),
            start : new Date(),
            end : this.getInside('auctionEnds'),
            img : this.getInside('mainImage'),
            bid : this.getInside('currentBid'),
            cost : this.getInside('prCost'),
            title : this.getInside('prTitle'),
            user : this.getInside('currentUser'),
            name : this.name,
            category : this.getInside('uidCategory'),
            type : this.getInside('uidFee'),
            product : this.getInside('uidProduct'),
            shipment : this.getInside('offShipment')
        }
    }

/* 


*/
    
    public get getPrivate(){
        return this.dbAution;
    }

    public get StreamData() : AuctionStreamData {
        return {
            id : this.dbAution.uidRecord,
            user : this.dbAution.currentUser,
            name : this.name,
            bid : this.dbAution.currentBid,
            start : new Date(),
            end : this.dbAution.auctionEnds,
            type : this.dbAution.uidFee,
            category : this.dbAution.uidCategory     
        }
    }    

    public async finish() : Promise<any>{         
        let prTitle = this.dbAution.dataValues.prTitle;
        let inactive = this.dbAution.currentUser ? false : true;
        
        if(inactive){
            RealtimeController.Instance.emitInactive(this.getPublic);
        }else{
            RealtimeController.Instance.emitEnd(this.getPublic);
        }
    
        if(this.dbAution.currentUser){
            await this.dbAution.reload();     

            let winning = await this.registerWinning();   
            let notification = await NotificationController.TypeWinning(winning.winnerId, {
                title : prTitle,
                action : winning.winningId
            });
            RealtimeController.Instance.emitNewNotification(winning.winnerId, notification)        
            this.dbAution.inStock = this.dbAution.inStock - 1;           
        }

        this.dbAution.onAuction = false;
        this.dbAution.auctionStart = moment().add(12, 'hour').toDate()
        this.dbAution.currentUser = null;
        this.name = "";

        if(this.dbAution.inStock == 0){
           this.dbAution.isCompleted = true;
        }else{
           this.dbAution.currentBid = this.dbAution.offCost;
        }    
                             
        AuctionLoader.Instace.FinishTrigger(this.StreamData);
        await this.dbAution.save();               
    }

    
    private getInside(index : string) : any {
        return this.dbAution.dataValues[index];
    }

    private setTimer(time : number) : void {           
        clearTimeout(this.timeout);
        this.timeout = setTimeout( () => this.finish(), time);
    }

    private registerWinning() : Promise<any>{
        return Winning.GenerateWinning({
                auctionId : this.dbAution.uidRecord,
                lastBid : this.dbAution.currentBid,
                producId : this.dbAution.uidProduct,
                seller : this.dbAution.uidSeller,
                winner : this.dbAution.currentUser
        })
    }

    
    
    /* Static overloads */
    public static async ForceCreate( user : User ,data : any ) : Promise<any>{         
        delete data.currentUser;
        data.offCost = (data.type == 'reserved') ? (data.str*100) : AuctionItem.getFees(data.type).begin;

        data.onAuction = false;
        data.uidSeller = user.PublicData.uid;
        data.uidRecord = uuid();
        data.uidFee = data.type;
              
        data.auctionStart = new Date();
        data.auctionEnds = new Date(data.auctionStart.getTime() + AuctionItem.startTimer + AuctionItem.goingTimer );

        data.inStock = data.stock;      
        data.isCompleted = false;

        let product = await ProductSchema.findOne({ where : { prUid : data.uidProduct } });
        let newItem;

        return new Promise((resolve, reject) => {
            if(product){
                if(!product.prAllowed){
                    return reject("Your product has't been aprroved yet"); 
                }

                const firstColor = Object.keys(product.prTypes.colors)[0];  

                data.uidCategory = (<String>product.prCategory).substr(0, 2)                
                data.currentBid = data.offCost;          
               
                data.offShipment = product.prShipment;
                data.mainImage = product.prTypes.colors[firstColor].image;
                        
                newItem = AuctionSchema.build(data);             
                newItem.save()
                    .then( result => resolve("Successfuly saved"))
                    .catch( error => { console.log(error); reject("Database error") });
                
            }else{ 
                return reject("There is no product with such id"); 
            }
        });
    }


    public static ForceStock( user : User, data : any ){
        return AuctionSchema.update(
            {
                inStock : data.stock
            },
            {   
                where : { uidRecord : data.uidRecord, uidSeller : user.PublicData.uid }
            }
        )
    }

    public static ForcePause( user : User, data : any){
        return AuctionSchema.update(
            {
                temporaryDisabled : data.temporaryDisabled
            },
            {   
                where : { uidRecord : data.uidRecord , uidSeller : user.PublicData.uid }
            }
        )
    }

   

    private static getOff( part : number, original : number) : number{    
        original*=100;

        let chunk : number =  100 - ( (part*100) / original );      
        return parseInt(chunk.toFixed(2));
    }

    private static getFees( value : string) : any{
        return Fees[value];
    }

    private static toCurrency(value : number) : number {
        return parseFloat(value.toFixed(0));
    }


    private static startTimer : number = 22000; //Default start timer value in ms
    private static goingTimer : number = 20000; //Default end timer value in ms
}

 /* Deprecated auction v0.01 loaders
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
                    include: [{ 
                        model : ProductSchema,
                        attributes : ['prTitle','prCost']
                    }]
                })
                    .then( items => resolve(items))
                    .catch( error => resolve([]));
            });
        }

        public static LoadFirst( number : number ) : Promise<any>{
            return new Promise((resolve, reject) => {     
                AuctionSchema.findAll({
                    order : [[ 'auctionStart' , 'DESC' ]],
                    limit : number,
                    where : { 
                        isCompleted : false,       
                        onAuction :{ $or : [false,true] },                    
                        inStock : { $gt : 0 }                        
                    },
                    include: [{ 
                        model : ProductSchema,
                        attributes : ['prTitle','prCost']
                    }]
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
 */