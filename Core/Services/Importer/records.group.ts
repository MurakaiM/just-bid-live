import * as _ from 'lodash'
import * as uuid from 'uuid/v4'
import { PerCategory } from '../Auction/auction.loader';

interface GrouperOptions{
    id: string,
    toGroup: {
        translator: Function,
        into: string,
        id: string
    }[]

}

interface RecordsAliases{
    prSeller: string,
    prTitle: string,
    prDelivery : string,
    prDescription:string,
    prCost: string, 
    prFull: string,
    prCategory: string,
    prShipment : string,
    prMaterial: string,
    prGuarantee:string,
    prTypes: (productPayload: any) => {
        colors :{  
            [index: string] : {
                color : string,
                image: string,
                value: string,
                title: string,
                path?: string
            }
        },
        sizes: {
            [index: string] : {
                value: string,
                title: string
            }
        }
    }
}

interface ProductBulks{
    products : any[],
    types: any[] 
}

class RecordsGrouper{

    public productGroup(payload: any[],options: GrouperOptions): any[]{
        let result = {};
        let temp = null;
        
        payload.forEach(e => {
            if(result[e[options.id]]){
                temp = result[e[options.id]];

                options.toGroup.forEach(gr => temp[gr.into].push(gr.translator(e[gr.id],e)));
                result[e[options.id]] = temp;                   
            }else{               
                options.toGroup.forEach(gr => e[gr.into] = [gr.translator(e[gr.id],e)])
                result[e[options.id]] = e;
            }
        });

        result = Object.values(result).map(e => {
            options.toGroup.forEach(gr => e[gr.into] = _.uniqWith(e[gr.into],_.isEqual));
            return e;
        });
        return (<Array<any>>result);
    }


    public productsBulk(payload: any[], aliases: RecordsAliases, prSeller : string): ProductBulks{
        let products: any = [];
        let types: any = [];
            
        payload.forEach(e => {
            let prUid = uuid();
            let prTypes = aliases.prTypes(e);
            let product = {
                prUid,
                prTypes,
                prSeller,
                prFull : e[aliases.prFull],
                prCost : e[aliases.prCost],    
                prTitle : e[aliases.prTitle],                  
                prGuarantee : e[aliases.prGuarantee] || 1,               
                prShipment : e[aliases.prShipment] || 20,
                prCategory : e[aliases.prCategory],
            };
            let extractedTypes = this.productTypesExtractor(prTypes, product);
            
            products.push(product);
            types.push(extractedTypes);
        });

        return { products, types }
    }


    private productTypesExtractor(params: any, product: any): any[]{
        let bulkTypes = [];

        if (Object.keys(params.sizes).length == 0)
            Object.keys(params.colors).forEach(key => bulkTypes.push({
                typeUid : uuid(),
                productId: product.prUid,
                sellerId: product.prSeller,
                title: params.colors[key].title,
                inStock: params[key],
                typeId: key
            }));
        else {
            for (let colorKey of Object.keys(params.colors)) {
                for (let sizeKey of Object.keys(params.sizes)) {
                    bulkTypes.push({
                        typeUid : uuid(),
                        productId: product.prUid,
                        sellerId: product.prSeller,
                        inStock: params[colorKey + sizeKey],
                        title: params.colors[colorKey].title + ", " + params.sizes[sizeKey].title,
                        typeId: colorKey + "|" + sizeKey
                    })
                }
            }
        }

        return bulkTypes;
    }
}


export default new RecordsGrouper();