const state = require('../bot/state.js')

async function addQuestion(text) {
    const questions = await state.AskDb();

    const i = parseInt(await questions.countDocuments()) + 1;

    await questions.insertOne(
        {
            'id': i,
            'question': text
        });
    msg = 'Adicionado a pergunta: ' + text + ' Com Sucesso!';

    return await msg;
}

async function randomQuestion() {
    const questions = await state.AskDb();
    size = await questions.countDocuments();


    function random(size) {
        return Math.floor(Math.random() * size);
    };
    msg = await questions.findOne({ 'id': random(size) });

    return msg.question;
}

module.exports = {
    randomQuestion,
    addQuestion
}
