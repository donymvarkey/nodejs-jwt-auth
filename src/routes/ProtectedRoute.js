const express = require('express');
const router = express.Router();
const {
  isAuthorized,
  isTokenBlackListed,
} = require('../middlewares/Auth.middleware');
const { protectedResource } = require('../controllers/ProtectedResController');

router.get('/', isTokenBlackListed, isAuthorized, protectedResource);

module.exports = router;
