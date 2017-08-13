
import * as GCStorage from '@google-cloud/storage'
import * as crypto from 'crypto'

export default class FileUploader{
    public static Instance : FileUploader;    
    private bucket;
   
    bucketId : string;
    appId : string;
    
    constructor( app, appId: string, bucketId:string, credits : JSON){ 
       
        this.appId = appId;
        this.bucketId = bucketId;
        this.initBucket(credits);

        FileUploader.Instance = this;
    }   


    public uploadAvatar(fileData : any) : Promise<any>{
        return this.uploadFile(fileData,'avatars');
    }

    private uploadFile(fileData : any, directory : string) : Promise<any> {       
        return new Promise((resolve, reject) => {
            if(!fileData){
                return resolve('');
            }

            const gcsname = directory+"/"+ this.hashName();
            const file = this.bucket.file(gcsname);

            const stream = file.createWriteStream({ metadata: {contentType: fileData.mimetype}});
            stream.on('error', (err) => reject(err));
            stream.on('finish', () => resolve(this.getPublicUrl(gcsname)));
            stream.end(fileData.data);          
        });       
    }

    private getPublicUrl(filename : string) : string {
        return `https://storage.googleapis.com/${this.bucketId}/${filename}`;
    }

    private initBucket(credits : JSON) {     
        var gcs = GCStorage({
            projectId: this.appId,
            credentials:  credits
            });

        this.bucket = gcs.bucket(this.bucketId);
    }



    private hashName() : string{
       var length : number = this.getRandomNumber(50,100);
       
       var randomed = crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);

       var position = this.getRandomNumber(0, randomed.length-1); 

       return [randomed.slice(0, position), Date.now(), randomed.slice(position)].join('');
    }

    private getRandomNumber(min, max) : number {
        return Math.random() * (max - min) + min;
    }
    
}