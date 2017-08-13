import  BasicController , { ControllerInterface, RequestType } from './basic.controller'


export default class ControllersLoader{
    private app : any;
    private proto : any;
    
    constructor(app : any){
        this.app = app;
    }

    public LoadController(controller : BasicController) : void{   
        controller.Applied.forEach(element => this.ReworkPath(element));
    }

    private ReworkPath(information : ControllerInterface){
       
        switch (information.method) {            
            case RequestType.GET:                
                this.app.get(information.path,information.fn);
                break;          
            case RequestType.POST:
                this.app.post(information.path,information.fn);
                break;   
        
            default:
                break;
        }
    }

}


