import { UserInterface, UserPassword, UserPublic } from '../Interfaces/user.interfaces'
import { UserSchema } from '../Database/database.controller'
import FileUploader from '../Utils/storage'

import * as crypto from 'crypto'


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


    public ForceLoad(data : JSON) : void{
        this.dbUser = data;
    }

    public isPassword(password : string) : boolean{
        if(User.hashWithSalt(password,this.dbUser.salt).password == this.dbUser.password)
            return false;

        return true;        
    }
    
    public isVerified() : boolean{
        return this.dbUser.veryfied;
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
    

    public static async SignUpUser(data : any, file : any){
        var hasUser = await User.LoadByEmail(data.email);

        if(hasUser) return false;
        
        var imageUrl = '';
        if(file){
            imageUrl = await FileUploader.Instance.uploadAvatar(file);
        }   
        
        await User.ForceCreate(
            {
                email : data.email,
                password : data.password,
                firstName : data.firstName,
                lastName : data.lastName,
                imgUrl : imageUrl
            }
        );
        return true;
    }

    private static ForceCreate(data : UserInterface){
        var dataObject : any = data; 
        var passwordData : UserPassword = User.hashWithSalt(data.password,User.getRandomString(15)) 
        dataObject.password = passwordData.password;
        dataObject.slat = passwordData.salt;

        return new Promise<User>((resolve, reject) => {
            var user = UserSchema.build(dataObject);
            user.save()
             .then( () => {
                var userObject : User = new User(dataObject.uid);
                userObject.ForceLoad(user);
                resolve(userObject);
             })
             .catch(err => reject("Error occured (Database error)"));
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