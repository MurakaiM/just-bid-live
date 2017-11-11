import { TypesSchema } from '../Database/database.controller'

export default class Type{

    public static FindType(productId : string, typeId : string) : Promise<any>{
        return TypesSchema.findOne({
            where : {
                productId : productId,
                typeId : typeId
            }
        });
    }

    public static FindByUid(typeUid : string) : Promise<any>{
        return TypesSchema.findOne({
            where : { typeUid : typeUid }
        });
    }
    
}