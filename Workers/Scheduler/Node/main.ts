/* Db. connector */


/* Dev. modules */
import * as morgan from 'morgan';



/* Dep. modules */
import * as path from 'path';
import * as http from 'http';
import * as flash from 'connect-flash';
import * as passport from 'passport'
import * as bodyParser from 'body-parser';
import * as express from "express";
import * as express_upload from 'express-fileupload'
import * as compression from 'compression'


export class Server {
    private port : number;   
    private app;
    private server; 

    constructor(port : number) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
    }


    public startServer(){
        this.server.listen(this.port, () => console.log('Server was started'));
    }

}


process.on('uncaughtException', function(err) {
    console.log("-------------uncaughtException-------------")
    console.log(err);
    console.log("-------------------------------------------");
})
  
  

const ApplicationServer : Server = new Server(keys.PORT);
ApplicationServer.startServer();

export default ApplicationServer;