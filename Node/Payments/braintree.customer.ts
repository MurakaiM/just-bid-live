import * as Braintree from 'braintree'

import BGateway from './braintree.gateway'

interface CustomerCreation {
    firstName : string,
    lastName : string,
    phone : string,
    email : string
    id : string
}

export default class BraintreeCustomer{
    public static Instance : BraintreeCustomer;
    private gateway;

    constructor(payload : BGateway){
        this.gateway = payload.GetGateway();
        
        BraintreeCustomer.Instance = this;
    }

    public Update(id : string, params : any ) : Promise<any>{ 
        return this.gateway.customer.update(id,params);
    }

    public Create(data : CustomerCreation) : Promise<any>{
        return this.gateway.customer.create(data);
    }
}