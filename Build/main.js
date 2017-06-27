"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Dev. modules */
const morgan = require("morgan");
/* Dep. modules */
const path = require("path");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const express = require("express");
/* Local modules */
const database = require('./Database/database.controller');
const main_renderer_1 = require("./Pages/main.renderer");
class Server {
    constructor(port) {
        this.port = port;
        this.app = express();
        this.setUses();
        this.setEndpoints();
    }
    startServer() {
        this.app.listen(this.port, () => console.log('Server was started'));
    }
    setEndpoints() {
        this.app.get('/', main_renderer_1.default.live);
        this.app.get('/contact', main_renderer_1.default.contact);
        this.app.get('/stock', main_renderer_1.default.stock);
        this.app.get('/product/id:product', main_renderer_1.default.product);
    }
    setUses() {
        this.app.use(flash());
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.set('views', path.join(__dirname, '../Node/Views'));
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(path.join(__dirname, '../Resources')));
    }
}
exports.Server = Server;
var ApplicationServer = new Server(8080);
ApplicationServer.startServer();
exports.default = ApplicationServer;
