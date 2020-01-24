const state = require('../bot/state.js')

const intervalToLevels = (interval) => {
    const levels = {
        scale: [24, 60, 60, 1],
        units: [' dia ', ' horas ', ' minutos ', ' segundos ']
    };

    const cbFun = (d, c) => {
        let bb = d[1] % c[0],
            aa = (d[1] - bb) / c[0];
        aa = aa > 0 ? aa + c[1] : '';

        return [d[0] + aa, bb];
    };

    let rslt = levels.scale.map((d, i, a) => a.slice(i).reduce((d, c) => d * c))
        .map((d, i) => ([d, levels.units[i]]))
        .reduce(cbFun, ['', interval]);
    return rslt[0];
};

async function matchShip() {

    const shippings = await state.shippingDb();
    const people = await state.peopleDb();

    const lastCouple = await shippings.findOne({ id: 0 });
    const shippingDate = await lastCouple.shippingDate;
    const timeToNextShip = new Date(shippingDate + 86400)
    const fullDateToNextShip = new Date((shippingDate + 86400) * 1000).toLocaleString("pt-BR", { timeZone: "America/Recife" })

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

        const [response, bool] = ["Casal do dia:\n" + firstPair.username + " + " + secondPair.username
            + " ❤️ \n" + "\nNovo casal do dia pode ser escolhido em " 
            + intervalToLevels(timeToNextShip - now()) + ' (*' + fullDateToNextShip + ')*', true]
        return [response, bool];

    } else {

        const [response, bool] = ["Ainda não pode ser escolher ainda! o anterior foi " + lastCouple.shippingCouple
            + " ❤️ \n" + "\nNovo casal do dia pode ser escolhido em " 
            + intervalToLevels(timeToNextShip - now()) + ' (*' + fullDateToNextShip + ')*', false] 
        return [response, bool];

    }
}

async function showTop() {
    const people = await state.peopleDb();

    peopleArr = await people.find().toArray()

    function mySort(arr) {
        arr.sort((a, b) => b.score - a.score);
    }

    function top(arr) {
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