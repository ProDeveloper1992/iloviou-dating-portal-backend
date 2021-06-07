const io = require('socket.io');

const createSocketServer = (server) => {
    const ioServer = io().listen(server, {
        path: '/socket'
    });

    //use this ioServer instance in other services
}

module.exports = createSocketServer;