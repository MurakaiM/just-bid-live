import User from '../Models/user.model'

import { DOMAIN } from '../keys'

interface Shipping{
    name : string,
    phone : string,
    tracking_number : string
}

interface Charge{
    amount : number,
    currency : string,
    description  : string,
    source : string,
    shipping 
}

interface Source{
    amount : number,
    application_fee : number,
    card : string,
    item : any,
    type : number
}

interface SourceCharge{
    amount : number,
    source : string
}

export default class StripeCharges{
    public static Instance : StripeCharges;
    private stripe : any;


    constructor(sPayload : any){
        this.stripe = sPayload;
        StripeCharges.Instance = this;
    }

    public Charge = (user : User ,payload : Charge) : Promise<any> => {
        return this.stripe.charges.create({
           amount: payload.amount,
           currency: payload.currency,
           source:  payload.source, 
           description: payload.description,
           shipment : payload.shipping
        })
    }

    public CreateSource = (user : User, thd_secure : boolean , payload : Source, currency : string = 'usd',) : Promise<any> => {
        return new Promise((resolve, reject) => {
            if(!thd_secure){
                return resolve({ source : {
                    id : payload.card
                } , error : null })
            }

            let pl = {
                amount: payload.amount,               
                currency: currency,
                type: thd_secure ? "three_d_secure" : "card",
                metadata : {
                    item : payload.item,
                    type : payload.type,
                    application_fee: payload.application_fee                 
                },              
                redirect: {
                  return_url: `${DOMAIN}/payment/successfully`
                },
            }

            if(thd_secure){
                pl['three_d_secure'] = { card: payload.card }
            }

            this.stripe.sources.create(pl,(error, source) => resolve({ source, error }));
        });        
    }
    
    public ChargeSource = (payload : SourceCharge, currency : string = 'usd') : Promise<any> => {
        return new Promise((resolve, reject) => {
            this.stripe.charges.create({
                amount: payload.amount,
                source: payload.source,
                currency: currency,
            },(error, charge) => resolve({charge,error}));
        }); 
    }

    public RetrieveCharge = (id : string) : Promise<any> => this.stripe.charges.retrieve(id)
    
}