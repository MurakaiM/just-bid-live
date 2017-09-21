import { AwaitResult } from '../Utils/Communication/async'

import User from '../Models/user.model'
import Winning from '../Models/winning.model'

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
    
     public static LoadWinnings(user : User) : Promise<any>{
        return Winning.FindWinnings(user);
     }
}