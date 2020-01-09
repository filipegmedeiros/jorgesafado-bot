const bot = {
    init: require('./bot/init.js'),
  
}

const commands = {
  start:      require('./commands/start.js'),
  help:       require('./commands/help.js'),
  shipping:   require('./commands/shipping.js'),
  questions:  require('./commands/questions.js')
}


  async function start() {
    bot.init()
    commands.shipping()
    //await commands.start()
    //await commands.help()
    //await commands.shipping()
    //await commands.questions()
  }
  
start()