import * as uuid from 'uuid/v4'

import User from '../Models/user.model'
import { UserSchema } from '../Database/database.controller'
import { UserMessages } from '../Interfaces/user.interfaces'


export default class UserController{

    public static SignUp(data : any, file : any) : Promise<UserMessages>{
        return new Promise((resolve, reject) => {
          User.LoadByEmailOrPhone(data.email,data.phone)
            .then( user => {
                if(user.Data.phone == data.phone) 
                    return reject({ success : false, reason : "User with such phone already exists"});
               
                else if(user.Data.email = data.email) 
                    return reject({ success : false, reason : "User with such email already exists"});
            })
            .catch(() => {  
                var imageUrl = '';                            
                User.ForceCreate(
                    {
                        email : data.email,
                        phone : data.phone,
                        birthday : data.birthday,
                        password : data.password,
                        firstName : data.firstName,
                        lastName : data.lastName,
                        imgUrl : imageUrl                 
                    }
                )
                    .then( () => resolve({ success : true, reason : "User was successfuly created"}))
                    .catch( () => reject({ success : true, reason : "Opps, error occured"}));               
            });      
        });
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
                where : { email : email}
              })
                .then( result => UserSchema.findOne({ where : { email : email} }))
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