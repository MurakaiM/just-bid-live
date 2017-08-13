import {validOrder, validOrderUpdate} from '../Utils/Others/validator'

import Order from '../Models/order.model'
import User from '../Models/user.model'

export default class OrderController {

    public static CreateOrder(user: User, params: any) {
        let errors = [];

        return new Promise((resolve, reject) => {
            let valid = validOrder(params);
            if (valid.invalid) {
                return reject(valid.reason);
            }
            
            params.orders.forEach( async elem => {
                try{
                    await Order.Create(user, elem)
                }catch( error ){
                    errors.push({
                        uid : elem.uid
                    });
                }                
            });

            resolve( errors );
        });
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