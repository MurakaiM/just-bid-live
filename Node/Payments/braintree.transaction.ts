import * as Braintree from 'braintree'

import BGateway from './braintree.gateway'

export default class BraintreeTransaction{
    public static Instance : BraintreeTransaction;
    private gateway;

    constructor(payload : BGateway){
        this.gateway = payload.GetGateway();
        
        BraintreeTransaction.Instance = this;
    }

    public FindTransaction = (id : string) => this.gateway.transaction.find(id);

    public ReleaseFromEscrow = (id : string) => this.gateway.transaction.releaseFromEscrow(id); 

    public Refund = (id : string) => this.gateway.transaction.refund(id); 

    public Settlement  = (id : string) => this.gateway.transaction.submitForSettlement(id);
}