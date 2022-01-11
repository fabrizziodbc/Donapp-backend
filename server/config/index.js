require('dotenv').config();

const getEnv = () => {
  let databaseUrl;
  if (process.env.NODE_ENV === 'development') {
    databaseUrl = process.env.DATABASE_URL_DEV;
  }
  if (process.env.NODE_ENV === 'test') {
    databaseUrl = process.env.DATABASE_URL_TEST;
  }
  return databaseUrl;
};

const config = {
  port: process.env.PORT || 5000,
  jwtsecret: 'Your secret is here',
  database: {
    url: getEnv(),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
};

module.exports = config;
