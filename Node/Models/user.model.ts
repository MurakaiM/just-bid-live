import * as uuid from 'uuid/v4'
import * as crypto from 'crypto'


import { UserInterface, UserPassword, UserPublic, UserMessages } from '../Interfaces/user.interfaces'
import { Database, UserSchema, SellerSchema, ProductSchema , OrderSchema } from '../Database/database.controller'
import { getRandomCode } from '../Utils/Others/random'
import { parse } from 'libphonenumber-js'

import FileUploader from '../Utils/Controllers/storage'
import Notificator from '../Services/Norifications/email.service'


export default class User {
    private dbUser;
    private uuid: string;
        

    constructor(uuid : string){
        this.uuid = uuid;    
    }
   

    public Load() : Promise<any>{
        return new Promise<any>((resolve, reject) => {
           UserSchema.findOne({ where : {uid : this.uuid}})
            .then( user => {
                if(user){
                    this.dbUser = user;
                    resolve();
                }else{
                    reject("Can't get user (Such user not exists)");
                }
            })
            .catch( err => reject("Can't get user (Database problem)"));
        });
    }


    public ForceLoad(data : any) : User{
        this.uuid = data.uid;
        this.dbUser = data;
        return this;
    }

    public isPassword(password : string) : boolean{
        if(User.hashWithSalt(password,this.dbUser.salt).password != this.dbUser.password)
            return false;

        return true;        
    }
    
    public getStore(){
       return new Promise((resolve, reject) => {
        let answer : any = {};  
        answer.user = this.PublicData; 

        this.dbUser.getSeller({ attributes: ['rating', 'title', 'subtitle', 'description', 'cover'] })
            .then( seller => {
                answer.seller = seller;
                return ProductSchema.count({ where : { prSeller : this.dbUser.uid } });
            })
            .then( allProducts => {
                answer.allProducts = allProducts;
                return OrderSchema.count({ where : { sellerId : this.dbUser.uid } });
            })
            .then( allOrders => {
                answer.allOrders = allOrders;
                return ProductSchema.sum('prSold', { where : { prSeller : this.dbUser.uid } })
            })
            .then( allSolds => {
                answer.allSolds = allSolds;
                return ProductSchema.sum('prViews', { where : { prSeller : this.dbUser.uid } })
            })
            .then( allViews => {
                answer.allViews = allViews;
                return ProductSchema.sum('prWishes', { where : { prSeller : this.dbUser.uid } })
            })
            .then( allWishes => {
                answer.allWishes = allWishes;
                return ProductSchema.sum('prLikes', { where : { prSeller : this.dbUser.uid } })
            })
            .then( allLikes => {
                answer.allLikes = allLikes;
                return resolve(answer);
            })            
            .catch( error => reject(error));
       });      
    }


    public clearReset() : Promise<any>{
        return new Promise((resolve, reject) => {
            this.dbUser.password_link = '';
            this.dbUser.password_date = 0;
            this.dbUser.save().then( result => resolve(result)).catch( error => reject(error));
        });
    }

