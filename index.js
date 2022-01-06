const http = require('http');
const app = require('./server');
const { connect } = require('./server/database');
const config = require('./server/config');

const { database, port } = config;

console.log('initial config', config);

connect({
  url: database.url,
  username: database.username,
  password: database.password,
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
