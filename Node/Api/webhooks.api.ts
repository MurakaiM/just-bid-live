import * as Stripe from 'stripe'
import * as crypto from 'crypto'

import { BuildResponse } from '../Utils/Communication/response'
import { STRIPE_WEBHOOKS, STRIPE_SECRET, MODE } from '../keys'

import BasicController from '../Utils/Controllers/basic.controller'
import AuctionLoader from '../Services/Auction/auction.loader'
import PaymentController from '../Controllers/payment.controller'

interface ParsedSignature{
    timestamp : string,
    v1 : string,
    v0 : string 
}

export default class WebhooksApi extends BasicController {
    private static stripe;

    constructor(){
        super();
        WebhooksApi.stripe = new Stripe(STRIPE_SECRET); 
    }

    Configure() {
       this.Post('/wbhook_strp/pm/client/charge/chargeable', this.sourseChargable)
    }

    protected sourseChargable(req,res){   
        let sig = req.headers["stripe-signature"];

        try{
            let event = WebhooksApi.stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOKS[MODE].chargeable);
            
            PaymentController.WBChargeableWinning( req.body).then(
                answer => {},
                error => console.log(error)
            )

            res.status(200).send();        
        }catch(error){
            console.log(error)
            res.status(200).send();
        }
    }




    private static parseSignature(data : string) : ParsedSignature{
        const splitted = data.split(',').map( value => value.split('=')[1]);
        return { 
            timestamp : splitted[0],
            v1 : splitted[1],
            v0 : splitted[2] 
        }
    }

    private static validateSignature(signature : string, payload : any, secret : string) : Boolean {
        let parsed =  WebhooksApi.parseSignature(signature)
        let signedPayload = `${parsed.timestamp}.${JSON.stringify(payload)}`

        let HMAC = crypto.createHmac('sha256', STRIPE_WEBHOOKS.chargeable).update(signedPayload,'utf8').digest('hex');       
        return true;
    }
}