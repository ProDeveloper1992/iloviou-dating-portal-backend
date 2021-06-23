require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const createSocketServer = require('./services/socket');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const app = express();
const config = require('./config');

//Database connection
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
}).on('error', (error) => {
    console.log("\x1b[31m", 'Database connection error:', error);
})


//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.secrets.session));
app.use(morgan('dev'));
app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    rolling: true,
    store: MongoStore.create({
        mongoUrl: config.mongo.uri,
        mongoOptions: config.mongo.options
    }),
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000 //one year - with rolling true
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    // CORS header
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Authorization');

    if (req.method == 'OPTIONS') res.status(200).end();
    else next();
});

const server = require('http').createServer(app); //separate server instance for socket service
createSocketServer(server);

//Serve routes
app.get('/', (req, res) => res.send('Connected to iloveou app backend...'))
require('./routes')(app);

//Start server
server.listen(config.port, () => {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
}).on('error', (error) => {
    console.log("\x1b[31m", 'Server Error 🙄', error);
})
