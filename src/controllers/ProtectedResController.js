const httpError = require('../utils/httpError');
const httpResponse = require('../utils/httpResponse');

const protectedResource = async (req, res, next) => {
  try {
    const data = {
      id: 1,
      email: 'test@test.com',
    };

    httpResponse(req, res, 200, 'Success', data);
  } catch (error) {
    httpError(next, error, req, 500);
  }
};

module.exports = { protectedResource };
