import  * as uuid from 'uuid/v4'

import User from './user.model'

import { WinningSchema,ProductSchema } from '../Database/database.controller' 

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
        let winning = WinningSchema.build({
            winningId : uuid(),
            winnerId : data.winner,
            sellerId : data.seller,
            auctionId : data.auctionId,
            producId : data.producId,
            lastBid : data.lastBid
        });       
        return winning.save() 
    }

    public static UpdateTrack( seller : User, track : string): Promise<any>{
        return WinningSchema.update(
            {
                productTrack : track
            },
            {
                where : { sellerId : seller.PublicData.uid }
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