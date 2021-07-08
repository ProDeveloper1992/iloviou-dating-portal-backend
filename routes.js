//Application routes
const authRoutes = require('./auth');
const userRoutes = require('./modules/user');
const profileRoutes = require('./modules/profile');

const routes = app => {
    app.use('/api/authentication', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/profile', profileRoutes);
}

module.exports = routes;