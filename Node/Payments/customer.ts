import {
    AwaitResult
} from '../Utils/Communication/async'

import BGateway from './braintree.gateway'


interface CustomerCreation {
    firstName: string,
        lastName: string,
        uid: string,
        phone: string,
        email: string
}

export default class Customer {
    public static Instance: Customer;
    private gateway;

    constructor(gateway: BGateway) {
        this.gateway = gateway;
    }

    public GenerateClient(): Promise<any>{
       return this.gateway.clientToken.generate({});    
    }

    public async OrderSale(amount: number, clientNonce: any, order_id : string, custom : any): Promise<AwaitResult> {
        try {
            let selling = await this.gateway.transaction.sale({
                amount: amount,
                orderId : order_id,
                customFields : custom,
                paymentMethodNonce: clientNonce,
                options: {
                    submitForSettlement: true
                }
            });

            return { success: true }
        } catch (error) {
            return { success: false,error }
        }
    }

    public async AuctionSale(amount : number, clientNonce : any, winning_id : string, custom : any ): Promise<AwaitResult>{
        try {
            let selling = await this.gateway.transaction.sale({
                amount: amount,
                customFields : custom,
                orderId : winning_id+"_auction",
                paymentMethodNonce: clientNonce,
                options: {
                    submitForSettlement: true
                }
            });

            return { success: true , result : selling}
        } catch (error) {
            return { success: false, error }
        }
    }

}