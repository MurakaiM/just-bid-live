/* Db. connector */
import { initDatabase } from './Database/database.controller'
import Redis from './Database/database.redis'

/* Dev. modules */
import * as morgan from 'morgan';

/* Dep. modules */
import * as path from 'path';
import * as http from 'http';
import * as flash from 'connect-flash';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as express_upload from 'express-fileupload'
import * as keys from './keys'
import * as compression from 'compression'

import Loader from './Utils/Controllers/controller.loader'
import Notificator from './Services/Norifications/email.service'
import AuctionLoader from './Services/Auction/auction.loader'
import Realtime from './Controllers/realtime.controller'

/* Local modules */
import UserApi from './Api/user.api';
import AuctionApi from './Api/auction.api'
import SellerApi from './Api/seller.api'

import Renderer from './Pages/main.renderer';
import Auth from './Authintication/auth.controller'
import Storage from './Utils/Controllers/storage'


export class Server {
    private auction : AuctionLoader;
    private storage : Storage;
    private realtime : Realtime;
    private redis : Redis;
    private loader : Loader;
    private notificator : Notificator;

    private port : number;   
    private app;
    private server; 

    constructor(port : number) {

        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);

        this.setUses();
              
        this.setDatabase({
            momentally : true
        }).then( result => {           
            this.setAuth();
            return  this.setAuction();
        }).then( result => 
            {           
                this.setControllers();       
                this.setEndpoints();         
            }
        );
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
        /* User's endpoints */

        this.app.get('/', Renderer.live);
        this.app.get('/signin', Renderer.signin);
        this.app.get('/contact', Renderer.contact);
        this.app.get('/stock', Renderer.stock);
        this.app.get('/signup', Renderer.signup);
        this.app.get('/forgot', Renderer.forgot);
        this.app.get('/reset/:link', Renderer.restore);
        this.app.get('/product/id?:product', Renderer.product);
        this.app.get('/my', Renderer.profile)

        /* Seller's endpoints */ 
        this.app.get('/seller/signin', Renderer.sellerSignin);
        this.app.get('/seller/signup', Renderer.sellerSignup); 
        this.app.get('/seller/mystore', Renderer.sellerStore);
    }

    private setControllers() : void {
        this.realtime = new Realtime(this.server);
        this.notificator = new Notificator( keys.SPARK_KEY, keys.DOMAIN );
        this.storage = new Storage(this.app, keys.GOOGLE_APP,"avatars-bucket", keys.STORAGE_CREDITNAILS);

        this.loader = new Loader(this.app);
        
        this.loader.LoadController(new UserApi());
        this.loader.LoadController(new AuctionApi());
        this.loader.LoadController(new SellerApi());
    }

    private async setDatabase(options : any) : Promise<any>{
        let message = await initDatabase();
        this.redis = new Redis(keys.REDIS_URL);
        return message;
    }

    private setUses() : void{
        this.app.use(compression());

        this.app.use(flash());
        this.app.use(express_upload());
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

      
        this.app.set('views', path.join(__dirname, '../Views'));
        this.app.set('view engine', 'ejs');

        this.app.use(express.static(path.join(__dirname, '../Resources')));

        this.setStatics();
    }

    private setAuth() : void{
        var auth = new Auth(this.app);
    }


    private setStatics() : void { }
}

var ApplicationServer : Server = new Server(8080);
ApplicationServer.startServer();

export default ApplicationServer;