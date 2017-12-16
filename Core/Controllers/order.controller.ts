import {validOrder, validOrderUpdate} from '../Utils/Others/validator'
import { AwaitResult } from '../Utils/Communication/async'

import Order from '../Models/order.model'
import User from '../Models/user.model'

export default class OrderController {

    public static async CreateOrder(user: User, params: any): Promise<any> {        
        let valid = validOrder(params);
        if (valid.invalid) {
            return 
        }
        
        const onSuccess = [];
        const onErrors = [];

        for( let key of Object.keys(params.order )){
            try{
               let result = await Order.Create(user, params.order[key])
               onSuccess.push(result)
            }catch(error){
               onErrors.push(key) 
            }
        }

        return {
            successOrders : onSuccess,
            failureOrders : onErrors
        }       
    }

    public static UpdateStatus(user : User, params : any){
        let hasError = validOrderUpdate(params);
        
        return new Promise((resolve, reject) => {          
            if(hasError.invalid){
                reject(hasError.reason);    
            }   

            Order.UpdateStatus(user, params.orderId, params.status)
                .then( result => resolve(result))
                .catch(err => reject(err));
        });         
    }

    /* Fix this */
    public static UpdateTrack( user : User, params : any){
        let hasError = validOrderUpdate(params);
        
        return new Promise((resolve, reject) => {          
            if(hasError.invalid){
                reject(hasError.reason);    
            }   

            Order.UpdateStatus(user, params.orderId, params.status)
                .then( result => resolve(result))
                .catch(err => reject(err));
        });  
    }

    public static CustomerOrders( user : User ) : Promise<any>{
        return Order.CurrentCustomers(user);
    }

    public static CustomerHistory( user : User ) : Promise<any>{
        return Order.HistoryCustomers(user);
    }
    

}