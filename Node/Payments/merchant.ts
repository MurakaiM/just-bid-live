import * as Braintree from "braintree"

import { MerchantIncome } from '../Interfaces/merchant.interdace' 
import { AwaitResult } from '../Utils/Communication/async'

import BGateway from './braintree.gateway'
import User from '../Models/user.model'


export default class MerchantController{
    private gateway;
    public static Instance : MerchantController;

    constructor(payload : BGateway){        
        this.gateway = payload.GetGateway();

        MerchantController.Instance = this;
    }

    public async CreateMerchant(merchant : MerchantIncome, user : User) : Promise<AwaitResult> {
       try{
           let merchantResult = await this.gateway.merchantAccount.create(merchant);
           let merchantAccount = merchantResult.merchantAccount;

           await user.setMerchant(
             merchantAccount.id,
             merchantAccount.masterMerchantAccount.id,
             merchantAccount.status,
             merchantAccount.masterMerchantAccount.status
           )           
           
           return { success : true, result : merchantResult }
       }catch(error){
           return { success : false,  error }
       }
    }

    public async StatusMerchant(signature,payload): Promise<AwaitResult>{
        try{
            let notification = await this.gateway.webhookNotification.parse(signature, payload);
            let merchantAccount = notification.merchantAccount;

            if(notification.kind === Braintree.WebhookNotification.Kind.SubMerchantAccountApproved)
               await User.SetMerchantApproved(merchantAccount.id, merchantAccount.masterMerchantAccount.id, merchantAccount.status, merchantAccount.masterMerchantAccount.status)

            else if(notification.kind === Braintree.WebhookNotification.Kind.SubMerchantAccountDeclined)
               await User.SetMerchantDeclined(merchantAccount.id, merchantAccount.masterMerchantAccount.id, merchantAccount.status, merchantAccount.masterMerchantAccount.status,notification.message)
            
            //Notify seller
            return { success : true, result : notification }
        }catch(error){
            return { success : false, error }
        }
    }

    public async CreateTransaction(merchantId, amount, serviceFee, nonce) : Promise<AwaitResult>{
        try{
            let result = await this.gateway.transaction.sale({
                merchantAccountId: merchantId,
                amount: amount,
                paymentMethodNonce: nonce,
                serviceFeeAmount: serviceFee,
                options: {
                    submitForSettlement: true,
                    holdInEscrow: true,
                }
            });

            return { success: true , result }
        }catch(error){
            return { success: true , error }
        }
    }

    public async ReleaseFromEscrow(transaction_id){
        try{
            let transaction = await this.gateway.transaction.releaseFromEscrow(transaction_id);

            return { success : true, result : transaction }
        }catch(error){
            return { success : false, error }
        }
    }
}

