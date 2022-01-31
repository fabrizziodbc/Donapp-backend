const get = require('lodash/get');
const ePayco = require('epayco-sdk-node');
const { epaycoKey } = require('../../../config/index');

const epayco = ePayco({
  apiKey: epaycoKey.public,
  privateKey: epaycoKey.private,
  lang: 'ES',
  test: true,
});

async function createCardToken(creaditCardInfo) {
  return epayco.token.create(creaditCardInfo);
}

async function createCustomer(user) {
  const customerInfo = {
    token_card: get(user, 'billing.creditCards[0].tokenId'),
    name: user.name,
    last_name: user.lastName,
    email: user.email,
    default: true,
  };
  return epayco.customers.create(customerInfo);
}

async function makePayment(user, payment) {
  const defaultTokenId = get(user, 'billing.creaditCards[0].tokenId');
  const customerId = get(user, 'billing.customerId');

  const paymentInfo = {
    token_card: defaultTokenId,
    customer_id: customerId,
    doc_type: get(payment, 'docType'),
    doc_number: get(payment, 'docNumber'),
    name: get(payment, 'name', user.firstName),
    last_name: get(payment, 'lastName', user.lastName),
    email: get(payment, 'email', user.email),
    city: get(payment, 'city'),
    address: get(payment, 'address'),
    phone: get(payment, 'phone'),
    cell_phone: get(payment, 'cellPhone'),
    bill: get(payment, 'bill'),
    description: get(payment, 'description'),
    value: get(payment, 'value'),
    tax: get(payment, 'tax'),
    tax_base: get(payment, 'taxBase'),
    currency: get(payment, 'currency'),
    dues: get(payment, 'dues'),
  };
  return epayco.charge.create(paymentInfo);
}

module.exports = {
  createCardToken,
  createCustomer,
  makePayment,
};
