const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => req.method === 'OPTIONS',
    message: { message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skip: (req) => req.method === 'OPTIONS',
    message: { message: "Too many auth attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

const createIssueLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,   
    max: 10,
    skip: (req) => req.method === 'OPTIONS',
    message: { message: "Too many issues created, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    createIssueLimiter,
};