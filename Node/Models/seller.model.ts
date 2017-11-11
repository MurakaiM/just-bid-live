import * as moment from 'moment'
import {
    Database,
    ProductSchema,
    UserSchema,
    SellerSchema,
    OrderSchema,
    WinningSchema,
    BillingSchema,
    PayoutSchema,
    AuctionSchema,
    TypesSchema
} from '../Database/database.controller'

import { AwaitResult } from '../Utils/Communication/async'

import User from './user.model'


export default class Seller {
    private dbSeller;
    private uuid : string;

    public static GetSeller(user : User) : Promise<any>{
        return SellerSchema.findOne({
            where : { userId : user.PublicData.uid }
        })
    }

    public static FetchProducts(user: User): Promise < any > {
        let attributes: Array < any > = ['prUid', 'prTitle', 'prRating', 'prCost', 'prSold', 'prViews', 'prWishes', 'prTypes', 'createdAt', 'updatedAt'];
        attributes.push([ 
            Database.Instance.Sequelize.literal(`(select sum("types"."inStock") from "types" where "types"."productId"="product"."prUid")`), 'prStock' 
        ]);

        return ProductSchema.findAll({
            order: [
                ["updatedAt", 'DESC']
            ],
            where: {
                prSeller: user.Data.uid,
                prDisabled: false,
                prAllowed : { $ne : false }
            },
            include: [{
                model: TypesSchema,
                as: "types"
            }],
            attributes
        });
    }

    public static FetchDisabled(user: User): Promise < any > {
        return ProductSchema.findAll({
            order: [
                ["updatedAt", 'DESC']
            ],
            where: {
                prSeller: user.Data.uid,
                prDisabled: true
            },
            attributes: ['prUid', 'prTitle', 'prRating', 'prSold', 'prViews', 'updatedAt']
        });
    }

    public static FetchAuction(user: User): Promise < any > {
        return AuctionSchema.findAll({
            order: [
                ["updatedAt", 'DESC']
            ],
            where: {
                uidSeller: user.Data.uid
            },
            include: [{
                model: ProductSchema,
                attributes: ["prTitle"]
            }]
        });
    }

    public static UpdateAuction(user: User, uuid: string, stock: number): Promise<any> {
        return AuctionSchema.update({
            inStock: stock
        }, {
            where: {
                uidSeller: user.PublicData.uid,
                uidRecord: uuid
            }
        });
    }

    public static PauseAucion(user: User, uuid: string, availability: boolean): Promise<any> {
        return AuctionSchema.update({
            temporaryDisabled: availability
        }, {
            where: {
                uidSeller: user.PublicData.uid,
                uidRecord: uuid
            }
        });
    }

    public static async PayoutRequested(user : User): Promise<{ requested : boolean, payout : any }>{
        try{
            let payout = await PayoutSchema.findOne({
                where : {
                    sellerId : user.PublicData.uid,
                    status : 'Waiting for review'
                }
            });

            if(!payout){
                return { requested : false, payout : null };
            }else{  
                return { requested : true, payout };
            }                       
        }catch(error){
            return { requested : true, payout : null };
        }
    }

    public static ApproveSeller(user : User, data : any): Promise<any>{
        return null;
    }

    public static UpdatePaypal(user: User, email : string): Promise<any>{
        return SellerSchema.update({
            paypalEmail: email,
            paypalAccepted : moment().add(14, 'day')
         },{
            where :{ userId : user.PublicData.uid }     
        })
    }

    private static calcFee(allNumber : number) : number{
        let part = 0;

        allNumber*=100;
        part = ((allNumber * Seller.PAYOUT_PERCENT)/100) + 30;   
        part/=100;

        return parseFloat(part.toFixed(2))
    }


    public static PAYOUT_PERCENT = 3;
    public static PAYOUT_FEE_CENTS = 30;
}