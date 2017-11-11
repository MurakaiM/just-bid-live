import  * as uuid from 'uuid/v4'

import User from './user.model'

import { 
    AuctionSchema,
    WinningSchema, 
    ProductSchema, 
    BillingSchema,
    TypesSchema,
    UserSchema
} from '../Database/database.controller' 

interface NewWinning{
    winner : string,
    seller : string,
    auctionId : string,
    producId : string,
    lastBid : number    
}

interface SelectWinning{
    winningId : string,
    type : string
}

export default class Winning{
    private uuid : string;
    private dbWinning : string;
    
    constructor(){}

    get Data(){ return this.dbWinning; }

    public static async GenerateWinning(data : NewWinning) : Promise<any>{           
        return await WinningSchema.create({
           winningId : uuid(),
           winnerId : data.winner,
           sellerId : data.seller,
           auctionId : data.auctionId,
           productId : data.producId,
           lastBid : data.lastBid
        });
    }       


    public static FindWinning(user : User, id : string) : Promise<any> {
        return WinningSchema.findOne({ 
            where : { 
                winnerId : user.PublicData.uid,
                winningId : id 
            },
            include : [
                { model : ProductSchema },
                { model : AuctionSchema }
            ]    
        });
    }

    public static forPayment(id : string) : Promise<any>{
        return WinningSchema.findOne({ 
            where : { winningId : id },
            include : [
                { model : ProductSchema },
                { model : TypesSchema }
            ]    
        });
    }

    public static FindWinnings( user : User ) : Promise<any> {
        return WinningSchema.findAll({ 
            where : { 
                winnerId : user.PublicData.uid,
                status : 'New' 
            },
            include : [
                { model : AuctionSchema , attributes : ['mainImage'] },
                { model : ProductSchema , attributes : ['prTitle','prShipment']}
            ],
            order : [['createdAt','DESC']]
        });
    }



    public static FindSellerWinning( seller : User, id : string) : Promise<any>{
        return WinningSchema.findOne({ 
            where : { 
                sellerId : seller.PublicData.uid,
                winningId : id 
            },
            include : [                
                { model : UserSchema , attributes : ['firstName','lastName']},
                { model : ProductSchema, attributes : ['prShipment','prTitle']},
                { model : TypesSchema }            
            ]
        });    
    }

    public static FindSellerWinnings( seller : User) : Promise<any>{
        return WinningSchema.findAll({
            where : {
                sellerId : seller.PublicData.uid,
                isFinished : false
            },
            include : [                
                { model : UserSchema , attributes : ['firstName','lastName']}
            ],
            order : [['updatedAt','DESC']]
        });
    }



    public static FindCustomerWinnings( customer : User) : Promise<any>{
        return WinningSchema.findAll({ 
            where : { 
                winnerId : customer.PublicData.uid, 
                status : { $ne : "New"}
            },
            order : [['updatedAt','DESC']],
            include : [
                { model : ProductSchema },
                { model : TypesSchema }
            ]    
        });
    }



    public static FindRender(id : string) : Promise<any>{
        return WinningSchema.findOne({
            attributes : ['lastBid','winnerId','status','createdAt'],
            where : { winningId : id },
            include: [{
                attributes : ['prUid','prTitle', 'prDescription', 'prTypes', 'prShipment', 'prRating'],
                model: ProductSchema, 
                as : 'product',    
            }]
        });
    }

    public static UpdateTrack( seller : User, record : string ,track : string): Promise<any>{
        console.log(record,track)
        return WinningSchema.update(
            {
                productTrack : track,
                status : 'Sent'
            },
            {
                where : { 
                    sellerId : seller.PublicData.uid,
                    winningId : record 
                }
            }
        )
    }

    public static UpdateStatus( seller : User, record : string ,status : string): Promise<any>{
        return WinningSchema.update(
            {
                status : status
            },
            {
                where : { 
                    sellerId : seller.PublicData.uid,
                    winningId : record 
                }
            }
        )
    }

    


    public static FinishWinning( user : User) : Promise<any>{
        return WinningSchema.update(
            {
                isFinished : true
            },
            {
                where : { winningId : user.PublicData.uid }
            }
        )
    }

    public static async SelectType( winner : User, data : SelectWinning ){
        try{
            let winning = await WinningSchema.findOne({ where : { winnerId : winner.PublicData.uid, winningId : data.winningId} });
            let product = await ProductSchema.findOne({ where : { prUid : winning.producId, prSeller : winning.sellerId }});
            let isValid = ( product.prTypes[data.type] && !product.prTypes[data.type].disable && product.prTypes[data.type].stock );

            if(isValid){
                winning.SelectType = data.type;

                await winning.save();
                return { success : true , winning }
            }else{
                return { success : false , error : "Invalid type selected"}
            }            
        }catch(error){
            return { success : false , error }
        }
    }


    /* Finding by winning */
    public static async FindByBilling(billingId : string){
        return WinningSchema.findOne({
            where : {
                billingId : billingId
            },
            include : [
                { model : ProductSchema },
                { model : TypesSchema }
            ]    
        });
    }
 
    public static ExtractFee(winning : any): number{
        let fee : number = 0;

        return 0;
    }

}