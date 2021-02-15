

const Cheques = require('../models/Cheques')
const moment = require('moment');

module.exports = {
    async index (req, res){
        try {
            res.json(await Cheques.find());
        } catch (error) {
            console.log(error.message);
            res.status(400).send();
        }
    },
    async show (req, res){
        const {recebimento_data_ini, recebimento_data_fin, vencimento_data_ini, vencimento_data_fin, numero, tipo, compensado} = req.body;

        let where = {}

        if(recebimento_data_ini && recebimento_data_fin){
            where.data_recebimento = {$gte: moment(recebimento_data_ini).startOf('day').toDate(), $lte: moment(recebimento_data_fin).endOf('day').toDate()}
        }
        if(vencimento_data_ini && vencimento_data_fin){
            where.data_vencimento = {$gte: moment(vencimento_data_ini).startOf('day').toDate(), $lte: moment(vencimento_data_fin).endOf('day').toDate()}
        }
        if(numero){
            where.numero = {$regex: numero}
        }
        if(tipo){
            where.tipo = tipo
        }
        if(compensado){
            where.compensado = compensado
        }

        console.log(where)

        try {
            res.json(await Cheques.find(where));
        } catch (error) {
            console.log(error.message);
            res.json();
        }
    },
    async store(req, res){
        const {numero, data_recebimento, data_vencimento, valor, tipo, titular, compensado, contato } = req.body;
        
        await Cheques.create({
            numero,
            data_recebimento: data_recebimento ? moment(data_recebimento) : null,
            data_vencimento: moment(data_vencimento),
            valor,
            tipo,
            titular,
            compensado,
            contato
        }).then(async (retorno)=>{
            console.log(retorno)
            console.log("success")
            res.json(await Cheques.find());
        }).catch((err)=>{
            console.log("err")
            console.log(err)
            res.json({message: "error"});
        });
            
    },
    async destroy(req, res) {
        await Cheques.findById(req.params._id).deleteOne();
        
        res.json({"ok": "Deletado com Sucesso!"});
    },
    async update(req, res) {
        const {_id, numero, data_recebimento, data_vencimento, valor, tipo, titular, compensado, contato } = req.body;

        await Cheques.findOne({ _id: _id }).then((cheque)=>{
            
            cheque.numero = numero;
            cheque.data_recebimento = data_recebimento ? moment(data_recebimento) : null;
            cheque.data_vencimento = moment(data_vencimento);
            cheque.valor = valor;
            cheque.tipo = tipo;
            cheque.titular = titular;
            cheque.compensado = compensado;
            cheque.contato = contato;

            cheque.save().then((response)=>{
                return res.json(response);
            }).catch((err)=>{
                console.log(err)
                res.json({message: "error"});
            });
        });
    }
}
