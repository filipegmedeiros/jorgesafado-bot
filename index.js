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

const sendMessage = async (id, data) => {
  const body = {
    chat_id: id,
    text: data,
    parse_mode: 'Markdown'
  }
  await axios.post(api_url + '/sendMessage', body)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const sendReplyMessage = async (id, data, reply_to) => {
  const body = {
    chat_id: id,
    text: data,
    reply_to_message_id: reply_to,
    parse_mode: 'Markdown'
  }

  await axios.post(api_url + '/sendMessage', body)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const sendMessageAndPine = async (id, data) => {
  const body = {
    chat_id: id,
    text: data,
    parse_mode: 'Markdown'
  }
  const result = await axios.post(api_url + '/sendMessage', body);

  await pineMessage(id, result.data.result.message_id)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const pineMessage = async (id, msg_id) => {
  const body = {
    chat_id: id,
    message_id: msg_id
  }
  await axios.post(api_url + '/pinChatMessage', body)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
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

  let { text } = message;
  const { chat, from, message_id } = message;
  const { reply_to_message } = message;





  if (!text) {
    res.status(200).send('Ok');
    return;
  }

  if (reply_to_message && reply_to_message.from.username == 'jorgesafadobot' &&
    reply_to_message.text.startsWith('Question') && !text.startsWith('reveal')) {

    await question.responseQuestion(reply_to_message.text, text, from.username);
    res.status(200).send('Ok');
    return;
  }

  if (reply_to_message && reply_to_message.from.username == 'jorgesafadobot' &&
    reply_to_message.text.startsWith('Question') && text.startsWith('reveal')) {

    await sendMessage(parseInt(chat.id), await question.whatIsTheAnswer(reply_to_message.text));
    res.status(200).send('Ok');
    return;
  }


  if (text.match('^\/[a-z]')) {
    const command = text.match(/(\/\w+)(@\w+)?/)[1].substring(1);
    switch (command) {
      case 'lol': await sendMessage(parseInt(chat.id), everyone.lol()); break;
      case 'safadometro': await sendReplyMessage(parseInt(chat.id), safadometro.percent(from.first_name), parseInt(message_id)); break;
      case 'help': await sendMessage(parseInt(chat.id), "Ainda não temos um help feito"); break;
      case 'howilove': await sendReplyMessage(parseInt(chat.id), love.theTruth(from.username), parseInt(message_id)); break;
      case 'top': await sendMessage(parseInt(chat.id), await shipping.showTop()); break;
      case 'question': {
        await sendReplyMessage(parseInt(chat.id), await question.randomQuestion(), parseInt(message_id));
        break;
      }
      case 'shipping': {
        if (chat.type == 'supergroup') {
          //
          response = await shipping.matchShip();
          if (response[1] == true) {
            await sendMessageAndPine(parseInt(chat.id), response[0]);
          } else {
            await sendMessage(parseInt(chat.id), response[0]);
          }

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
        if (text.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{1,}[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ, ]*[?!]{1,}$/)) {
          await sendReplyMessage(parseInt(chat.id), await question.addQuestion(text, from.username), parseInt(message_id));
        } else {
          await sendReplyMessage(parseInt(chat.id), "Vá cagar outro banco safado!", parseInt(message_id));
        }
        break;
      }
      case 'debug': {
        if (from.username === 'usuariolinux' || from.username === '@usuariolinux')
          await sendReplyMessage(parseInt(chat.id), JSON.parse(JSON.stringify(message)), parseInt(message_id));
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