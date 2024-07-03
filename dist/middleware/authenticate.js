"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.isTokenExpired = void 0;
const jwt = require('jsonwebtoken');
const isTokenExpired = (token) => Date.now() >= JSON.parse(atob(token.split('.')[1])).exp * 1000;
exports.isTokenExpired = isTokenExpired;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_STRING
    if (token == null)
        return res.sendStatus(401); // if there's no token
    if ((0, exports.isTokenExpired)(token))
        return res.sendStatus(401); // if the token is expired
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err)
            return res.sendStatus(403); // any error means a bad token
        req.user = user;
        next(); // proceed to the next middleware function
    });
};
exports.authenticateToken = authenticateToken;
