import * as uuid from 'uuid/v4'
import * as crypto from 'crypto'

import { UserInterface, UserPassword, UserPublic, UserMessages } from '../Interfaces/user.interfaces'
import { UserSchema } from '../Database/database.controller'
import { getRandomCode } from '../Utils/Others/random'
import { parse } from 'libphonenumber-js'

import FileUploader from '../Utils/Controllers/storage'


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
        var dataObject : any = data; 
        var passwordData : UserPassword = User.hashWithSalt(data.password,User.getRandomString(15));
        var phoneParser  = parse(data.phone);
        
        dataObject.password = passwordData.password;
        dataObject.salt = passwordData.salt;
        dataObject.vrcode = getRandomCode();
        dataObject.uid = uuid();
        dataObject.phone = data.phone;
        dataObject.country = phoneParser.country;    
        
        return new Promise<User>((resolve, reject) => {
            var user = UserSchema.build(dataObject);
            user.save()
             .then( () => {            
                var userObject : User = new User(dataObject.uid);
                userObject.ForceLoad(user);
                resolve(userObject);
             })
             .catch(err => { 
                 console.log(err);  
                 reject("Error occured (Database error)") });
        }); 
    }

    public static ForceVerification(uuid : string){
        return UserSchema.update({ veryfied : true },{ where : {uid : uuid} });
    }


    public static LoadByEmail( email : string) : Promise<User>{
        return new Promise<User>((resolve, reject) => {
           UserSchema.findOne({ where : {email : email}})
            .then( user => {
                if(user){
                    var userObject = new User(user.uid);
                    userObject.ForceLoad(user);
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
                    reject("Can't get user (Such user not exists)");
                }
            })
            .catch( err => reject("Can't get user (Database problem)"));
        });
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