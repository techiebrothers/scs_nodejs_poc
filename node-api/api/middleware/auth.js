const jwt = require("jsonwebtoken");
const User = require('../models/user.model');

const config = process.env;

const verifyToken = (req, res, next) => {
    if (!req.headers["authorization"]) {
        // return res.status(403).send({ success: false, message: "A token is required for authentication" });
        return res.status(401).json({
            status: "ERROR",
            code: 401,
            message: "A token is required for authentication",
            data: [],
            error: []
        });
    }

    var token = req.headers["authorization"].split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        User.findById(req, decoded.id, function (err, user) {
            if (err) {
                console.log('err', err);
                res.status(500).send({
                    status: "ERROR",
                    code: 500,
                    message: "Internal Server Error",
                    data: [],
                    error: err
                });
                return next();
            } else {
                req.loged_user = user[0];
                req.loged_user.timezone = user.length && req.loged_user.timezone ? req.loged_user.timezone : '+00:00';
                return next();
            }
        });
    } catch (err) {
        return res.status(401).json({
            status: "ERROR",
            code: 401,
            message: "Token is expired.",
            data: [],
            error: []
        });
    }
};

module.exports = verifyToken;