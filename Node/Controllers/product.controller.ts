import * as uuid from 'uuid/v4'

import {
    validId,
    validProduct,
    validStock,
    validDisable,
    validDisableType,
    validDelete
} from '../Utils/Others/validator'
import {
    compiledTester
} from '../Database/database.categories'
import {
    Database,
    TypesSchema,
    ProductSchema
} from '../Database/database.controller'

import RealtimeController from '../Controllers/realtime.controller'
import NotificationController from '../Controllers/notification.controller'

import { AwaitResult } from '../Utils/Communication/async'

import Storage from '../Utils/Controllers/storage'

import Product from '../Models/product.model'
import User from '../Models/user.model'

export default class ProductController {

    public static async CreateProduct(user: User, params: any, files: any): Promise < any > {
        params.colors = JSON.parse(params.colors);
        params.sizes = JSON.parse(params.sizes);
    
        let hasError = validProduct(params);
        var readyProduct;

        if (hasError.invalid) {
            return {
                succ: false,
                err: hasError.reason
            };
        }

        const cost = parseFloat(parseFloat(params.cost).toFixed(2));
        const shipment = parseFloat(parseFloat(params.shipment).toFixed(2));

        return await Database.Instance.Sequelize.transaction({
            autocommit: false
        }).then(async TR => {
            try {
                let product = await ProductSchema.create({
                    prUid: uuid(),
                    prSeller: user.PublicData.uid,
                    prTitle: params.title,
                    prDelivery : params.delivery,
                    prDescription: params.description,
                    prCost: cost,
                    prShipment: shipment,
                    prTypes: {},
                    prFull: params.full,
                    prCategory: compiledTester[params.category],
                    prMaterial: params.material,
                    prGuarantee: params.guarantee
                }, {transaction: TR});

                let colors = Object.keys(params.colors);
                let uploads = await Promise.all(colors.map(key => Storage.Instance.uploadType(files['filefor' + key])));
               
                colors.forEach( (key,i) => params.colors[key].image = uploads[i]);
        

                let typesObject = Object.keys(params.sizes).length == 0  ? {colors: params.colors, sizes : {}} : { colors: params.colors, sizes: params.sizes }
                product.prTypes = typesObject          

                await product.save({ transaction: TR })
                await Database.Instance.Search.ForceTSV(product.prUid,TR)       
               
                let bulkArray: Array < any > = [];
                if (Object.keys(params.sizes).length == 0)
                    Object.keys(params.colors).forEach(key => bulkArray.push({
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
                            bulkArray.push({
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

                await TypesSchema.bulkCreate(bulkArray, { transaction: TR })
                await TR.commit()
                            
                let finished = await Product.ForceForSeller(user,product.prUid)
                let notification = await NotificationController.CreationProduct(product.prSeller, {
                    title : product.prTitle,
                    action : product.prUid                    
                });
                RealtimeController.Instance.emitNewNotification(product.prSeller, notification)  

                return {  succ: true, product: finished.dataValues }
            } catch (error) {
                console.log(error)
                await TR.rollback();
                return { succ: false, err: error }
            }
        })
    }

    public static async PublicStock(user : User, params : any) : Promise<AwaitResult>{
        try{
            let hasError = validId(params);

            if(hasError.invalid) return { success : false,  error : hasError.reason }

            let typesStock = await TypesSchema.findAll({
                where: { productId: params.id },
                attributes : ['typeId','inStock']
            });

            return { success : true, result : typesStock }
        }catch(error){
            return { success : false,  error }
        }
    }

    public static async ApprovalProduct(user : User, params : any) : Promise<AwaitResult>{
        try{
            let hasError = validId(params);

            if(params.allowed == null || params.allowed == undefined){
                return { success : false , error : 'No allowed parameter was provded.' } 
            }

            if(hasError.invalid){
                return { success : false , error : hasError.reason } 
            }

 
            let product = ( await Product.ForceApproval(params.id, params.allowed))[1][0];
            let notification = await NotificationController.ApprovalProduct(product.prSeller, {
                title : product.prTitle,
                action : product.prUid,
                approved :  params.allowed
            })
            RealtimeController.Instance.emitNewNotification(product.prSeller, notification)   

            return { success : true, result :  'Product was successfully approved' }
        }catch(error){
            console.log(error)
            return { success : true, error }
        }
    }


    
    public static GetProduct(uid: string): Promise < any > {
        return Product.ForceFind(uid);
    }

    public static LoadCart(cart: any): Promise < any > {
        return Product.GetCart(cart)
    }

    public static UpdateStock(user: User, params: any): Promise < any > {
        let hasError = validStock(params);

        return new Promise((resolve, reject) => {
            if (hasError.invalid) {
                return reject(hasError.reason);
            }

            Product.ChangeStock(user, params.productId, params.typeId, params.stock)
                .then(result => resolve(result.product))
                .catch(err => reject(err))

        });
    }

    public static DisableType(user: User, params: any): Promise < any > {
        return new Promise((resolve, reject) => {
            let hasError = validDisableType(params);

            if (hasError.invalid) {
                return reject(hasError.reason);
            }

            Product.ChangeTypeAvailability(user, params.uid, params.available, params.name, params.group)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    public static GetStock(user: User, params: any): Promise < any > {
        let hasError = validId(params);
        return new Promise((resolve, reject) => {
            if (hasError.invalid) {
                return reject(hasError.reason)
            }

            TypesSchema.findAll({
                    where: {
                        productId: params.id,
                        sellerId: user.PublicData.uid
                    }
                })
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    public static GetType(user: User, params: any): Promise < any > {
        return new Promise((resolve, reject) => {
            if (!params.id) {
                return reject('No id provided');
            }

            Product.ForceTypes(params.id)
                .then(types => resolve(types))
                .catch(err => reject(err));
        });
    }
    
    public static GetUnchecked() : Promise<any>{
        return Product.ForceUnreviewd();
    }


}