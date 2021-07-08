class SwiperService {
    namespace = null;
    constructor(ioServer) {
        this.namespace = ioServer.of('/swiper');
        this.registerNameSpace();
    }

    registerNameSpace() {
        this.namespace.on('connection', (socket) => {
            console.log("user connected")
            console.log(socket.request.user)
            this.registerListeners(socket);
        });
    }

    registerListeners(socket) {
        socket.on('send', () => {
            console.log('send emitted..')
        })
    }
}

module.exports = SwiperService