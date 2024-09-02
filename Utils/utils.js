const jwt = require("jsonwebtoken");

const generateToken = (payload, isRefreshToken) => {
    if (isRefreshToken) {
        return jwt.sign(payload, process.env.PASSWORD_SECRET_REFRESH, {
            expiresIn: "30min",
        });
    }
    return jwt.sign(payload, process.env.PASSWORD_SECRET, {
        expiresIn: "15min",
    });
};

module.exports = { generateToken };
