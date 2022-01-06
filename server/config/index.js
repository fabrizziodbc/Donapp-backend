require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  jwtsecret: 'Your secret is here',
  database: {
    url: process.env.DATABASE_URL,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
};

module.exports = config;
