import * as uuid from 'uuid/v4'

import User from '../Models/user.model'
import Seller from '../Models/seller.model'
import Product from '../Models/product.model'
import GoogleStorage from '../Utils/Controllers/storage'
import AuctionItem from '../Models/auction.model'

import { AwaitResult } from '../Utils/Communication/async'
import { compiled } from '../Database/database.categories'
import { parse } from 'libphonenumber-js'


import {
    validId,
    validateEmail,
    validStore,
    validSignUp,
    validDelete,
    validStoreUpdate,
    validAuctionStock,
    validAuctionPause,
    validSocialSignUp
} from '../Utils/Others/validator'
import {
    UserSchema,
    SellerSchema
} from '../Database/database.controller'



export default class SellerController {

    public static SignUp(data: any, userAvatar: any, storeAvatar: any) {
        data.phone = `+${data.fphone}${data.lphone}`;
       
        let userError = validSignUp(data);
        let hasError = validStore(data);
      
        return new Promise((resolve, reject) => {
            if (userError.invalid) return reject(userError.reason);
            if (hasError.invalid) return reject(hasError.reason);

            User.LoadByEmailOrPhone(data.email, data.phone)
                .then(user => {
                    if(user.Data.phone == data.phone && user.Data.email == data.email)
                        return reject("User with such phone and email already exists");
                    else if (user.Data.phone == data.phone)
                        return reject("User with such phone already exists");
                    else if (user.Data.email == data.email)
                        return reject("User with such email already exists");
                })
                .catch(error => {
                    User.ForceStore(data, userAvatar, storeAvatar)
                        .then(result => resolve("Store was successfuly created"))
                        .catch(error =>  reject("Opps, error occured"));
                });

        });
    }

    public static SocialSignUp(user : User, data: any, userAvatar: any, storeAvatar: any) {
        data.phone = `+${data.fphone}${data.lphone}`;

        let userError = validSocialSignUp(data);
        let hasError = validStore(data);
      
        return new Promise((resolve, reject) => {
            if (userError.invalid) return reject(userError.reason);
            if (hasError.invalid) return reject(hasError.reason);

            User.LoadByEmailOrPhone(data.email, data.phone)
                .then(user => {
                    if(user.Data.phone == data.phone && user.Data.email == data.email)
                        return reject("User with such phone and email already exists");
                    else if (user.Data.phone == data.phone)
                        return reject("User with such phone already exists");
                    else if (user.Data.email == data.email)
                        return reject("User with such email already exists");
                })
                .catch(error => {
                    User.ForceStoreApproval(user, data, userAvatar, storeAvatar)
                        .then(result => resolve("Store was successfuly created"))
                        .catch(error => {
                            console.log(error + " SELLER SIGN IN ERROR");                          
                            reject("Opps, error occured")
                        });
                });

        });
    }


    public static GetSeller(user : User): Promise<any>{
        return SellerSchema.findOne({ 
            where : { userId : user.PublicData.uid },
            attributes : ['paypalEmail', 'paypalAccepted', 'title', 'subtitle', 'description', 'cover']  
        });
    }

    public static GetProducts(user: User): Promise <any> {
        return new Promise((resolve, reject) => {
            Seller.FetchProducts(user)
                .then(products => {                   
                    resolve(products)
                })
                .catch(error => {                    
                    resolve([])
                });
        });
    }

    public static GetDisabled(user: User): Promise <any> {
        return new Promise((resolve, reject) => {
            Seller.FetchDisabled(user)
                .then(products => {
                    resolve(products)
                })
                .catch(error => {
                    resolve([])
                });
        });
    }

    public static GetStatistics(user: User): Promise <any> {
        return user.getStore();
    }

    public static GetAuctions(user: User): Promise <any> {
        return Seller.FetchAuction(user);
    }

    

