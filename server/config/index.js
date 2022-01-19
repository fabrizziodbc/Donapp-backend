require('dotenv').config();

const getEnv = () => {
  let databaseUrl;
  if (process.env.NODE_ENV === 'development') {
    databaseUrl = process.env.DATABASE_DEV;
  }
  if (process.env.NODE_ENV === 'test') {
    databaseUrl = process.env.DATABASE_TEST;
  }
  return databaseUrl;
};

const config = {
  port: process.env.PORT || 5000,
  jwtsecret: 'Your secret is here',
  database: {
    name: getEnv(),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    url: process.env.DATABASE_URL,
  },
};

module.exports = config;
