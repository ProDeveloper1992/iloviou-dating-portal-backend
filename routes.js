//Application routes
const authRoutes = require('./auth');

const routes = app => {
    app.use('/api/authentication', authRoutes);
}

module.exports = routes;