    public confirmReset(password : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            var newData = User.hashWithSalt(password, User.getRandomString(15));
            
            this.dbUser.password = newData.password;
            this.dbUser.salt = newData.salt;

            this.dbUser.save()
                .then( result => { 
                    this.clearReset()
                        .then(() => resolve(result))       
                        .catch( error => reject(error))    
                })
                .catch( error => reject(error));    
        });        
    } 

    public setMerchant(id : string, masterId : string, status : string, masterStatus : string): Promise<any>{
        return SellerSchema.update(
            {
                merchantId : id,
                merchantStatus : status,
                masterMerchantId : masterId,
                masterMerchantStatus : masterStatus
            },
            {
               where : { userId : this.PublicData.uid }
            }
        );
    }

    public Verify() : Promise<User>{
        return new Promise((resolve, reject) => {
            if(this.dbUser.veryfied){
                reject("User is already veryfied");
            }

            this.dbUser.veryfied = true;
            this.dbUser.save()
                .then( user => resolve(user))
                .catch( error => reject(error));
        });        
    }

    public isVerified() : boolean{
        return this.dbUser.veryfied;
    }

    public isSeller() : boolean{     
        return this.dbUser.isSeller;
    }


    public hasImage() : boolean {
        return this.dbUser.imgUrl.length > 0 ? true : false; 
    }

    public Delete() : Promise<any>{
       return this.dbUser.remove();
    }
    

    get PublicData() : UserPublic{
        return {
            uid : this.dbUser.uid,
            email : this.dbUser.email,
            firstName : this.dbUser.firstName,
            lastName : this.dbUser.lastName,
            img  : this.hasImage() ? this.dbUser.imageUrl : undefined
        }
    }
        
    get Data(){
        return this.dbUser;
    }
    


    public static ForceCreate(data : UserInterface){
        let dataObject : any = data; 
        let passwordData : UserPassword = User.hashWithSalt(data.password,User.getRandomString(15));
        let phoneParser  = parse(data.phone);
        
        dataObject.password = passwordData.password;
        dataObject.salt = passwordData.salt;
        dataObject.vrcode = getRandomCode();
        dataObject.uid = uuid();
        dataObject.phone = data.phone;
        dataObject.country = phoneParser.country;    
        
        return new Promise<any>((resolve, reject) => {
            let user = UserSchema.build(dataObject);
            user.save()
             .then( () => resolve(dataObject))
             .catch(err => reject("Error occured (Database error)"));
        }); 
    }

    public static ForceStore(data : any,userAvatar : any, storeAvatar : any){       
        
        const passwordData : UserPassword = User.hashWithSalt(data.password,User.getRandomString(15));
        const phoneParser  = parse(data.phone);

        let readyUser, readyStore;
        
        let dataObject : any = {
            uid : uuid(),           
            vrcode : getRandomCode(),
            isSeller : true,
            email : data.email,
            birthday : new Date(data.birthday),  
            lastName : data.lastName,      
            firstName : data.firstName,    
            country : phoneParser.country,
            password : passwordData.password,
            salt : passwordData.salt,
            phone : data.phone,
        }
        let sellerObject : any = {
            recordId : uuid(),
            userId : dataObject.uid,
            title : data.storeName,
            subtitle : data.storeSubtitle,
            description : data.storeDescription
        } 

        return new Promise((resolve, reject) => {
            Database.Instance.Sequelize.transaction(t =>      
                  UserSchema.create(dataObject, {transaction: t})
                  .then(user => { readyUser = user; return SellerSchema.create(sellerObject) }, {transaction: t} ) 
                  .then( store => {readyStore = store; }, {transaction: t})
            )            
            .then(result => {
                Notificator.Instance.sendVerification({
                    email : dataObject.email,
                    uid : dataObject.uid,
                    name : `${dataObject.firstName} ${dataObject.lastName}`
                });                

                FileUploader.Instance.uploadAvatar(userAvatar)
                    .then( url => {
                        readyUser.imgUrl = url;
                        return readyUser.save();
                    })
                    .then( result => FileUploader.Instance.uploadAvatar(storeAvatar))
                    .then( url => {
                        readyStore.cover = url;
                        return readyStore.save();
                    })
                    .then(result => resolve("Saved"))
                    .catch(error =>{ console.log(error); resolve("Witout image") });
                
            })
            .catch( error => reject(error));            
        });
    }


    public static ForceVerification(uuid : string){
        return UserSchema.update({ veryfied : true },{ where : {uid : uuid} });
    }



    public static LoadByUid( uid : string ) : Promise<User>{
        return new Promise((resolve, reject) => {
            UserSchema.findOne(
                {
                    where : { uid : uid }
                }
            )
            .then( user => {
                if(!user) return reject("No such user");

                return resolve( new User(user.uid).ForceLoad(user) );
            })
            .catch( err => reject(err));

        });
    }


    public static LoadByEmail( email : string) : Promise<User>{
        return new Promise<User>((resolve, reject) => {
           UserSchema.findOne({ where : {email : email}})
            .then( user => {
                if(user){
                    var userObject = new User(user.uid).ForceLoad(user);
                    resolve(userObject);
                }else{
                    reject("Can't get user (Such user not exists)");
                }
            })
            .catch( err => reject("Can't get user (Database problem)"));
        });
    }
    
    public static LoadByEmailOrPhone( email : string, phone : string) : Promise<User>{
        return new Promise<User>((resolve, reject) => {
           UserSchema.findOne({ where : { $or: [{email: email}, {phone: phone}] }})
            .then( user => {
              
                if(user){
                    var userObject = new User(user.uid);
                    userObject.ForceLoad(user);
                    resolve(userObject);
                }else{
                    resolve(null);
                }
            })
            .catch( err =>{console.log(err);  reject("Can't get user (Database problem)") });
        });
    }


    public static SetMerchantApproved(id : string, masterId : string, status : string, masterStatus : string): Promise<any>{
        return SellerSchema.update(
            {               
                merchantStatus : status,              
                masterMerchantStatus : masterStatus
            },
            {
               where : {                    
                   merchantId : id,
                   masterMerchantId : masterId                
               }
            }
        );  
    }

    public static SetMerchantDeclined(id : string, masterId : string, status : string, masterStatus : string, message : string): Promise<any>{
        return SellerSchema.update(
            {               
                merchantStatus : status,              
                masterMerchantStatus : masterStatus,
                merchantMessage : message
            },
            {
               where : {                    
                   merchantId : id,
                   masterMerchantId : masterId                
               }
            }
        ); 
    }


    private static getRandomString(length : number) : string{
        return crypto.randomBytes(Math.ceil(length/2))
         .toString('hex')
         .slice(0,length);
    }

    private static hashWithSalt(password, salt) : UserPassword {
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        var value = hash.digest('hex');
        
        return {
            salt:salt,
            password:value
        };
    }


}