
const isAuthenticated = (req, res, next) => {
    console.log("req.user =>", req.user)
    console.log('logged in: ' + req.isAuthenticated());
    console.log('method=>', req.method)
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