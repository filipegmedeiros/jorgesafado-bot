const state = require('../bot/state.js')

async function reload() {
    const questions = await state.questionDb();
    const result = await questions.updateMany(
        { used: { $eq: true } },
        {
            $set: { "used": false },
        });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function randomQuestion() {

    const questions = await state.questionDb();
    const [msg, err] = await questions.aggregate([
        { $match: { used: false } },
        { $sample: { size: 1 } }]).toArray();

    if (err || !msg) {
        await reload();
        randomQuestion()
    }

        await questions.updateOne({ '_id': msg._id },
            {
                $set: { 'used': true }
            });
        return msg.question;

}

async function addQuestion(text, username) {
    const questions = await state.questionDb();
    await questions.insertOne(
        {
            'question': "Question: " + text,
            'created By': username,
            'date': new Date().toLocaleString("pt-BR", { timeZone: "America/Recife" }),
            'used': false,
            'lastAnswer': ''

        });

    msg = 'Adicionado a pergunta: \n```' + text + '\n``` Com Sucesso!';

    return msg;
}


async function responseQuestion(text,reply_text, username){
    const questions = await state.questionDb();

    await questions.updateOne({ question: text },
    {
        $set: { 'lastAnswer': '*' + username + '*' + ' respondeu: ```' + reply_text + '```' }
    });
}


async function whatIsTheAnswer(text){
    const questions = await state.questionDb();

    const resp = await questions.findOne({ question: text });

    return resp.lastAnswer;

}

module.exports = {
    randomQuestion,
    addQuestion,
    responseQuestion,
    whatIsTheAnswer
}
