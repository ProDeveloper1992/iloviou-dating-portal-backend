//Application routes
const authRoutes = require('./auth');
const userRoutes = require('./modules/user');

const routes = app => {
    app.use('/api/authentication', authRoutes);
    app.use('/api/user', userRoutes);
}

module.exports = routes;