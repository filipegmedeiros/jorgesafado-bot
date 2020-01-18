const state = require('../bot/state.js')

async function matchShip() {



    const shippings = await state.shippingDb();
    const people = await state.peopleDb();

    lastCouple = await shippings.findOne({ id: 0 });

    lastShippingDate = await lastCouple.lastShippingDate;

        lastShippingDate = 0;
    if (lastShippingDate === 0) {
        timeToNextShip = new Date((now() + 86400) * 1000).toLocaleString("pt-BR", {timeZone: "America/Recife"})
    } else {
        timeToNextShip = new Date((lastShippingDate + 86400) * 1000).toLocaleString("pt-BR", {timeZone: "America/Brasilia"})
    };

    function now() { return Math.round(new Date().getTime() / 1000) };


    function random(size) {
        return Math.floor(Math.random() * size);
    };




    function verifyHourOfShipping(lastShippingDate) {
        return Math.round(new Date().getTime() / 1000) - lastShippingDate >= 86400;
    }

    if (verifyHourOfShipping(lastShippingDate)) {
        size = await people.countDocuments();

        firstPair = await people.findOne({ id: random(size) });
        secondPair = await people.findOne({ id: random(size) });

        while (secondPair.id == firstPair.id) {
            secondPair = await people.findOne({ id: random(size) });
        }

        await shippings.updateOne({ 'id': 0 },
            {
                $set: {
                    'lastShippingCouple': firstPair.username + " + " + secondPair.username,
                    'lastShippingDate': now()
                }
            });

        await people.updateOne({ 'id': firstPair.id },
            {
                $set: { 'score': firstPair.score + 1 }
            });

        await people.updateOne({ 'id': secondPair.id },
            {
                $set: { 'score': secondPair.score + 1 }
            });

        return "Casal do dia foi escolhido: " + firstPair.username + " + " + secondPair.username
            + "\n" + "Novo casal do dia pode ser escolhido Amanhã às"
            + timeToNextShip.getHours() + ":" + timeToNextShip.getMinutes();
    }

    else {
        return "Ainda não pode ser escolher ainda! o anterior foi " + lastCouple.lastShippingCouple
            + "\n" + "Novo casal do dia pode ser escolhido Amanhã às "
            + timeToNextShip.getHours() + ":" + timeToNextShip.getMinutes();
    }

}

module.exports = {
    matchShip
}