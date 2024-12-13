const { config } = require('dotenv-flow');

config();

const appConfig = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  env: process.env.ENV,
  server_url: process.env.SERVER_URL,
  atkExp: process.env.ACCESS_TOKEN_EXP,
  rtkExp: process.env.REFRESH_TOKEN_EXP,
  rtkSecret: process.env.RTK_SECRET,
};

module.exports = appConfig;
