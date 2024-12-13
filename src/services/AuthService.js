const jwt = require('jsonwebtoken');
const appConfig = require('../config');
const BlackList = require('../models/BlackList');
const Token = require('../models/Token');
const User = require('../models/User');
const { comparePassword } = require('../utils/utils');

const signUp = async (user) => {
  try {
    const newUser = new User(user);

    const res = await newUser.save();
    return res;
  } catch (error) {
    return error;
  }
};

const signIn = async (user) => {
  try {
    const isPresent = await User.findOne({ email: user?.email });
    if (comparePassword(user?.password, isPresent?.password)) {
      return isPresent;
    }
    return false;
  } catch (error) {
    return error;
  }
};

const getUserByRefreshToken = async (token) => {
  try {
    const tokenData = await Token.findOne({ token });
    if (tokenData) {
      const userData = await User.findById(tokenData.user);
      return userData;
    }
    return false;
  } catch (error) {
    return error;
  }
};

const saveTokenToDb = async (token, userId) => {
  try {
    const isTokenPresent = await Token.findOne({ user: userId });
    if (isTokenPresent) {
      await Token.findByIdAndUpdate(isTokenPresent._id, { token });
      return true;
    }
    const newToken = new Token({
      token,
      user: userId,
      expiry: new Date(Date.now() + parseInt(appConfig?.rtkExp)),
    });
    const data = await newToken.save();
    if (data) {
      return data;
    }
    return false;
  } catch (error) {
    return error;
  }
};

const deleteTokenFromDb = async (userId) => {
  try {
    const data = await Token.findOneAndDelete({ user: userId });
    if (data) {
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
};

const addTokenToBlackList = async (token) => {
  try {
    const decoded = jwt.verify(token, appConfig?.secret);
    const blacklist = new BlackList({
      token: token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    const data = await blacklist.save();
    return data;
  } catch (error) {
    return error;
  }
};

const checkIfTokenBlacklisted = async (token) => {
  try {
    const data = await BlackList.findOne({ token });
    if (data) {
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
};

module.exports = {
  signUp,
  signIn,
  getUserByRefreshToken,
  saveTokenToDb,
  deleteTokenFromDb,
  addTokenToBlackList,
  checkIfTokenBlacklisted,
};
