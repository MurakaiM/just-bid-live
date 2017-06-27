/* Dev. modules */
import * as morgan from 'morgan';

/* Dep. modules */
import * as path from 'path';
import * as http from 'http';
import * as flash from 'connect-flash';
import * as bodyParser from 'body-parser';
import * as express from 'express';

/* Local modules */
const database = require('./Database/database.controller');
import Renderer from './Pages/main.renderer';


export class Server {
    private port : number;
    private app;

    constructor(port : number) {
        this.port = port;
        this.app = express();

        this.setUses();
        this.setEndpoints();
    }


    public  startServer(){
        this.app.listen(this.port, () => console.log('Server was started'));
    }

    public setEndpoints() : void{
        this.app.get('/', Renderer.live);
        this.app.get('/contact', Renderer.contact);
        this.app.get('/stock', Renderer.stock);
        this.app.get('/product/id:product', Renderer.product)
    }

    public setUses(){
        this.app.use(flash());
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.set('views', path.join(__dirname, '../Views'));
        this.app.set('view engine', 'ejs');

        this.app.use(express.static(path.join(__dirname, '../Resources')));
    }


}

var ApplicationServer : Server = new Server(8080);
ApplicationServer.startServer();

export default ApplicationServer;