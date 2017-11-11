import * as StripeInit from 'stripe'

interface StripeKeys {
    publicKey : string,
    privateKey : string
}

export default class Stripe{
    private gateway : any;
    private keys : StripeKeys;

    constructor(publicKey : string, privateKey : string){        
        this.gateway = StripeInit(privateKey);
        this.keys = { publicKey, privateKey }
    }
    
    public GetGateway = () => this.gateway;

    public GetKeys = () => this.keys;
}