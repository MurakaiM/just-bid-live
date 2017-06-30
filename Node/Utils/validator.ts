
interface SignUpError{
    valid : boolean,
    reason : string
}

function buildSignUpError(err,msg) : SignUpError{
    return {
        valid : err,
        reason : msg
    }
}

function validateEmail(email) {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
};


export function validSignUp(incoming : any) : SignUpError {
    
    if(!validateEmail(incoming.email)){
        return buildSignUpError(true,'Your email is badly formatted');
    }

    if(incoming.password.length < 6){
        return buildSignUpError(true,'Your password is badly formatted');
    }

    if(!incoming.hasOwnProperty('email') 
        || !incoming.hasOwnProperty('password') 
        || !incoming.hasOwnProperty('firstName') 
        || !incoming.hasOwnProperty('lastName')) 
    return buildSignUpError(true,'There is empty required field');


    return buildSignUpError(false,'There is no problems with validation');
}