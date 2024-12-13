const jwt = require('jsonwebtoken');
const appConfig = require('../config');

const createAccessToken = (payload) => {
  return jwt.sign(payload, appConfig?.secret, {
    expiresIn: parseInt(appConfig?.atkExp),
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, appConfig?.rtkSecret, {
    expiresIn: parseInt(appConfig?.rtkExp),
  });
};

module.exports = { createAccessToken, generateRefreshToken };
