const { getSwiperUsers } = require('../../../modules/swiper/swiper.controller');

class SwiperService {
    constructor(ioServer) {
        this.namespace = ioServer.of('/swiper');
        this.registerNameSpace();
    }

    registerNameSpace() {
        this.namespace.on('connection', (socket) => {
            console.log("user connected")
            // console.log(socket.request.user)
            this.registerListeners(socket);
        });
    }

    registerListeners(socket) {
        socket.on('send', () => {
            console.log('send emitted..')
        })

        socket.on('sendReqForNewSwiperList', async () => {
            const users = await getSwiperUsers();
            socket.emit('getResForNewSwiperList', users);
        })
    }
}

module.exports = SwiperService