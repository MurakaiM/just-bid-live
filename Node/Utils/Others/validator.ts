import { isValidNumber } from 'libphonenumber-js' 
import { validateCategory, validateFee } from '../../Database/database.categories'


export interface UserError{
    invalid : boolean,
    reason : string
}

function buildError(err,msg) : UserError{
    return {
        invalid : err,
        reason : msg
    }
}

function validateEmail(email) {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

export function validSingIn(incoming : any) : UserError{
    if(incoming.email == undefined || incoming.password == undefined)
            return buildError(true, "Inputs fields are wrong");

    else return buildError(false, "Everything is valid")
}

export function validSignUp(incoming : any) : UserError {
    
    if(!validateEmail(incoming.email)){
        return buildError(true,'Your email is badly formatted');
    }

    if(incoming.password.length < 6){
        return buildError(true,'Your password is badly formatted');
    }



    if(!isValidNumber(incoming.phone)){
        return buildError(true,"Your phone is invalid");
    }    


    if(!incoming.hasOwnProperty('email') 
        || !incoming.hasOwnProperty('password') 
        || !incoming.hasOwnProperty('firstName') 
        || !incoming.hasOwnProperty('lastName')) 
    return buildError(true,'There is empty required field');


    return buildError(false,'There is no problems with validation');
}

export function validStore(incoming : any) : UserError{
    if(!incoming.storeName){
        return buildError(true,"No store title provided");        
    }

    if(!incoming.storeSubtitle){
        return buildError(true,"No store subtitle provided");  
    }

    if(!incoming.storeDescription){
        return buildError(true , "No store description provided")
    }

    if(incoming.storeName.length == 0){
        return buildError(true, "Store name too short")
    }

    if(incoming.storeSubtitle.length == 0){
        return buildError(true, "Store subtitle too short")
    }

    if(incoming.storeDescription.length == 0){
        return buildError(true, "Store description too short")
    }

    return buildError(false, "Everything is valid")
}

export function validRequestPassword( incoming : any) : UserError{
    if(!validateEmail(incoming.email)){
        return buildError(true,'Your email is badly formatted');
    }

    return buildError(false,'There is no problems with validation');
}

export function validResetPassword( incoming : any) : UserError{
   
    if(!validateEmail(incoming.email)){
        return buildError(true,'Your email is badly formatted');
    }
    
    if(incoming.password.length < 6){
        return buildError(true,'Your password is badly formatted');
    }

    return buildError(false,'There is no problems with validation');
} 

export function validAuction( incoming : any ) : UserError{
    if(incoming.uidProduct == undefined)
        return buildError(true,'Prodcuct association id is wrong');

    if(incoming.uidProduct.length != 36 ) 
        return buildError(true,'Prodcuct association is wrong');
    
    if(incoming.type == undefined)
        return buildError(true, 'Auction type is not provided')

    if(!validateFee(incoming.type))
        return buildError(true, 'Auction type is wrong')

    if(!Number.isInteger(incoming.inStock) && incoming.inStock)
        return buildError(true, 'Wrong in stock number');

    if(incoming.inStock < 1 || incoming.inStock > 99999)
        return buildError(true, 'Wrong in stock number');

    return buildError(false, "Everything is valid");
}

export function validOrder( incoming : any) : UserError{

    if(!incoming.quantity){
        return buildError(true,'No quantity value specified');
    }

    if(incoming.quantity < 1){
        return buildError(true,'Wrong quantity value');
    }

    if(!incoming.address){
        return buildError(true,'No address provided');
    }

    if(!incoming.type){
        return buildError(true,'No type provided');
    }
   

    return buildError(false, "Everything is valid");
}

export function validOrderUpdate( incoming : any) : UserError{
    if(!incoming.staus){
        return buildError(true,'No status value specified');
    }

    if(incoming.staus.length == 0){
        return buildError(true,'Wrong status value');
    }

    if(!incoming.productId){
        return buildError(true,'No product id provided');
    }


    return buildError(false, "Everything is valid");
}

export function validOrderTrack( incoming : any) : UserError{
    if(!incoming.staus){
        return buildError(true,'No status value specified');
    }

    if(incoming.staus.length == 0){
        return buildError(true,'Wrong status value');
    }

    if(!incoming.productId){
        return buildError(true,'No product id provided');
    }


    return buildError(false, "Everything is valid");
}

export function validProduct ( incoming : any) : UserError{
    if(!incoming.title){
        return buildError(true, "No title provided")
    }

    if(incoming.title.length == 0){
        return buildError(true, "Too short title provided")
    }

    if(!incoming.description){
        return buildError(true, "No description provided")
    }

    if(incoming.description.length == 0){
        return buildError(true, "Too short description provided")
    }

    if(!incoming.cost){
        return buildError(true, "No price provided")
    }

    if(incoming.cost <= 0){
        return buildError(true, "Wrong price provided")
    }


    if(!incoming.stock){
        return buildError(true, "No stock provided")
    }

    if(incoming.stock <= 0){
        return buildError(true, "Wrong stock provided")
    }

    if(!incoming.guarantee){
        return buildError(true, "No guarantee provided")
    }

    if(incoming.guarantee <= 0){
        return buildError(true, "Wrong guarantee provided")
    }


    if(!incoming.shipment){
        return buildError(true, "No shipment provided")
    }

    if(incoming.shipment < 0){
        return buildError(true, "Wrong shipment provided")
    }

    if(!incoming.full){
        return buildError(true, "No full description provided")
    }

    if(incoming.full.length <= 50){
        return buildError(true, "Too short full description provided")
    }

    if(!incoming.category){
        return buildError(true, "No category provided")
    }

    if(incoming.category.length == 0){
        return buildError(true, "Wrong category provided")
    }

    if(!validateCategory(incoming.category)){
        return buildError(true, "Wrong category provided")
    }

    if(!validateType(incoming.types)){
        return buildError(true, "Wrong types was passed")
    }

    return buildError(false, "Everything is okay")

}

export function validStock (incoming : any) : UserError{
    if(!incoming.uid){
        return buildError(true, "No product id provided")
    }
    if(incoming.uid.length == 0){
        return buildError(true, "Product id is wrong")
    }

    if(!incoming.stock){
        return buildError(true, "No stock provided")
    }
    if(incoming.stock <= 0){
        return buildError(true, "Stock number is wrong")
    }

    return buildError(false, "Everything is valid")
}

export function validDisable( incoming : any) : UserError{
    if(!incoming.uid){
        return buildError(true, "No product id provided")
    }
    if(incoming.uid.length == 0){
        return buildError(true, "Product id is wrong")
    }

    if(!incoming.type.group){
        return buildError(true, "No product id provided")
    }

    return buildError(false, "Everything is valid")
}

export function validDelete (incoming : any ) : UserError{
    if(!incoming.uid){
        return buildError(true, "No product id provided")
    }

    if(incoming.uid.length != 36){
        return buildError(true, "Product id is not valid")
    }

    return buildError(false, "Everything is valid")
}

export function validAuctionStock(incoming : any) : UserError{
    if(!incoming.uidRecord){
        return buildError(true, "No product id provided")
    }

    if(incoming.uidRecord.length != 36){
        return buildError(true, "Product id is not valid")
    }

    if(!incoming.stock){
        return buildError(true, "No stock number provided")
    }

    if(incoming.stock < 0 || incoming.stock > 99999){
        return buildError(true, "Wrong stock number provided")
    }

    return buildError(false, "Everything is valid")
}

export function validAuctionPause( incoming : any) : UserError{
    if(!incoming.uidRecord){
        return buildError(true, "No product id provided")
    }

    if(incoming.uidRecord.length != 36){
        return buildError(true, "Product id is not valid")
    }

    if(incoming.temporaryDisabled == undefined){
        return buildError(true, "No valid state provided")
    }

    return buildError(false, "Everything is valid")
}

function validateType(type : any) : boolean{
    let verified : boolean = true;
    let name : string = "";

    if(!type){        
        return false;
    }

    if(!type.color && !type.size){
        return false;
    }

    if(type.color){
        Object.keys(type.color).forEach( e => {
            if(type.color[e].value === undefined || 
               type.color[e].image === undefined || 
               type.color[e].title === undefined ||
               type.color[e].color === undefined)    
                 verified = false;
               
            Object.keys(type.color[e]).forEach( val => {                
                if(!validateKeys(val))
                     verified = false;
            }); 
        });
    }

    if(type.size){
        Object.keys(type.size).forEach( e => {
            if(type.size[e].value === undefined ||                
               type.size[e].title === undefined)    
                 verified = false;    

            Object.keys(type.size[e]).forEach( val => {
                if(!validateKeys(val))
                    verified = false;
            });
        });
    }
        
    return verified;
}

function validateKeys( e : any){       
    if(e == 'image' ||
       e == 'title' || 
       e == 'value' || 
       e == 'disabled' ||
       e == 'color'
    ){
        return true;
    }

    return false;
}