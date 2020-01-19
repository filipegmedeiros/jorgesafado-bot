const express = require('express');
const api_url = 'https://api.telegram.org/bot' + process.env.BOT_TOKEN;

const axios = require('axios');

const app = express();
app.use(express.json());

const shipping = require("./commands/shipping.js");
const safadometro = require("./commands/safadometro.js");
const everyone = require("./commands/everyone.js");
const question = require("./commands/questions.js");
const love = require("./commands/love.js");

const sendMessage = async (id, data, parse) => {
  const body = {
    chat_id: id,
    text: data,
    parse_mode: (parse) ? 'Markdown' : ''
  }
  await axios.post(api_url + '/sendMessage', body)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const sendMessageAndPine = async (id, data, parse) => {
  const body = {
    chat_id: id,
    text: data,
    parse_mode: (parse) ? 'Markdown' : ''
  }
  const result = await axios.post(api_url + '/sendMessage', body);

  await pineMessage(id, result.data.result.message_id);
};

const pineMessage = async (id, msg_id) => {
  const body = {
    chat_id: id,
    message_id: msg_id
  }
  await axios.post(api_url + '/pinChatMessage', body);
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

  if (text.startsWith('/')) {
    const command = text.match(/(\/\w+)(@\w+)?/)[1].substring(1);

    switch (command) {


      case 'lol': await sendMessage(parseInt(chat.id), everyone.lol()); break;
      case 'safadometro': await sendMessage(parseInt(chat.id), safadometro.percent(from.first_name)); break;
      case 'help': await sendMessage(parseInt(chat.id), "Ainda não temos um help feito"); break;
      case 'howilove': await sendMessage(parseInt(chat.id), love.theTruth(from.username)); break;
      case 'question': await sendMessage(parseInt(chat.id), await question.randomQuestion()); break;
      case 'shipping': {
        if (chat.type == 'supergroup') {
          await sendMessageAndPine(parseInt(chat.id), await shipping.matchShip());
          break;
        } else {
          await sendMessage(parseInt(chat.id), "Apenas Ships nos grupos, amigo!");
          break;
        }
      }
      case 'everyone': {
        if (chat.type == 'supergroup') {
          await sendMessageAndPine(parseInt(chat.id), everyone.all());
          break;
        } else {
          await sendMessage(parseInt(chat.id), "Você não está sozinho, o bot está com você!");
          break;
        }
      }
      case 'add': {
        text = text.replace(/\/\w+(@\w+)?(\s+)?/, '');
        await sendMessage(parseInt(chat.id), question.addQuestion(text));
        break;
      }
      default: {
        res.status(200).send('Ok');
        return;
      }
    }
    res.status(200).send('Ok');
    return;
  }
  // ignore
  res.status(200).send('Ok');
  return;
});


module.exports = app;