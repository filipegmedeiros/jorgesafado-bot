const state = require('../bot/state.js')

async function matchShip() {

    const shippings = await state.shippingDb();
    const people = await state.peopleDb();

    const lastCouple = await shippings.findOne({ id: 0 });
    const timeToNextShip = new Date((await lastCouple.shippingDate + 86400) * 1000).toLocaleString("pt-BR", { timeZone: "America/Recife" })

    const verifyTime = lastShippingDate => {
        return Math.round(new Date().getTime() / 1000) - lastShippingDate >= 86400;
    }

    const randomPerson = async () => {
        const [msg, err] = await people.aggregate([{ $sample: { size: 1 } }]).toArray();

        if (err || !msg) {
            console.log(err)
        }

        return msg;
    }

    const now = () => { return Math.round(new Date().getTime() / 1000) };

    if (verifyTime(lastCouple.shippingDate)) {

        firstPair = await randomPerson()

        secondPair = await randomPerson()

        while (secondPair._id == firstPair._id) {
            secondPair = await randomPerson()
        }

        await shippings.updateOne({ id: 0 },
            {
                $set: {
                    'shippingCouple': firstPair.username + " + " + secondPair.username,
                    'shippingDate': now()
                }
            });

        await people.updateOne({ _id: firstPair._id },
            {
                $set: { 'score': firstPair.score + 1 }
            });

        await people.updateOne({ _id: secondPair._id },
            {
                $set: { 'score': secondPair.score + 1 }
            });


        return "Casal do dia foi escolhido: " + firstPair.username + " + " + secondPair.username
            + " ❤️ \n" + "Novo casal do dia pode ser escolhido em " + timeToNextShip

    } else {

        return "Ainda não pode ser escolher ainda! o anterior foi " + lastCouple.shippingCouple
            + " ❤️ \n" + "Novo casal do dia pode ser escolhido em " + timeToNextShip

    }
}

async function showTop() {
    const people = await state.peopleDb();

    peopleArr = await people.find().toArray()

    function mySort (arr){
        arr.sort((a, b) => b.score - a.score);
    }

    function top(arr){
        msg = "*Top Lovers* \n"

        for (let i = 0; i < 10; i++) {
            msg += (('*' + (i + 1) + ".* " + (element = arr[i].name) + " — " +
                (element = arr[i].score) + "\n"));
        }
        return msg;
    }

    mySort(await peopleArr);
    msg = top(await peopleArr);

    return msg;

}


module.exports = {
    matchShip,
    showTop
}