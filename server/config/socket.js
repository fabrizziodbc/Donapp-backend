const socketio = require('socket.io');

const socket = {};

function connect(server) {
  const io = socketio(server);

  socket.io = io;
}

module.exports = {
  connect,
  socket,
};
