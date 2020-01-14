const moment = require('moment');
moment.locale('pt')

const state = require('../bot/state.js')


function command() {
    
    const content = state.load();
    verifyHourOfShipping(content.lastShippingDate);
    chooseCouple(content);
    state.save(content);


    function verifyHourOfShipping (lastShippingDate ){
        return Math.round(new Date().getTime()/1000) - lastShippingDate >= 86400;
    }

    function chooseCouple(content){
        if (verifyHourOfShipping(content.lastShippingDate)){
            firstPair = content.people[Math.floor(Math.random()*content.people.length)];
            secondPair = content.people[Math.floor(Math.random()*content.people.length)];
            
            while (secondPair == firstPair) { 
                secondPair = content.people[Math.floor(Math.random()*content.people.length)];
            }

            content.lastShippingCouple = firstPair + " + " + secondPair;
            content.nextTimeToChoose = moment().add(1, 'days').calendar();
            content.lastShippingDate = Math.round(new Date().getTime()/1000);
            
            return "Casal do dia foi escolhido: " + content.lastShippingCouple + 
            "\n" + "Novo casal do dia pode ser escolhido " + content.nextTimeToChoose;
        }

        else{
            return "Ainda não pode ser escolher ainda! o anterior foi " + content.lastShippingCouple + 
            "\n" + "Próximo casal pode ser escolhido " + content.nextTimeToChoose;
        }
    }
}


command()
module.exports = command