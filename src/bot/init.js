const Telegraf = require('telegraf')
const telegramApiKey = require(process.cwd() + '/src/credentials/telegram.json').apiKey


function init(){
const bot = new Telegraf(telegramApiKey)
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
}


init()


module.exports = init;