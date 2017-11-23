import { BuildResponse } from '../Utils/Communication/response'
import { isAuth }  from '../Utils/Communication/rules'

import User from '../Models/user.model'

import BasicController from '../Utils/Controllers/basic.controller'
import AuctionLoader from '../Services/Auction/auction.loader'


export default class AuctionApi extends BasicController{

    Configure(){
        this.Get('/auction/current', this.CurrentItems);

        this.Post('/auction/bid', this.PostBid)
    }

    protected CurrentItems(req,res){        
        res.send( BuildResponse( 0, "Items successfuly fetched", AuctionLoader.Instace.GetStore() ));
    }

    protected PostBid(req,res){
        isAuth(req,res).allowed( user => {             
            if(user.isSeller()){
                return res.send( BuildResponse(11, "Sellers not allowed to place bids"))
            } 

            AuctionLoader.Instace.PostBid(req.user, req.body.id)
                .then( result => res.send( BuildResponse(0, "Bid was successfully posted")) )
                .catch( error => res.send( BuildResponse(10, "Error occurred",error)) );
        });
    }    

}
