const cookieParser = require('cookie-parser');
const sessionStore = require('../../server');
const config = require('../../config')

const createSocketServer = (ioServer) => {

    ioServer.on('connection', (socket) => {
        // console.log(socket.request.user)
        console.log('a user connected');
    });

    let namespace = ioServer.of('/');
    namespace.on('connection', (socket) => {
    })

    //use this ioServer instance in other services
}

module.exports = createSocketServer;