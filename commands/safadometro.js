
function percent(user) {
    const safadeza = Math.floor(Math.random() * Math.floor(101));
    const anjo = 100 - safadeza;
    return "Hoje " + user + " está " + anjo + "% anjo mas aquele " + safadeza + "% é vagabundo!";
}


module.exports = {
    percent
}