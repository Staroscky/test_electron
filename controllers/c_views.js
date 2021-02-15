

const Cheques = require('../models/Cheques')

module.exports = {
    async index(req, res){
        res.render('index')
    },
    async cadastro(req, res){
        res.render('cadastro')
    },
}
