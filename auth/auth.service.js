const jwt = require('jsonwebtoken');
const config = require('../config');
const { MESSAGES } = require("../utils/common.messages");

const isAuthenticated = (req, res, next) => {
    console.log('req.cookies : ', req.cookies);
    console.log('req.isAuthenticated : ', req.isAuthenticated());
    console.log('req.session', req.session);
    console.log('req.user : ', req.user);
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({
            code: 401,
            message: MESSAGES.UNAUTHORIZED,
        });
    }
}

const signToken = payload => {
    return jwt.sign(payload, config.secrets.session, { expiresIn: config.jwt.expiresIn });
};

const verifyToken = token => {
    return jwt.verify(token, config.secrets.session);
}

module.exports = {
    isAuthenticated,
    signToken,
    verifyToken
}