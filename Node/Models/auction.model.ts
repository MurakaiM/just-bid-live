import * as uuid from 'uuid/v4'


import TimeModule from '../Utils/Others/time'
import AuctionLoader from '../Services/Auction/auction.loader'
import RealtimeController from '../Controllers/realtime.controller'

import { Database } from '../Database/database.controller'
import { Fees } from '../Database/database.categories'
import { AuctionSchema, ProductSchema } from '../Database/database.controller'
import { AuctionStreamData } from '../Interfaces/auction.interfaces'

import User from './user.model'


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

    public ForceStart() : Promise<any>{     
        this.dbAution.onAuction = true;
        this.dbAution.currentUser = null;
        this.dbAution.auctionEnds = new Date( new Date().getTime() + AuctionItem.startTimer + AuctionItem.goingTimer );        
        return this.dbAution.save();
    }

    public async finish() : Promise<any>{  
        await this.dbAution.reload();

        this.dbAution.inStock = this.dbAution.inStock - 1;
        this.dbAution.currentUser = null;
        this.name = "";

        if(this.dbAution.inStock == 0){
           this.dbAution.isCompleted = true;
            
           RealtimeController.Instance.emitEnd(this.dbAution.uidRecord);
           AuctionLoader.Instace.FinishTrigger(this.dbAution.uidRecord);
                
           await this.dbAution.save();
        }else{          
           this.dbAution.currentBid = Fees[this.dbAution.uidFee].begin;
           await this.dbAution.save();

           this.ForceStart().then( saved => RealtimeController.Instance.emitStock(this.getPublic) );
        }        
    }

    public placeBid(user : User) : Promise<any> {
        var newDate : number = this.number;
        var newBid : number = 0;

        if(Fees[this.dbAution.uidFee].goes.type == 'dollar')
            newBid =  Fees[this.dbAution.uidFee].goes.by;
        else
            newBid = AuctionItem.toCurrency((Fees[this.dbAution.uidFee].goes.by/100) * this.dbAution.currentBid);

        
        this.number =  newDate -  newDate * 0.05;

        this.dbAution.auctionEnds = new Date( new Date().getTime() + AuctionItem.goingTimer + this.number);
        this.dbAution.currentBid = this.dbAution.currentBid + newBid;
        this.dbAution.currentUser = user.Data.uid;

   
        return new Promise((resolve, reject) => {
            this.dbAution.save()
             .then( result => {
                //Refresh timeout and emit to stream
                this.name = user.PublicData.firstName;
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
        return { 
            data : this.dbAution.dataValues,
            name : this.name
        };
    }

    public get StreamData() : AuctionStreamData {
        return {
            uid : this.dbAution.uidRecord,
            name : this.name,
            currentBid : this.dbAution.currentBid,
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

    public static async ForceCreate( user : User ,data : any ) : Promise<any>{         
        delete data.currentUser;

        data.onAuction = false;
        data.uidSeller = user.PublicData.uid;
        data.uidRecord = uuid();
        data.isCompleted = false;
        data.uidFee = data.type;
        data.auctionStart = new Date();
        data.auctionEnds = new Date(data.auctionStart.getTime() + AuctionItem.startTimer + AuctionItem.goingTimer );

        var product = await ProductSchema.findOne({ where : { prUid : data.uidProduct } });
        var newItem;

        return new Promise((resolve, reject) => {

            if(product){
              const firstColor = Object.keys(product.prTypes)[0];  

              data.currentBid = AuctionItem.getFees(data.type).begin;             
              data.offCost = AuctionItem.getOff(data.currentBid, product.prCost);
              data.offShipment = product.prShipment;
              data.mainImage = product.prTypes[firstColor].image;
              data.inStock = data.stock;
              
            
              newItem = AuctionSchema.build(data);             
              newItem.save()
                .then( result => resolve("Successfuly saved"))
                .catch( error =>  reject(error));
                
            }else reject("There is no product with such id"); 


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
        part*=100;
        let chunk : number =  100 - ( (part*100) / original );
        console.log(chunk);
        return parseInt(chunk.toFixed(2));
    }

    private static getFees( value : string) : any{
        return Fees[value];
    }

    private static toCurrency(value : number) : number {
        return parseFloat(value.toFixed(0));
    }

    private static startTimer : number = 25000; //Default start timer value in ms
    private static goingTimer : number = 20000; //Default end timer value in ms
}