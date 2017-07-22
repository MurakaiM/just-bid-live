import { isValidNumber } from 'libphonenumber-js' 

export interface UserError{
    invalid : boolean,
    reason : string
}

function buildSignUpError(err,msg) : UserError{
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
            return buildSignUpError(true, "Inputs fields are wrong");

    else return buildSignUpError(false, "Everything is valid")
}

export function validSignUp(incoming : any) : UserError {
    
    if(!validateEmail(incoming.email)){
        return buildSignUpError(true,'Your email is badly formatted');
    }

    if(incoming.password.length < 6){
        return buildSignUpError(true,'Your password is badly formatted');
    }



    if(!isValidNumber(incoming.phone)){
        return buildSignUpError(true,"Your phone is invalid");
    }    


    if(!incoming.hasOwnProperty('email') 
        || !incoming.hasOwnProperty('password') 
        || !incoming.hasOwnProperty('firstName') 
        || !incoming.hasOwnProperty('lastName')) 
    return buildSignUpError(true,'There is empty required field');


    return buildSignUpError(false,'There is no problems with validation');
}

export function validRequestPassword( incoming : any) : UserError{
    if(!validateEmail(incoming.email)){
        return buildSignUpError(true,'Your email is badly formatted');
    }

    return buildSignUpError(false,'There is no problems with validation');
}

export function validResetPassword( incoming : any) : UserError{
   
    if(!validateEmail(incoming.email)){
        return buildSignUpError(true,'Your email is badly formatted');
    }
    
    if(incoming.password.length < 6){
        return buildSignUpError(true,'Your password is badly formatted');
    }

    return buildSignUpError(false,'There is no problems with validation');
} 

export function validAuction( incoming : any ) : UserError{
    if(incoming.uidProduct == undefined)
        return buildSignUpError(true,'Prodcuct association id is wrong');

    if(incoming.uidProduct.length != 36 ) 
        return buildSignUpError(true,'Prodcuct association is wrong');

    if(incoming.currentBid == undefined || incoming.currentBid == null) 
        return buildSignUpError(true,'Starting price is empty');
    
    if(incoming.currentBid == 0) 
        return buildSignUpError(true,'Starting price can not be 0');
    
    if(!Number.isInteger(incoming.inStock) && incoming.inStock)
        return buildSignUpError(true, 'Wrong in stock number');


    return buildSignUpError(false, "Everything is valid");
}