    public static async UpdatePaypal(user : User, params : any): Promise<any>{
        try{
            let valid = validateEmail(params.email);
            if(!valid){
                return { success : false, error : "Invalid email" }   
            }
            let seller = await SellerController.GetSeller(user);

            if(seller.paypalEmail == params.email){
                return { success : false, error : "Trying to update for existing email" }   
            }

            await Seller.UpdatePaypal(user,params.email)
            return { success : true, result : 'Updated' }
        }catch(error){
            return { success : false, error : "Ooops error" }   
        }        
    }

    public static async UpdateAvatar(user : User, file : any): Promise<AwaitResult>{
        try{
            if(!file){
                return { success : false, error : 'No file for avatar' }
            }

            let seller = await Seller.GetSeller(user)
            
            if(seller.cover){
                seller.cover = (await GoogleStorage.Instance.changeAvatar(seller.cover, file) ).result
            }else{
                seller.cover = await GoogleStorage.Instance.uploadAvatar(file)                
            }

            await seller.save()

            return { success : true, result : 'Successfully updated' }
        }catch(error){
            console.log(error)
            return { success : false, error : 'Oopps, error occurred' }
        }
    }

    public static async UpdatePersonal(user : User, params : any ): Promise<AwaitResult>{
        try {
            let hasError = validStoreUpdate(params)
            
            if(hasError.invalid){
                return { success : false, error : hasError.reason }
            }

            let store = await Seller.GetSeller(user)

            store.title = params.title;
            store.subtitle = params.subtitle;
            store.description = params.description;
                        
            await store.save()
            return { success : true, result : "Successfully updated"}
        } catch (error) {
            return { success : false, error }
        }
    }



    public static DeleteProduct(user: User, params: any): Promise < any > {
        const hasError = validDelete(params);

        return new Promise((resolve, reject) => {
            if (hasError.invalid) {
                return reject(hasError.reason);
            }

            Product.ForceDisable(user, params.uid)
                .then(result => {
                    console.log(result);
                    if (result[0] == 0) {
                        reject("Wrong values");
                    } else {
                        resolve("Successfully");
                    }
                })
                .catch(err => reject(err));
        });
    }

    public static RenewProduct(user: User, params: any): Promise < any > {
        const hasError = validDelete(params);

        return new Promise((resolve, reject) => {
            if (hasError.invalid) {
                return reject(hasError.reason);
            }

            Product.ForceRenew(user, params.uid)
                .then(result => {
                    console.log(result);
                    if (result[0] == 0) {
                        reject("Wrong values");
                    } else {
                        resolve("Successfully");
                    }
                })
                .catch(err => reject(err));
        });
    }

    public static RemoveProduct(user: User, params: any): Promise < any > {
        const hasError = validDelete(params);
        return new Promise((resolve, reject) => {
            if (hasError.invalid) {
                return reject(hasError.reason);
            }

            Product.ForceRemove(user, params.uid)
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }

    public static CategorySearch(text: string): any {
        let result = [];

        Object.keys(compiled).forEach(key => {
            if (String(compiled[key].name).toLowerCase().indexOf(text.toLowerCase()) > -1)
                result.push({
                    value: key,
                    name: compiled[key].name,
                    category: compiled[key].category
                });
        });

        return result;
    }

    public static PauseAuction(user: User, params: any) {
        let hasError = validAuctionPause(params);

        return new Promise((resolve, reject) => {
            if(hasError.invalid){
                return reject(hasError.reason);
            }

            AuctionItem.ForcePause(user, params)
                .then(res => resolve(res))
                .catch(err => reject(err))
        });
    }

    public static StockAuction(user: User, params: any) {
        let hasError = validAuctionStock(params);
        return new Promise((resolve, reject) => {
            if (hasError.invalid) {
                return reject(hasError.reason);
            }

            AuctionItem.ForceStock(user, params)
                .then(res => resolve(params.stock))
                .catch(err => reject(err))
        });
    }

}