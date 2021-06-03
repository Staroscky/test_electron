

const Operacoes = require('../models/Operacoes')
const asyncForEach = require('async-await-foreach') 
const moment = require('moment');
moment.locale('pt-br'); 

module.exports = {
    async index (req, res){
        try {
            res.json(await Operacoes.find());
        } catch (error) {
            console.log(error.message);
            res.status(400).send();
        }
    },
    async store(req, res){
        const {data, valor, tipo, tipo_operacao, compensado, id_cliente } = req.body;
        console.log(req.body)
        await Operacoes.create({
            data: data ? moment(data) : null,
            valor,
            tipo,
            tipo_operacao,
            compensado,
            id_cliente
        }).then(async (retorno)=>{
            console.log(retorno)
            console.log("success")
            res.json(await Operacoes.find());
        }).catch((err)=>{
            console.log("err")
            console.log(err)
            res.json({message: "error"});
        });
            
    },
    async destroy(req, res) {
        await Operacoes.findById(req.params._id).deleteOne();
        
        res.json({"ok": "Deletado com Sucesso!"});
    },
    async update(req, res) {
        const {_id,data, valor, tipo, tipo_operacao, compensado, id_cliente } = req.body;

        await Operacoes.findOne({ _id: _id }).then((operacao)=>{
            
            operacao.data = data ? moment(data) : null;
            operacao.valor = valor;
            operacao.tipo = tipo;
            operacao.tipo_operacao = tipo_operacao;
            operacao.id_cliente = id_cliente;
            operacao.compensado = compensado;

            operacao.save().then((response)=>{
                return res.json(response);
            }).catch((err)=>{
                console.log(err)
                res.json({message: "error"});
            });
        });
    }
}
