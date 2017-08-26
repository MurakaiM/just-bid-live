import { validProduct, validStock, validDisable } from '../Utils/Others/validator'
import { compiledTester } from '../Database/database.categories'

import Storage from '../Utils/Controllers/storage'

import Product from '../Models/product.model'
import User from '../Models/user.model'

export default class ProductController {
      
    public static GetProduct(uid : string) : Promise<any>{
        return Product.ForceFind(uid);
    }

    public static LoadCart( cart : any ) : Promise<any>{
      return Product.GetCart(cart)
    }    

    public static async CreateProduct( user : User , params : any , files : any) : Promise<any>{ 
        params.types = JSON.parse(params.types);
      
        let hasError = validProduct(params);
        var readyProduct;
        
        if(hasError.invalid){
            return { succ : false, err : hasError.reason };
        }

        const cost = parseFloat( parseFloat(params.cost).toFixed(2) );
        const shipment =parseFloat( parseFloat(params.shipment).toFixed(2) );
    
        try{
            let product = await Product.ForceCreate(user,{
                    prTitle : params.title,
                    prDescription : params.description,
                    prCost : cost,
                    prShipment :shipment,
                    prTypes : {},
                    prFull : params.full,
                    prCategory : compiledTester[params.category],
                    prMaterial : params.material,
                    prGuarantee : params.guarantee
            });
            for(let key of Object.keys(params.types)){            
                params.types[key].image = await Storage.Instance.uploadType(files[key]);
            }

            product.Data.prTypes = params.types;
            let result = await product.Data.save();
            return { succ : true, product : product.PublicData }

        }catch(error){
            return { succ : false, err : error };
        }
        
    }
    
    public static UpdateStock( user : User, params : any) : Promise<any>{
        let hasError = validStock(params);

        return new Promise((resolve, reject) => {
            if(hasError.invalid){
                return reject(hasError.reason);
            }

            Product.ChangeStock(user, params.productId, params.typeId, params.stock)
                .then( result => resolve(result))
                .catch( err => reject(err))

        });
    }

    public static DisableType( user : User, params : any) : Promise<any>{
        return new Promise((resolve, reject) => {            
            Product.ChangeTypeAvailability(user, params.uid, params.available, params.name)
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


    private static UploadTypes(types : any){
        
    }
}