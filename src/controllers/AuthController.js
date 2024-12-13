const logger = require('../utils/logger');
const httpError = require('../utils/httpError');
const httpResponse = require('../utils/httpResponse');
const {
  signUp,
  signIn,
  saveTokenToDb,
  getUserByRefreshToken,
  deleteTokenFromDb,
  addTokenToBlackList,
} = require('../services/AuthService');
const {
  createAccessToken,
  generateRefreshToken,
} = require('../utils/tokenUtils');

const register = async (req, res, next) => {
  try {
    const data = await signUp(req.body);
    if (data) {
      return httpResponse(req, res, 201, 'User registration success', {});
    }
    httpResponse(req, res, 400, 'Failed to register user', data);
  } catch (error) {
    logger.error('Something went wrong', { error: error });
    httpError(next, error, req, res, 500);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await signIn(req?.body);
    if (!user) {
      return httpResponse(req, res, 404, 'Account not found', {});
    }
    const payload = {
      userId: user?._id,
      email: user?.email,
    };

    const accessToken = createAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await saveTokenToDb(refreshToken, user?._id);

    const responseData = {
      user,
      accessToken,
      refreshToken,
    };
    httpResponse(req, res, 200, 'Login successful', responseData);
  } catch (error) {
    httpError(next, error, req, res, 500);
    logger.error('Something went wrong', { error: error });
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = await getUserByRefreshToken(refreshToken);
    if (!user) {
      return httpResponse(
        req,
        res,
        400,
        'Invalid token or Token Expired. Please login again',
        null,
      );
    }

    const payload = {
      userId: user?._id,
      email: user?.email,
    };
    const accessToken = createAccessToken(payload);
    httpResponse(req, res, 200, 'Token refreshed', { accessToken });
  } catch (error) {
    httpError(next, error, req, 500);
    logger.error('Something went wrong', { error: error });
  }
};

const logout = async (req, res, next) => {
  try {
    const accessToken = req.headers['authorization'];
    const token = accessToken.split(' ')[1];
    const data = await deleteTokenFromDb(req?.user?.userId);
    if (data) {
      await addTokenToBlackList(token);
      return httpResponse(
        refreshAccessToken,
        res,
        200,
        'Logout Successful',
        null,
      );
    }

    return httpResponse(req, res, 400, 'Something went wrong', data);
  } catch (error) {
    httpError(next, error, req, 500);
    logger.error('Something went wrong', { error: error });
  }
};

module.exports = { register, login, refreshAccessToken, logout };
