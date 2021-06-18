
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({
            code: 401,
            message: 'Unauthorized',
        });
    }
}

module.exports = {
    isAuthenticated
}