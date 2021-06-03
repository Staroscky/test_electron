

const Clientes = require('../models/Clientes')
const asyncForEach = require('async-await-foreach') 
const moment = require('moment');
moment.locale('pt-br'); 

module.exports = {
    async index (req, res){
        try {
            res.json(await Clientes.find().sort("nome"));
        } catch (error) {
            console.log(error.message);
            res.status(400).send();
        }
    },
    async store(req, res){
        const {nome, cnpj, contato } = req.body;
        
        await Clientes.create({
            nome, 
            cnpj,
            contato
        }).then(async (retorno)=>{
            console.log(retorno)
            console.log("success")
            res.json(await Clientes.find().sort("nome"));
        }).catch((err)=>{
            console.log("err")
            console.log(err)
            res.json({message: "error"});
        });
            
    },
    async destroy(req, res) {
        await Clientes.findById(req.params._id).deleteOne();
        
        res.json({"ok": "Deletado com Sucesso!"});
    },
    async update(req, res) {
        const {_id, nome, cnpj, contato} = req.body;

        await Clientes.findOne({ _id: _id }).then(async (cliente)=>{
            
            cliente.nome = nome;
            cliente.cnpj = cnpj;
            cliente.contato = contato;

            cliente.save().then(async (response)=>{
                return res.json(await Clientes.find().sort("nome"));
            }).catch((err)=>{
                console.log(err)
                res.json({message: "error"});
            });
        });
    }
}
