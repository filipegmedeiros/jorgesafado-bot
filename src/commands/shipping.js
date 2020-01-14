const moment = require('moment');
moment.locale('pt')
const state = require('../bot/state.js')

function shipping() {

    const content = state.load();
    verifyHourOfShipping(content.lastShippingDate);
    chooseCouple(content);
    state.save(content);


    function verifyHourOfShipping(lastShippingDate) {
        return Math.round(new Date().getTime() / 1000) - lastShippingDate >= 86400;
    }

    function chooseCouple(content) {
        if (verifyHourOfShipping(content.lastShippingDate)) {
            firstPair = content.people[Math.floor(Math.random() * content.people.length)];
            secondPair = content.people[Math.floor(Math.random() * content.people.length)];

            while (secondPair == firstPair) {
                secondPair = content.people[Math.floor(Math.random() * content.people.length)];

            }

            content.lastShippingCouple = firstPair.username + " + " + secondPair.username;
            firstPair.score++
            secondPair.score++
            content.nextTimeToChoose = moment().add(1, 'days').calendar();
            content.lastShippingDate = Math.round(new Date().getTime() / 1000);



            return "Casal do dia foi escolhido: " + content.lastShippingCouple +
                "\n" + "Novo casal do dia pode ser escolhido " + content.nextTimeToChoose;
        }

        else {
            return "Ainda não pode ser escolher ainda! o anterior foi " + content.lastShippingCouple +
                "\n" + "Próximo casal pode ser escolhido " + content.nextTimeToChoose;
        }

    }


}

function ranking() {

    const content = state.load();
    sort(content.people);
    top(content)
    state.save(content);

    function sort(people) {
        people.sort((a, b) => b.score - a.score);
    }
}

function top(content){
    content.rank = "Top Lovers \n"

        for (let index = 0; index < content.people.length; index++) {
            content.rank += ((index+1 + ". " + (element = content.people[index].username) + " — " + 
            (element = content.people[index].score) + "\n"));
        }
    }

    ranking()
    shipping()

    module.exports = {
        shipping,
        ranking
    }