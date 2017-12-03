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

export function validateEmail(email) {
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


    if(!incoming.material){
        return buildError(true, "No material title provided")
    }

    if(incoming.material.length == 0){
        return buildError(true, "Too short material title provided")
    }

    if(!incoming.guarantee){
        return buildError(true, "No guarantee provided")
    }

    if(incoming.guarantee <= 0){
        return buildError(true, "Wrong guarantee provided")
    }


    if(!incoming.delivery){
        return buildError(true, "No delivery time provided")
    }

    if(incoming.delivery <= 0){
        return buildError(true, "Wrong delivery time provided")
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

    if(!validateType(incoming.colors, incoming.sizes)){
        return buildError(true, "Wrong types was passed")
    }

    if(!validateStock(incoming,incoming.colors, incoming.sizes)){
        return buildError(true, "Wrong stock values provided")
    }

    return buildError(false, "Everything is okay")

}

export function validStock(incoming : any) : UserError{
    if(!incoming.productId){
        return buildError(true, "No product id provided")
    }
    if(incoming.productId.length == 0){
        return buildError(true, "Product id is wrong")
    }

    if(!incoming.typeId){
        return buildError(true, "No type id provided")
    }
    if(incoming.typeId.length == 0){
        return buildError(true, "Type id is wrong")
    }

    if(!incoming.stock){
        return buildError(true, "No stock provided")
    }
    if(incoming.stock <= 0){
        return buildError(true, "Stock number is wrong")
    }

    return buildError(false, "Everything is valid")
}

export function validChange(incoming : any) : UserError{
    if(!incoming.id){
        return buildError(true, "No product id provided")
    }

    if(incoming.id.length != 36){
        return buildError(true, "Product id is not valid")
    }

    if(!incoming.description){
        return buildError(true, "No short description was represented")
    }

    if(!incoming.fldescription){
        return buildError(true, "No full description was represented")
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

export function validDisableType( incoming : any) : UserError{
    if(!incoming.uid){
        return buildError(true, "No product id provided")
    }
    if(incoming.uid.length == 0){
        return buildError(true, "Product id is wrong")
    }

    if(!incoming.group){
        return buildError(true, "No group id provided")
    }

    if(!incoming.name){
        return buildError(true, "No name id provided")
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

export function validId(incoming : any) : UserError{
    if(!incoming.id){
        return buildError(true, "No product id provided")
    }

    if(incoming.id.length != 36){
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

export function validAuctionPay(incoming : any) : UserError{
    if(!incoming.auctionId) return buildError(true, "No auction id provided")

    if(incoming.auctionId.length !== 36) return buildError(true, "Wrong auction id format was provided")


    if(!incoming.winningId) return buildError(true, "No winning id provided")
            
    if(incoming.winningId.length !== 36) return buildError(true, "Wrong winning id format was provided")


    if(!incoming.nonce) return buildError(true, "No payment nonce is provided")    
        

    return buildError(false, "Everything is valid")
}

export function validSocialSignUp(incoming : any) : UserError{
    if(!incoming.firstName) return { invalid : true, reason : 'Wrong first name' }

    if(!incoming.lastName) return { invalid : true, reason : 'Wrong last name' }

    if(!incoming.birthday) return { invalid : true, reason : 'Wrong birthday' }

    if(!isValidNumber(incoming.phone)) return { invalid : true, reason : 'Wrong phone number' }

    return { invalid : false, reason : 'Everything is valid' }
}

export function validateWinningStatus(incoming : any) : UserError{
    if(!incoming.uid) return buildError(true, "No winning id was represented")

    if(incoming.uid.length !== 36) return buildError(true, "Winning id format is wrong")

    if(!incoming.status) return buildError(true, "No status was provided")

    return buildError(false, "Everything is valid")
}

export function validateWinningTrack(incoming : any) : UserError{
    if(!incoming.record) return buildError(true, "No winning id was represented")
    
    if(incoming.record.length !== 36) return buildError(true, "Winning id format is wrong")
    
    if(!incoming.track) return buildError(true, "No track was provided")
    
    return buildError(false, "Everything is valid")    
}

export function validateWinningFind(incoming : any) : UserError{

    if(!incoming.winningId) return buildError(true, "No winning id was provided")

    if(incoming.winningId.length !== 36) return buildError(true, "Wrong format for winning id")

    return buildError(false, "Everything is valid")
}

export function validStoreUpdate(incoming : any) : UserError{

    if(!incoming.title) return buildError(true, "No title was provided")

    if(incoming.title.length == 0) return buildError(true, "Too short title was provided")


    if(!incoming.subtitle) return buildError(true, "No subtitle was provided")

    if(incoming.subtitle.length == 0) return buildError(true, "Too short subtitle was provided")


    if(!incoming.description) return buildError(true, "No description was provided")

    if(incoming.description.length == 0) return buildError(true, "Too short description was provided")

    if(incoming.description.length > 255) return buildError(true, "Too long short description was provided")


    return buildError(false, "Everything is valid")
}

export function validQuestionCreate(incoming : any) : UserError{
    
    if(!incoming.message) return buildError(true, "No message was provided")

    if(!incoming.email) return buildError(true, "No email was provided")

    if(!incoming.firstName) return buildError(true, "No firstName was provided")

    if(!incoming.lastName)  return buildError(true, "No lastName was provided")

    if(!incoming.type)  return buildError(true, "No type was provided")

    if(incoming.type < 0 || incoming.type > 5) return buildError(true, "Wrong type was provided")

    return buildError(false, 'Everything is valid')
}



function validateType(colors : any, sizes : any) : boolean{
    let verified : boolean = true;
    let name : string = "";

    if(!colors){
        return false;
    }

    if(Object.keys(colors).length == 0){
        return false;
    }

  
    Object.keys(colors).forEach( e => {
        if(colors[e].value === undefined ||               
           colors[e].title === undefined ||
           colors[e].path === undefined ||      
           colors[e].color === undefined)    
             verified = false;
    });
    
    if(sizes){
        Object.keys(sizes).forEach( e => {
            if(sizes[e].value === undefined ||               
               sizes[e].title === undefined)              
                 verified = false;
        });
    }
   
    return verified;
}

function validateStock(params : any, colors : any , sizes : any) : boolean{
    let verified : boolean = true;

    if(sizes.length == 0){
        Object.keys(colors).forEach(e => {
            console.log(params[e])
            if(!params[e] || params[e] == 0 || params[e] < 0){
                verified = false;
            }
        })
    }else{
        for( var f of Object.keys(colors) ){
            for( var s of Object.keys(sizes) ){            
                if(!params[f+s] || params[f+s] == 0 || params[f+s] < 0){
                    verified = false;
                    return false;
                }
            }
        }
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