import { BuildResponse } from '../Utils/Communication/response'
import { isAuth }  from '../Utils/Communication/rules'
 
import BasicController from '../Utils/Controllers/basic.controller'
import AuctionLoader from '../Services/Auction/auction.loader'


export default class AuctionApi extends BasicController{

    Configure(){
        this.Get('/auction/current', this.CurrentItems);

        this.Post('/auction/bid', this.PostBid)
    }

    protected CurrentItems(req,res){        
        res.send( BuildResponse( 0, "Items successfuly fetched", [...AuctionLoader.Instace.GetStore()] ));
    }

    protected PostBid(req,res){
        isAuth(req,res).allowed( () => {
            AuctionLoader.Instace.PostBid(req.user, req.body.uidAuction)
                .then( result => res.send( BuildResponse(0, "Bid was successfully posted")) )
                .catch( error => res.send( BuildResponse(10, "Error occurred",error)) );
        });
    }    

}
