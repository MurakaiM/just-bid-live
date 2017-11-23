/* Db. connector */
import { initDatabase } from './Database/database.controller'
import Redis from './Database/database.redis'

/* Dev. modules */
import * as morgan from 'morgan';

/* Keys */
import * as keys from './keys'

/* Dep. modules */
import * as path from 'path';
import * as http from 'http';
import * as flash from 'connect-flash';
import * as passport from 'passport'
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as express_upload from 'express-fileupload'
import * as compression from 'compression'

import Loader from './Utils/Controllers/controller.loader'
import Middleware from './Utils/Middleware/middlewares'
import Notificator from './Services/Norifications/email.service'
import AuctionLoader from './Services/Auction/auction.loader'
import Realtime from './Controllers/realtime.controller'
import StripeGateway from './Payments/stripe.gateway'
import StripeCharges from './Payments/stripe.charges'

/* Local modules */
import UserApi from './Api/user.api';
import AdminApi from './Api/admin.api'
import PaymentApi from './Api/payment.api'
import AuctionApi from './Api/auction.api'
import SellerApi from './Api/seller.api'
import WebhookApi from './Api/webhooks.api'
import NotificationApi from './Api/notification.api'

import Renderer from './Pages/main.renderer';
import Auth from './Authintication/auth.controller'
import Storage from './Utils/Controllers/storage'
import Statistics from './Services/Statistics/statistics.loader'

export class Server {
    private auction : AuctionLoader;
    private gateway : StripeGateway;
    private socialHandler : Function;
    private storage : Storage;
    private realtime : Realtime;
    private redis : Redis;
    private loader : Loader;
    private statistics : Statistics;
    private notificator : Notificator;

    private port : number;   
    private app;
    private server; 

    constructor(port : number) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);


        this.setUses();
        this.setCustom();             
        this.setDatabase({
            momentally : true
        }).then( result => {           
            this.setAuth();
            return  this.setAuction();
        }).then( result => {           
            this.setPayments();
            this.setControllers();       
            this.setEndpoints();         
        });
    }


    public startServer(){
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
        this.app.get('/about', Renderer.about)

        this.app.get('/earlyaccess', (req,res) => res.render('sellers'))
        this.app.get('/signin', Renderer.signin);
        this.app.get('/signup', Renderer.signup);

        this.app.get('/contact', Renderer.contact);
        this.app.get('/stock', Renderer.stock);
        this.app.get('/help/category', Renderer.helpCategory);      

        this.app.get('/forgot', Renderer.forgot);
        this.app.get('/reset/:link', Renderer.restore);
        this.app.get('/product/id?:product', Renderer.product);

        this.app.get('/my', Renderer.profile)
        this.app.get('/my/auction', Renderer.profileAuction)
        this.app.get('/my/winning/:id', Renderer.winningCheckout)

        /* Seller's endpoints */ 
        this.app.get('/seller/signin', Renderer.sellerSignin);
        this.app.get('/seller/signup', Renderer.sellerSignup); 
        this.app.get('/seller/mystore', Renderer.sellerStore);
    }

    private setControllers() : void {
        this.statistics = new Statistics();
        this.realtime = new Realtime(this.server);
        this.notificator = new Notificator( keys.SPARK_KEY, keys.DOMAIN );
        this.storage = new Storage(this.app, keys.GOOGLE_APP,"avatars-bucket", keys.STORAGE_CREDITNAILS);

        this.loader = new Loader(this.app);
        this.loader.Load(path.join(__dirname, './Api'))

        this.app.get(keys.GOOGLE_AUTH_CALLBACK, passport.authenticate('google', { failureRedirect: '/' }), this.socialHandler);
        this.app.get(keys.FACEBOOK_AUTH_CALLBACK, passport.authenticate('facebook', { failureRedirect: '/' }), this.socialHandler);
            
    }

    private setCustom() : void {
        this.socialHandler = (req, res) => {
           
            if(req.user.isVerified()){
                return res.redirect('/')
            }else if(!req.user.isVerified() && req.user.getProvider() != 'local'){
                return res.redirect( req.session.seller ? '/seller/signing/social/approval' : '/user/signing/social/approval')
            }else{
                let uid = req.user.PublicData.uid;
                return req.session.destroy((err) => {         
                    Realtime.Instance.emitExit(uid);
                    return res.redirect('/')
                });  
            }            
        }
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
       // this.app.use(morgan());

        this.app.use('/wbhook_strp',bodyParser.json({ verify:(req,res,buf) => req.rawBody=buf }))

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
      
        this.app.set('views', path.join(__dirname, '../Views'));
        this.app.set('view engine', 'ejs');

        this.app.use(express.static(path.join(__dirname, '../Resources')));

        this.app.use((req, res, next) => (req.headers['x-forwarded-proto'] || '').toLowerCase() == 'https' ? next() :res.redirect('https://' + req.get('host') + req.url))
          
        this.setStatics();
    }

    private setAuth() : void{
        var auth = new Auth(this.app);
    }


    private setPayments() : void {
        this.gateway = new StripeGateway(keys.STRIPE_PUBLIC,keys.STRIPE_SECRET).GetGateway();
        
        new StripeCharges(this.gateway);
    }

    private setStatics() : void { }
}


process.on('uncaughtException', function(err) {
    console.log("-------------uncaughtException-------------")
    console.log(err);
    console.log("-------------------------------------------");
})
  
  

const ApplicationServer : Server = new Server(keys.PORT);
ApplicationServer.startServer();

export default ApplicationServer;