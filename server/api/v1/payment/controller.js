/* eslint-disable no-underscore-dangle */
const get = require('lodash/get');
const Model = require('../campaigns/model');
const Payment = require('./model');
const { createCardToken, createCustomer, makePayment } = require('./service');
const { updateUser, addBillingCustomerId } = require('../user/service');

async function createCardTokenHandler(req, res) {
  const {
    cardNumber, cardExpYear, cardExpMonth, cardCvc,
  } = req.body;
  console.log('req body', req.body);
  console.log('req user', req.user);
  const creditInfo = {
    'card[number]': cardNumber,
    'card[exp_year]': cardExpYear,
    'card[exp_month]': cardExpMonth,
    'card[cvc]': cardCvc,
  };
  try {
    // create card token
    const { card, id } = await createCardToken(creditInfo);

    const { user } = req;
    const creditCards = get(user, 'billing.creaditCards', []);

    const customer = {
      billing: {
        creditCards: creditCards.concat({
          expMonth: card.exp_month,
          expYear: card.exp_year,
          name: card.name,
          mask: card.mask,
          tokenId: id,
        }),
        // customerId: id
      },
    };
    const response = await updateUser(req.user._id, customer);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: 'Error with token card epayco',
      err,
    });
  }
}

async function createCustomerHandler(req, res) {
  try {
    const { user } = req;
    const { data } = await createCustomer(user);

    const newUser = await addBillingCustomerId(user, data.customerId);

    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error with customer epayco',
      error,
    });
  }
}

async function createPaymentHandler(req, res) {
  try {
    const { user, body: payment } = req;
    console.log('req.body (payment) :', req.body);
    const { data, success } = await makePayment(user, payment);
    console.log('data :', data);
    if (!success) {
      return res.status(400).json(data);
    }
    // history payment
    await Payment.create({
      userId: user._id,
      refId: data.recibo,
      bill: payment.bill,
      description: payment.description,
      value: payment.value,
      tax: payment?.tax,
      taxBase: payment?.taxBase,
    });
    const currentCampaign = await Model.findOne({ _id: payment.campaignId });
    console.log('donaciones actuales :', currentCampaign.donations);
    currentCampaign.donations += Number(payment.donateAmount);
    currentCampaign.donationTimes += 1;
    await currentCampaign.save();
    console.log('donaciones actuales :', currentCampaign.donations);
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

module.exports = {
  createCardTokenHandler,
  createCustomerHandler,
  createPaymentHandler,
};
