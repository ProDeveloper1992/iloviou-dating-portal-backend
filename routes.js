//Application routes
const authRoutes = require('./auth');
const userRoutes = require('./modules/user');
const swiperRoutes = require('./modules/swiper');
const uploadRoutes = require('./modules/upload');

const routes = app => {
    app.use('/api/authentication', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/swiper', swiperRoutes);
    app.use('/api/upload', uploadRoutes);
}

module.exports = routes;