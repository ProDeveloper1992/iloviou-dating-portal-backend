const { MESSAGES } = require("../utils/common.messages");

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({
            code: 401,
            message: MESSAGES.UNAUTHORIZED,
        });
    }
}

module.exports = {
    isAuthenticated
}