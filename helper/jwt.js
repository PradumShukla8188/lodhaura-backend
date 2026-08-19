const jwt = require('jsonwebtoken');
const { config } = require('../config');

const getJwtSecret = () => {
    return config.env?.jwt?.secret || global.secret || 'blogs';
};

const getRefreshSecret = () => {
    return config.env?.jwt?.refreshSecret || getJwtSecret() + '-refresh';
};

const buildPayload = (payload) => ({
    id: payload.id?.toString ? payload.id.toString() : String(payload.id),
    role: payload.role,
});

module.exports = {
    generateToken: (payload) => {
        const secret = getJwtSecret();
        return jwt.sign(buildPayload(payload), secret, {
            expiresIn: config.env?.jwt?.expiresIn || '7d',
        });
    },

    generateRefreshToken: (payload) => {
        const secret = getRefreshSecret();
        return jwt.sign(buildPayload(payload), secret, {
            expiresIn: config.env?.jwt?.refreshExpiresIn || '30d',
        });
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, getJwtSecret());
        } catch (err) {
            console.error('Error verifying token:', err);
            return null;
        }
    },

    verifyRefreshToken: (token) => {
        try {
            return jwt.verify(token, getRefreshSecret());
        } catch (err) {
            console.error('Error verifying refresh token:', err);
            return null;
        }
    },
};
