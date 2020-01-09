const howManyLeftToNewShipping = (firstDate) => {
    TodayIs = new Date()

    return firstDate
}


const shipping = (people, lastShippingDate) => {
    
        lastShippingDate = new Date()

        var firstPair = people[Math.floor(Math.random()*people.length)];
        var secondPair = people[Math.floor(Math.random()*people.length)];
        
        while (secondPair == firstPair) { 
            secondPair = people[Math.floor(Math.random()*people.length)];
        }
            
        return "Casal do dia foi escolhido: " + firstPair + " + " + secondPair + 
        "\n" + "Novo casal do dia pode ser escolhido em " 
        + howManyLeftToNewShipping(lastShippingDate).getHours() + " Horas " + 
        + howManyLeftToNewShipping(lastShippingDate).getMinutes() + " Minutos "


}


function ship(){
    console.log(shipping(['@usuario1', '@usuario2', '@usuario3']))
}

module.exports = ship