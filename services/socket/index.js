let swiperService = require('./swiper.service');


const createSocketServices = (ioServer) => {
    swiperService = new swiperService(ioServer);
}


module.exports = createSocketServices;