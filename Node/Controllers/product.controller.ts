import { validProduct, validStock, validDisable } from '../Utils/Others/validator'
import { compiledTester } from '../Database/database.categories'

import Product from '../Models/product.model'
import User from '../Models/user.model'

export default class ProductController {
      
    public static GetProduct(uid : string) : Promise<any>{
        return Product.ForceFind(uid);
    }

    public static LoadCart( cart : any ) : Promise<any>{
      return Product.GetCart(cart)
    }    

    public static CreateProduct( user : User , params : any ) : Promise<any>{ 
        let hasError = validProduct(params);
        
        return new Promise((resolve, reject) => {
            if(hasError.invalid){
                return reject(hasError.reason);
            }

            const cost = parseFloat( parseFloat(params.cost).toFixed(2) );
            const shipment =parseFloat( parseFloat(params.shipment).toFixed(2) );
        

            Product.ForceCreate(user,{
                prTitle : params.title,
                prDescription : params.description,
                prCost : cost,
                prShipment :shipment,
                prTypes : params.types,
                prFull : params.full,
                prCategory : compiledTester[params.category],
                prStock : params.stock,
                prGuarantee : params.guarantee
            }).then( product => resolve(product))
              .catch( err =>  reject(err)) ;
        });
    }
    
    public static UpdateStock( user : User, params : any) : Promise<any>{
        let hasError = validStock(params);

        return new Promise((resolve, reject) => {
            if(hasError.invalid){
                return reject(hasError.reason);
            }

            Product.ChangeStock(user, params.uid, params.stock)
                .then( result => resolve("Successfully updated"))
                .catch( err => reject(err))

        });
    }

    public static DisableType( user : User, params : any) : Promise<any>{
        return new Promise((resolve, reject) => {            
            Product.ChangeTypeAvailability(user, params.uid, params.available, params.types)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    public static GetType( user : User, params : any) : Promise<any>{
        return new Promise((resolve, reject) => {
            if(!params.id){
                return reject('No id provided');
            }
          
            Product.ForceTypes(params.id)
                .then( types => resolve(types))
                .catch( err =>  reject(err));
        });
    }


}