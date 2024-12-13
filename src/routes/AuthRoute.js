const express = require('express');
const {
  login,
  register,
  refreshAccessToken,
  logout,
} = require('../controllers/AuthController');
const {
  isRefreshTokenValid,
  isAuthorized,
} = require('../middlewares/Auth.middleware');

const router = express.Router();

router.post('/signin', login);
router.post('/signup', register);
router.post('/refresh', isRefreshTokenValid, refreshAccessToken);
router.get('/logout', isAuthorized, logout);

module.exports = router;
