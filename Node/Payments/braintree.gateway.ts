import * as Braintree from 'braintree'

export default class BraintreeGateway{
    private gateway;

    constructor(isProduction : boolean, merchantId : string, publicKey : string, privateKey : string){        
        this.gateway = Braintree.connect({
            environment: isProduction ? Braintree.Environment.Production : Braintree.Environment.Sandbox,
            merchantId: merchantId,
            publicKey: publicKey,
            privateKey: privateKey
        });
    }
    
    public GetGateway = () => this.gateway;
}