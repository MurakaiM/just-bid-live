/* Dev. modules */
const morgan = require('morgan');

/* Dep. modules */
const path = require('path');
const flash = require('connect-flash');
const express = require('express');
const bodyParser = require('body-parser');

/* Local modules */
const database = require('./Database/database.controller');
const PMain = require('./Pages/main.renderer');

/* Static init */
const droplet = express();
const server = require('http').createServer(droplet);


function startServer(port) {
    setUses(droplet);
    setEndpoints(droplet);

    server.listen(process.env.PORT || 8080, () => console.log('Server was started'));
}



function setUses(app) {
    app.use(flash());
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.set('views', path.join(__dirname, 'Views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(__dirname, '../Resources')));
}

function setEndpoints(app) {
  app.get('/', PMain.live);
  app.get('/contact', PMain.contact);
}



exports.startServer = startServer;
