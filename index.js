const http = require('http');
const app = require('./server');
const { connect } = require('./server/database');
const config = require('./server/config');
const { connect: connectSocket, socket } = require('./server/config/socket');

const { database, port } = config;

console.log('initial config', config);

connect({
  username: database.username,
  password: database.password,
  databaseName: database.name,
  url: database.url,
});

const server = http.createServer(app);

connectSocket(server);
const listen = server.listen(port, () => {
  // socket status
  socket.io.on('connection', (resSocket) => {
    console.log(`Socket connected: ${resSocket.id}`);
  });
  socket.io.on('disconnect', (resSocket) => {
    console.log(`Socket disconnected: ${resSocket.id}`);
  });

  console.log(`server running at ${port}`);
});

module.exports = { server, listen };
