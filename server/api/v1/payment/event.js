const { socket } = require('../../../config/socket');

function paymentNotificationEvent(userCampaign, name, value) {
  socket.io.emit(`payment:notification:${userCampaign[0].id}`, { name, value, type: 'payment' });
}

module.exports = {
  paymentNotificationEvent,
};
