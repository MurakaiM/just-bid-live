import  * as uuid from 'uuid/v4'

import User from './user.model'

import { 
    AuctionSchema,
    WinningSchema, 
    ProductSchema, 
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

    public static GenerateWinning(data : NewWinning) : Promise<any>{    
        return WinningSchema.create({
            winningId : uuid(),
            winnerId : data.winner,
            sellerId : data.seller,
            auctionId : data.auctionId,
            productId : data.producId,
            lastBid : data.lastBid
        });
    }



    public static FindWinning( id : string ) : Promise<any> {
        return WinningSchema.findOne({ where : { winningId : id }});
    }

    public static FindWinnings( user : User ) : Promise<any> {
        return WinningSchema.findAll({ 
            where : { 
                winnerId : user.PublicData.uid,
                status : 'new' 
            },
            include : [
                { model : AuctionSchema , attributes : ['mainImage'] },
                { model : ProductSchema , attributes : ['prTitle']}
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
                { model : ProductSchema, attributes : ['prShipment','prTitle']}
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

   


    public static FindRender(id : string) : Promise<any>{
        return WinningSchema.findOne({
            attributes : ['lastBid','winnerId','createdAt'],
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
                productTrack : track
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
}