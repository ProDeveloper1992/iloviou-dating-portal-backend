let SwiperService = require('./swiper.service');

const createSocketServices = (ioServer) => {
    new SwiperService(ioServer);
}

module.exports = createSocketServices;