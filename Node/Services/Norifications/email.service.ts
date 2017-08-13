import * as SparkPost from 'sparkpost'

interface Verification{
    uid : string,
    email : string,
    name : string
}

export default class Notificator{
    public static Instance : Notificator;
    private sparky : SparkPost;
    private domain : string;
  
    constructor(apiKey : string, domain : string){
        this.sparky = new SparkPost(apiKey);
        this.domain = domain;

        Notificator.Instance = this;
    }

    public sendVerification(data : Verification) : Promise<any>{
        let options = {
            num_rcpt_errors : 3
        };
        let transmission = {            
            substitution_data : {
                name : data.name,
                email : data.email,
                link : this.verificationLink(data.uid),
                dynamic_html : {
                    button : `<a href="${this.verificationLink(data.uid)}" class="href"> Verify Account </a>`
                }
            },
            content : {
                template_id : 'verification'                
            },            
            recipients: [
                { address: data.email }
            ]
        };
        
        return this.sparky.transmissions.send(transmission,options);         
    }

    public sendPasswordreset(data : any) : Promise<any>{
        let options = {
            num_rcpt_errors : 3
        };
        let transmission = {            
            substitution_data : {
                name : data.name,
                email : data.email,
                linker : "LELLLELLELE"
            },
            content : {
                template_id : 'verification'                
            },            
            recipients: [
                { address: data.email }
            ]
        };
        
        return this.sparky.transmissions.send(transmission,options); 
    }

    private verificationLink( uuid : string ){
        return `${this.domain}/verification/${uuid}`
    }
    
    private passwordLink( id : string){
        return `${this.domain}/reset/${id}`
    }
}


