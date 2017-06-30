export interface Response {
    code : number,
    message : string,
    reason?: string,
    data? : any
}


export function BuildResponse(code,message,...args) : Response{
    return {
        code : code,
        message :message,
        data : args[0],
        reason : args[1]
    };
}



enum RCState{ 
    Pedning,
    Resolved,
    Rejected,
    Finished
}

export class RuleController {    
    private currentState;
    private resolveCallback;
    private answerableParams;

    constructor(fn) {
        fn(this.resolve);  
    }

    public allowed(fn) {          
        
        if (this.currentState == RCState.Resolved) {          
            fn(this.answerableParams)
        } else { 
            this.resolveCallback = fn;
        }

    }

    public setProp (prop){
        this.currentState = prop;
    }

    public resolve = (...args) => {

        if (this.resolveCallback === null || this.resolveCallback === undefined) {
            this.answerableParams = args;
        }
        else { 
            this.resolveCallback(args);
        }

        this.setProp(RCState.Resolved);
        
    }   
}
