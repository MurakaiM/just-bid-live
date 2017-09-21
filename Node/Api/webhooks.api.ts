import { BuildResponse } from '../Utils/Communication/response'

import BasicController from '../Utils/Controllers/basic.controller'
import AuctionLoader from '../Services/Auction/auction.loader'
import Merchant from '../Payments/merchant'

export default class WebhooksApi extends BasicController {

    Configure() {
        this.Post('/webhooks/braintree/merchant', this.merchantStatus);
    }

    protected merchantStatus(req,res){        
        if(!req.body.bt_signature || !req.body.bt_payload){
            return res.status(404).send();
        }       
        
        Merchant.Instance.StatusMerchant(req.body.bt_signature, req.body.bt_payload)
            .then( result => result.error ? res.status(404).send() : res.status(200).send() );
    }


}