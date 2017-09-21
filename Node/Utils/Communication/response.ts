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
    Finished
}

export class RuleController {    
    private currentState : RCState;
    private resolveCallback : Function;
    private answerableParams : any;

    constructor(fn : Function) {
        this.currentState = RCState.Pedning;
        fn(this.resolve);  
    }

    public allowed = (fn : Function) => {         
        
        if (this.currentState == RCState.Resolved) {          
            fn(this.answerableParams[0])
            this.setProp(RCState.Finished)
        } else { 
            this.resolveCallback = fn;
        }

    }

    public setProp = prop => this.currentState = prop;
    

    public resolve = (...args) => {

        if (this.resolveCallback === null || this.resolveCallback === undefined) {
            this.answerableParams = args;
        }
        else { 
            this.resolveCallback(args);
            this.setProp(RCState.Finished)
        }

        this.setProp(RCState.Resolved);
        
    }   
}