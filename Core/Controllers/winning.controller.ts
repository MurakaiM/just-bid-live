import {
    validateWinningStatus,
    validateWinningTrack,
    validateWinningFind,
    UserError
} from '../Utils/Others/validator'

import { AwaitResult } from '../Utils/Communication/async'

import User from '../Models/user.model'
import Winning from '../Models/winning.model'
import Types from '../Models/type.model'

export default class WinningController{
   

     public static async WinningRender(user : User, id : string): Promise<AwaitResult>{        
        try{       
            let winning = await Winning.FindRender(id);          

            if(!winning)
                return { success : false , error : "There is no such winning"}

            if(winning.winnerId != user.PublicData.uid) 
                return { success : false, error : "Wrong user associated with this winning"}

            return { success : true, result : winning }
        }catch(error){           
            return { success : false , error }
        }
     }

     public static async EspecialWinning(seller : User, incoming : any) : Promise<AwaitResult>{
        let hasError = validateWinningFind(incoming);

        if(hasError.invalid)
            return { success : false , error : hasError.reason }
        
        try{
            let result = await Winning.FindSellerWinning(seller, incoming.winningId);
                    
            if(result == null) {
                return { success : false, error : "Wrong parameters was provided" }
            }else{
                return { success : true, result }
            }

         }catch(error){   
             console.log(error)    
             return { success : false, error }
         }
     }
    
     public static LoadWinnings(user : User) : Promise<any>{
        return Winning.FindWinnings(user);
     }

     public static SellerWinnings(seller : User) : Promise<any>{
        return Winning.FindSellerWinnings(seller)
     }

     public static ReadyCustomersWinnings( customer : User) : Promise<any>{
         return Winning.FindCustomerWinnings(customer);
     }

     public static async UpdateStatus(seller : User, data : any) : Promise<AwaitResult>{
        let hasError : UserError = validateWinningStatus(data)

        if(hasError.invalid){
            return { success : false, error : hasError.reason}
        }
        
        try{
            await Winning.UpdateStatus(seller, data.record, data.status)
            return { success : true, result : "Successfully updated" }
        }catch(error){
            return { success : true, error }
        }
     }

     public static async UpdateTrack(seller : User, data : any) : Promise<AwaitResult>{
        let hasError : UserError = validateWinningTrack(data)

        if(hasError.invalid){
            return { success : false, error : hasError.reason}
        }

        try{  
            let result = await Winning.UpdateTrack(seller, data.record, data.track)
            return { success : true, result : result[1][0] }
        }catch(error){
            return { success : true, error }
        }
     }

     
}