const SwiperService = require('./swiper/swiper.service');

const createSocketServices = (ioServer) => {
    new SwiperService(ioServer);
}

module.exports = createSocketServices;