const http = require('http');
const app = require('./server');
const { connect } = require('./server/database');
const config = require('./server/config');

const { database, port } = config;

console.log('initial config', config);

connect({
  username: database.username,
  password: database.password,
  databaseName: database.name,
  url: database.url,
});

const server = http.createServer(app);

const listen = server.listen(port, () => {
  console.log(`server running at ${port}`);
});

module.exports = { server, listen };
