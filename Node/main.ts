/* Db. connector */
import { initDatabase } from './Database/database.controller'

/* Dev. modules */
import * as morgan from 'morgan';

/* Dep. modules */
import * as path from 'path';
import * as http from 'http';
import * as flash from 'connect-flash';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as express_upload from 'express-fileupload'

import Loader from './Utils/Controllers/controller.loader'
import AuctionLoader from './Services/Auction/auction.loader'
import Realtime from './Controllers/realtime.controller'

/* Local modules */
import UserApi from './Api/user.api';
import AuctionApi from './Api/auction.api'

import Renderer from './Pages/main.renderer';
import Auth from './Authintication/auth.controller'



export class Server {
    private auction : AuctionLoader;
    private realtime : Realtime;
    private loader : Loader;
    private port : number;   
    private app;
    private server; 

    constructor(port : number) {

        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);

        this.setUses();
        this.setEndpoints();
      
        this.setDatabase();
        this.setAuth();

        this.setAuction()
            .then( () => this.setControllers() );
    }


    public  startServer(){
        this.server.listen(this.port, () => console.log('Server was started'));
    }


    private async setAuction() : Promise<any>{
        this.auction = new AuctionLoader();
        await this.auction.StartLoop();
        this.auction.HandleExcept();
    }

    private setEndpoints() : void{
        this.app.get('/', Renderer.live);
        this.app.get('/contact', Renderer.contact);
        this.app.get('/stock', Renderer.stock);
        this.app.get('/signUp', Renderer.signup);
        this.app.get('/product/id:product', Renderer.product)
    }

    private setControllers() : void {
        this.realtime = new Realtime(this.server);
        this.loader = new Loader(this.app);
        
        this.loader.LoadController(new UserApi());
        this.loader.LoadController(new AuctionApi());
    }

    private setDatabase() : void{
        initDatabase();
    }

    private setUses() : void{
        this.app.use(flash());
        this.app.use(express_upload());
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.set('views', path.join(__dirname, '../Views'));
        this.app.set('view engine', 'ejs');

        this.app.use(express.static(path.join(__dirname, '../Resources')));
    }

    private setAuth() : void{
        var auth = new Auth(this.app);
    }


}

var ApplicationServer : Server = new Server(8080);
ApplicationServer.startServer();

export default ApplicationServer;