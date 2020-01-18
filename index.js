const express = require('express');
const fetch = require('node-fetch');
const api_url = 'https://api.telegram.org/bot' + process.env.BOT_TOKEN;

const app = express();
app.use(express.json());

const shipping = require("./commands/shipping.js");
const safadometro = require("./commands/safadometro.js");
const everyone = require("./commands/everyone.js");

// Send message to a given ID
const sendMessage = async (id, data, parse) => {
  return await fetch(api_url + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      { chat_id: id, text: data, parse_mode: (parse) ? 'Markdown' : '' })
  })
    .then(res => res.json());
};

const sendMessageAndPine = async (id, data, parse) => {
  return await fetch(api_url + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      { chat_id: id, text: data, parse_mode: (parse) ? 'Markdown' : '' })
  })
  .then(res => pineMessage(id, res.json().message_id));
};

const pineMessage = async (id, messade_id) => {
  return await fetch(api_url + '/pinChatMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: id,
      message_id: messade_id,
    })
  })
    .then(res => res.json());
};

app.get('/', (req, res) => { res.send('Hello World!') });


app.post('/' + process.env.ROUTE, async (req, res) => {
  if (!req.body) {
    res.status(200).send('Ok');
    return;
  }

  const { message } = req.body;

  console.log(message);

  if (!message) {
    res.status(200).send('Ok');
    return;
  }

  let parse = true;
  let { text } = message;
  const { chat, from, message_id } = message;

  if (!text) {
    res.status(200).send('Ok');
    return;
  }

  if (text == '/everyone' || text == '/everyone@jorgesafadobot') {
    await sendMessageAndPine(parseInt(chat.id), everyone.all());
    res.status(200).send('Ok');
    return;
  }

  if (text == '/lol' || text == '/lol@jorgesafadobot') {
    await sendMessage(parseInt(chat.id), everyone.lol());
    res.status(200).send('Ok');
    return;
  }

  if (text == '/safadometro' || text == '/safadometro@jorgesafadobot') {
    await sendMessage(parseInt(chat.id), safadometro.percent(from.first_name));
    res.status(200).send('Ok');
    return;
  }

  if (text == '/top' || text == '/top@jorgesafadobot') {
    await sendMessage(parseInt(chat.id), "Ainda Vou Construir isso :(");
    res.status(200).send('Ok');
    return;
  }

  if (text == '/shipping' || text == '/shipping@jorgesafadobot') {
    await sendMessageAndPine(parseInt(chat.id), await shipping.matchShip());
    res.status(200).send('Ok');
    return;
  }


  if (text == '/help' || text == '/help@jorgesafadobot') {
    await sendMessage(parseInt(chat.id), "Ainda não temos um help feito");
    res.status(200).send('Ok');
    return;
  }

  // ignore
  res.status(200).send('Ok');
  return;
});

module.exports = app;