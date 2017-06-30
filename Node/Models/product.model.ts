import ProductInterface from '../Interfaces/product.interfaces'
import { ProductSchema } from '../Database/database.controller'

class Product {
    private dbProduct;
    private uuid : string;


    constructor(uuid : string){
        this.uuid = uuid;    
    }
   

    public Load() : Promise<any>{
        return new Promise<any>((resolve, reject) => {
           ProductSchema.findOne({ where : {prUid : this.uuid}})
            .then( product => {
                if(product){
                    this.dbProduct = product;
                    resolve();
                }else{
                    reject("Can't get product (Such product not exists)");
                }
            })
            .catch( err => reject("Can't get product (Database problem)"));
        });
    }

    public Delete() : Promise<any>{
       return this.dbProduct.remove();
    }

    public IncrementBought() : Promise<any>{
        return this.dbProduct.increment('prSold');
    } 

    public IncrementWishes() : Promise<any>{
        return this.dbProduct.increment('prWishes');
    }

    public ForceLoad(data : JSON) : void{
        this.dbProduct = data;
    }
    
    
    get Data() { 
        return this.dbProduct; 
    }

    public static ForceCreate(data : ProductInterface) : Promise<Product>{
        return new Promise<Product>((resolve, reject) => {
            var product = ProductSchema.build(data);
            product.save()
             .then( () => {
                var productObject : Product = new Product(data.prUid);
                productObject.ForceLoad(product);
                resolve(productObject);
             })
             .catch(err => reject("Error occured (Database error)"));
        });
    }

    public static ForceDelete(uuid : string) : Promise<any>{
        return ProductSchema.remove({where : { prUid : uuid}});
    }
   

}

