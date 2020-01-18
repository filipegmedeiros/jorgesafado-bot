
function percent(user) {
    safadeza = Math.floor(Math.random() * Math.floor(101));
    anjo = 100 - safadeza;
    return "Hoje " + user + " está " + anjo + "% anjo mas aquele " + safadeza + "% é vagabundo!"
}


module.exports = {
    percent
}