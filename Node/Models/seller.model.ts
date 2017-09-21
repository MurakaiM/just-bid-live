import {
    Database,
    ProductSchema,
    UserSchema,
    SellerSchema,
    OrderSchema,
    WinningSchema,
    BillingSchema,
    AuctionSchema,
    TypesSchema
} from '../Database/database.controller'

import { AwaitResult } from '../Utils/Communication/async'

import Merchant from '../Payments/merchant'
import User from './user.model'


export default class Seller {
    private dbSeller;
    private uuid : string;

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
                prDisabled: false
            },
            include: [{
                model: TypesSchema,
                as: "Type"
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

    public static UpdateAuction(user: User, uuid: string, stock: number): Promise < any > {
        return AuctionSchema.update({
            inStock: stock
        }, {
            where: {
                uidSeller: user.PublicData.uid,
                uidRecord: uuid
            }
        });
    }

    public static PauseAucion(user: User, uuid: string, availability: boolean): Promise < any > {
        return AuctionSchema.update({
            temporaryDisabled: availability
        }, {
            where: {
                uidSeller: user.PublicData.uid,
                uidRecord: uuid
            }
        });
    }

    public static async RequestPayout(user : User, nonce : any ) : Promise<AwaitResult>{
        try{
           let seller : any = await user.Data.getSeller({ attributes : ['merchantId']});
           let totalSum : number = await BillingSchema.sum('amount', { where: { status : "new", sellerId : user.PublicData.uid } });
           let feeSum : number =  Seller.calcFee(totalSum);
           
                      
           let transaction : any = await Merchant.Instance.CreateTransaction(seller.merchantId, totalSum, feeSum, nonce)

           await BillingSchema.update({ status : "settled", payoutId : transaction.result.id },{ where: { status : "new", sellerId : user.PublicData.uid } })
           return { success : true , result : transaction }

        }catch(error){
           return { success : false , error } 
        }    
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