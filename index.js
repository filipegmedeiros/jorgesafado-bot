const express = require('express');
const fetch = require('node-fetch');
const api_url = 'https://api.telegram.org/bot' + process.env.BOT_TOKEN;

const app = express();
app.use(express.json());

const shipping = require("./commands/shipping.js")

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

const sendMessageReply = async (id, data, reply_to, parse) => {
  return await fetch(api_url + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: id,
      text: data,
      reply_to_message_id: reply_to,
      parse_mode: (parse) ? 'Markdown' : ''
    })
  })
    .then(res => res.json());
};

const parseVariables = (command, message, from, date, reply) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
    hour12: false
  };

  date = (new Date(date * 1000)).toLocaleString('en-GB', options);

  let { answer } = command;
  answer = answer.replace(/%{from\.username}/g, from.username);
  answer = answer.replace(/%{from\.first_name}/g, from.first_name);
  answer = answer.replace(/%{from\.last_name}/g, from.last_name);
  answer = answer.replace(/%{count}/g, parseInt(command.count) + 1);
  answer = answer.replace(/%{text}/g, message);
  answer = answer.replace(/%{date}/g, date);

  if (reply) {
    reply.date = (new Date(reply.date * 1000)).toLocaleString('en-GB', options);
    answer = answer.replace(/%{reply\.username}/g, reply.username);
    answer = answer.replace(/%{reply\.first_name}/g, reply.first_name);
    answer = answer.replace(/%{reply\.last_name}/g, reply.last_name);
    answer = answer.replace(/%{reply\.text}/g, reply.text);
    answer = answer.replace(/%{reply\.date}/g, reply.date);
  }

  command.answer = answer;
  return command;
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
  const { chat, from, date } = message;
  const { reply_to_message, message_id } = message;
  const reply = (reply_to_message) ? reply_to_message.from : undefined;
  if (reply) reply.text = reply_to_message.text;
  if (reply) reply.date = reply_to_message.date;
  let reply_to = (reply_to_message) ? reply_to_message.message_id : message_id;

  if (!text) {
    res.status(200).send('Ok');
    return;
  }

  if (text == '/top'|| text == '/top@jorgesafadobot') {
    await sendMessage(parseInt(chat.id), "Ainda Vou Construir isso :(");
    res.status(200).send('Ok');
    return;
  }

  if (text == '/shipping' || text == '/shipping@jorgesafadobot') {
    await sendMessage(parseInt(chat.id), await shipping.matchShip());
    res.status(200).send('Ok');
    return;
  }


  if (text == '/help'|| text == '/help@jorgesafadobot') {
    await sendMessage(parseInt(chat.id), "Ainda não temos um help feito");
    res.status(200).send('Ok');
    return;
  }

  // ignore
  res.status(200).send('Ok');
  return;
});

module.exports = app;