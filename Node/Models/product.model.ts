import * as uuid from 'uuid/v4'

import ProductInterface from '../Interfaces/product.interfaces'
import { ProductSchema, OrderSchema, AuctionSchema } from '../Database/database.controller'

import User from '../Models/user.model'



export default class Product {
    private dbProduct;
    private uuid : string;


    constructor(uuid : string){
        this.uuid = uuid;    
    }
   

    public Load() : Promise<any>{
        return new Promise<any>((resolve, reject) => {
           ProductSchema.findOne({ where : {prUid : this.uuid}})
            .then( product => {
                if(product){
                    this.dbProduct = product;
                    resolve();
                }else{
                    reject("Can't get product (Such product not exists)");
                }
            })
            .catch( err => reject("Can't get product (Database problem)"));
        });
    }

    public Delete() : Promise<any>{
       return this.dbProduct.remove();
    }

    get PublicData() : any {
        return {
            prUid : this.dbProduct.prUid,
            prTitle : this.dbProduct.prTitle,
            prRating : this.dbProduct.prRating,
            prCost : this.dbProduct.prCost,
            prSold : this.dbProduct.prSold,
            prViews : this.dbProduct.prViews,
            prWishes : this.dbProduct.prWishes,
            prStock : this.dbProduct.prStock,
            createdAt : this.dbProduct.createdAt,
            updatedAt : this.dbProduct.updatedAt,
        }  
    }


    public IncrementBought() : Promise<any>{
        return this.dbProduct.increment('prSold');
    } 

    public IncrementWishes() : Promise<any>{
        return this.dbProduct.increment('prWishes');
    }

    public ForceLoad(data : JSON) : void{
        this.dbProduct = data;
    }
    
    public DecreaseStock(){
        return this.dbProduct.increment('prStock');
    }



    get Data() { 
        return this.dbProduct; 
    }


    public static GetCart( data : any) : Promise<Array<Product>> {      
        return new Promise((resolve, reject) => {
            
            ProductSchema.find({ 
                attributes: ['prUid', 'prTitle', 'prDescription', 'prCost', 'prTypes'],
                where : { 
                    prUid    : { $in : data }
                } 
            })
            .then( products => resolve(products) )
            .catch( error => reject(error));
        
        });
    }

    public static ForceCreate(user : User, data : ProductInterface) : Promise<any>{    
        return new Promise<any>((resolve, reject) => {         

            data.prUid = uuid();         
            data.prSeller = user.Data.uid;
                      
            var product = ProductSchema.build(data);           
            product.save()
             .then( () => {
                var productObject : Product = new Product(data.prUid);
                productObject.ForceLoad(product);               
                resolve(productObject);
             })
             .catch(err => reject(err));
        });
    }

    public static ForceDelete(user : User , uuid : string) : Promise<any>{
        return ProductSchema.remove({where : { prSeller : user.Data.uid, prUid : uuid}});
    }

    public static ForceDisable(user : User, uuid : string) : Promise<any>{
        return ProductSchema.update({ prDisabled : true },{where : { prSeller : user.Data.uid, prUid : uuid}});
    }

    public static ForceRenew(user : User, uuid : string) : Promise<any>{
        return ProductSchema.update({ prDisabled : false },{where : { prSeller : user.Data.uid, prUid : uuid}});
    }

    public static ForceRemove( user : User, uuid : string) : Promise<any>{
        return new Promise((resolve, reject) => {            
            OrderSchema.find({ where : { productId :  uuid } })
            .then( result => {
                if(!result){                    
                    return AuctionSchema.find({ where : { uidProduct :  uuid } })
                }

                if(result.length  != 0){
                    return reject("There are orders related to this product.");
                }
              
            })
            .then ( result => {
                if(!result){                 
                    return ProductSchema.destroy({ where: { prUid : uuid } })
                }

                if(result.length  != 0){
                    return reject("There are auctions related to this product.");
                }
            })
            .then( result => resolve("Product was deleted"))
            .catch( error =>  reject("Database error"));   
        });
    }


    public static ForceFind(uuid : string ) : Promise<any>{
        return ProductSchema.findOne({ where : { prUid : uuid} });
    }

    public static ForceTypes(uuid : string) : Promise<any>{
        return ProductSchema.findOne({ where : { prUid : uuid }, attributes : ["prTypes"] });
    }

    public static ChangeStock( user : User , uuid : string, type: string , stock : number) : Promise<any> {
        return new Promise((resolve, reject) => {
           
            ProductSchema.findOne({
                where : {
                    prUid : uuid,
                    prSeller : user.Data.uid
                }
            }).then( product => {
                if(!product){
                    return reject("No such product");
                }

                if(!product.prTypes[type]){
                    return reject("Wrong type name provided");
                }

                let JSONData = product.prTypes;
                JSONData[type].stock = stock;
                product.prTypes = JSONData;
                
                return product.save();
            }).then( product => resolve(product))
            .catch( err => reject(err));            

        });
    }

    public static ChangeTypeAvailability( user : User, uuid : string, available : boolean, data : any) : Promise<any>{
        return new Promise((resolve, reject) => {           
            ProductSchema.findOne({
                where : {
                    prUid : uuid,
                    prSeller : user.Data.uid
                }
            }).then( product => {
                if(!product){
                    reject("No such product");
                }

                if(!product.prTypes[data]){
                   return reject("Wrong type name provided");
                }

                let JSONData =  product.prTypes;
                JSONData[data].disable = available;

                product.prTypes = JSONData;              
                return product.save();
            }).then( product => resolve("Saved"))
            .catch(err => reject("Error occurred"));
        });
    }

    
}

