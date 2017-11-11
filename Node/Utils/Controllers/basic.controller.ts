export interface ControllerInterface {
    method : RequestType,
    path : string,
    fn : Function,
    middleware? : Array<Function>
}


export default abstract class BasicController {
    private applied : Array<ControllerInterface>;

    constructor(){
        this.applied = [];
        this.Configure();
    }

    protected Get(path : string, handler : Function, middleware? : Array<Function>){
        this.applyComponent(RequestType.GET,path,handler);
    }

    protected Post(path : string, handler : Function, middleware? : Array<Function>){
        this.applyComponent(RequestType.POST,path,handler);
    }
    

    private applyComponent(method : RequestType, path : string , handler : Function, middleware? : Array<Function>){ 
        let data = {
            method : method,
            path : path,
            fn : handler,                
        };

        if(middleware){
            data['middleware'] = middleware;
        }

        this.applied.push(data);       
    }

    protected abstract Configure();

    get Applied(){
        return this.applied;
    }
}




export enum RequestType {
    GET,
    POST
} 

export function Controller(value: any) : any {
    return function (target: BasicController, propertyKey: string, descriptor: PropertyDescriptor) {
        const fn = descriptor.value;
        value.fn = fn;
        descriptor.enumerable = true;
        descriptor.value = (...args) => {             
            return value;
        }
    };
}