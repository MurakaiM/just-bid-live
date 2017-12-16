import * as uuid from 'uuid/v4'

import User from '../Models/user.model'
import Storage from '../Utils/Controllers/storage'
import Notifications from '../Services/Norifications/email.service'

import { validSocialSignUp } from '../Utils/Others/validator'
import { UserSchema } from '../Database/database.controller'
import { UserMessages } from '../Interfaces/user.interfaces'
import { AwaitResult } from '../Utils/Communication/async'



export default class UserController{

    public static async SignUp(data : any, file : any) : Promise<AwaitResult>{
        try{
            let user = await User.LoadByEmailOrPhone(data.email, data.phone);           

            if(user){
                if(user.Data.phone == data.phone && user.Data.email == data.email)
                    return { success : false, error : "User with such phone and email already exists"}
                else if(user.Data.phone == data.phone) 
                    return { success : false, error : "User with such phone already exists"}            
                else if(user.Data.email == data.email) 
                    return { success : false, error : "User with such email already exists"}
            }
            
            let imageUrl = await Storage.Instance.uploadAvatar(file);
            let newUser = await User.ForceCreate({
                email : data.email,
                phone : data.phone,
                birthday : data.birthday,
                password : data.password,
                firstName : data.firstName,
                lastName : data.lastName,
                imgUrl : imageUrl                 
            });
            

            Notifications.Instance.sendVerification({
                email : newUser.email,
                name : newUser.firstName+" "+newUser.lastName,
                uid : newUser.uid
            });

            return { success : true, result : "User was successfuly created" }
        }catch(error){
            return { success : false, error : "Opps, error occured"}
        }
    }

    public static async SignVerify(user : User, data : any) : Promise<AwaitResult>{
        try{
            let hasError = validSocialSignUp(data);

            if(hasError.invalid){
                return { success : false, error : hasError.reason }
            }
            
            let usr = await User.LoadByPhone(data.phone);           
            
            if(usr){           
            return { success : false, error : "User with such phone already exists"} 
            }

            let upd = await User.SocialVerify(user.PublicData.uid, {
                firstName : data.firstName,
                lastName : data.lastName,   
                birthday : new Date(data.birthday), 
                phone : data.phone            
            })

            return { success : true, result : "Successfully updated"}
        }catch(error){
            return { success : false, error }
        }
    }


    public static RequestPassword(email : string) : Promise<any> {
        return new Promise((resolve, reject) => {
            var date = new Date().getTime();
            var pwdLink = uuid()+date+uuid();
            pwdLink = pwdLink.replace(/-/g, '');          

            UserSchema.update(
              {
                password_date : date + (24 * 60 * 60 * 1000),
                password_link : pwdLink
              },
              {
                where : { email : email},
                returning : true
              })
                .then( result => { console.log(result); return UserSchema.findOne({ where : { email : email} }) })
                .then( user => resolve(user))
                .catch( err => reject(err));          

        });
    }   

    public static ResetPassword(data) : Promise<any>{
        return new Promise((resolve, reject) => {
            UserSchema.findOne({ where : { password_link : data.link }})
                .then( user => {
                    if(user == null){
                        reject("There is no such link. If you made error, request password reset one more time.");
                    }   


                    var currentUser = new User(user.uid).ForceLoad(user);
                    if(currentUser.Data.email != data.email){
                        currentUser.clearReset();
                        return reject("Emails are not simillar");
                    }

                    if(new Date().getTime() >= currentUser.Data.password_date ){
                        currentUser.clearReset();
                        return reject("Too big pause between request and reset");
                    } 

                    
                    currentUser.confirmReset(data.password)
                        .then( result => resolve(result))
                        .catch( error => reject(error));

                })
                .catch( err => {              
                    reject("There is no such link")});
        });
    }

    public static ResetVlidate(data) : Promise<any>{
        return new Promise((resolve, reject) => {    
            UserSchema.findOne({ where : { password_link : data } })
            .then( user => {
                console.log(user)
                if(user == null){
                    reject("There is no such link");
                }   

                var currentUser = new User(user.uid).ForceLoad(user);   
                if(new Date().getTime() >= currentUser.Data.password_date ){
                    currentUser.clearReset();
                    return reject("Too big pause between request and reset");
                } 

                return resolve();
            })
            .catch( err => {              
                reject("There is no such link")});
        });
    }

    public static VerifyUser( uid : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            
            User.LoadByUid(uid)
            .then( user => user.Verify())
            .then( result => resolve(result))
            .catch( err => reject(err));

        });   
    }
}