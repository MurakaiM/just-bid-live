import { ProductSchema, UserSchema, SellerSchema, AuctionSchema } from '../Database/database.controller'

import User from './user.model'


export default class Seller {
    private dbSeller;
    private uuid: string;
        

        
    public static FetchProducts(user : User): Promise<any>{
        return ProductSchema.findAll({
            order: [ ["updatedAt",'DESC'] ] ,
            where : {
                prSeller : user.Data.uid,
                prDisabled : false
            },
            attributes : [ 'prUid', 'prTitle','prRating', 'prCost', 'prSold', 'prViews','prWishes', 'prTypes', 'createdAt', 'updatedAt' ]
        });
    }

    public static FetchDisabled(user : User) : Promise<any>{
        return ProductSchema.findAll({
            order: [ ["updatedAt",'DESC'] ] ,
            where : {
                prSeller : user.Data.uid,
                prDisabled : true
            },
            attributes : [ 'prUid', 'prTitle','prRating', 'prSold', 'prViews', 'updatedAt' ]
        });
    }

    public static FetchAuction(user : User) : Promise<any>{
        return AuctionSchema.findAll({
            order: [ ["updatedAt",'DESC'] ] ,
            where : {
                uidSeller : user.Data.uid            
            },
            include : [
                { 
                    model : ProductSchema ,                    
                    attributes : ["prTitle"]
                }
            ]
        });
    }

    public static UpdateAuction( user : User, uuid : string, stock : number) : Promise<any>{
       return AuctionSchema.update(
            {
                inStock : stock
            },
            {
                where : {
                    uidSeller : user.PublicData.uid,
                    uidRecord : uuid                    
                }
            }
        );
    }

    public static PauseAucion( user : User, uuid : string, availability : boolean ) : Promise<any>{
        return AuctionSchema.update(
            {
                temporaryDisabled : availability
            },
            {
                where : {
                    uidSeller : user.PublicData.uid,
                    uidRecord : uuid                    
                }
            }
        );
    }
}