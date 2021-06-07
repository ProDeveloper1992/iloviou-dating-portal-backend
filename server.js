require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const morgan = require('morgan');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const createSocketServer = require('./services/socket');
const app = express();
const config = require('./config');

//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use((req, res, next) => {
    // CORS header
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key, Authorization');

    if (req.method == 'OPTIONS') res.status(200).end();
    else next();
});

//Database connection
mongoose.connect(config.mongo.uri, config.mongo.options)
console.log('MongoDB connected')

const server = require('http').createServer(app); //separate server instance for socket service
createSocketServer(server);

//Serve routes
require('./routes')(app);

//Start server
server.listen(config.port, () => {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
}).on('error', (error) => {
    console.log("\x1b[31m", 'Server Error 🙄', error);
})
