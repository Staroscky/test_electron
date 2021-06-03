

const Cheques = require('../models/Cheques')
const Operacoes = require('../models/Operacoes')
const asyncForEach = require('async-await-foreach') 
const moment = require('moment');

function sortDate(a,b) {
    let dataA = (a.data ? a.data : a.data_vencimento);
    let dataB = (b.data ? b.data : b.data_vencimento);

    if (dataA > dataB) {
        return 1;
    }
    if (dataA < dataB) {
        return -1;
    }
    return 0;
}

module.exports = {
    async index (req, res){
        try {
            res.json(...await Cheques.find(),...await Operacoes.find());
        } catch (error) {
            console.log(error.message);
            res.status(400).send();
        }
    },
    async show (req, res){
        const {recebimento_data_ini, recebimento_data_fin, vencimento_data_ini, vencimento_data_fin, numero, tipo, tipo_operacao, compensado} = req.body;

        let where_cheque = {}
        let where_operacoes = {}

        if(recebimento_data_ini && recebimento_data_fin){
            where_cheque.data_recebimento = {$gte: moment(recebimento_data_ini).startOf('day').toDate(), $lte: moment(recebimento_data_fin).endOf('day').toDate()}
        }
        if(vencimento_data_ini && vencimento_data_fin){
            where_cheque.data_vencimento = {$gte: moment(vencimento_data_ini).startOf('day').toDate(), $lte: moment(vencimento_data_fin).endOf('day').toDate()}
            where_operacoes.data = {$gte: moment(vencimento_data_ini).startOf('day').toDate(), $lte: moment(vencimento_data_fin).endOf('day').toDate()}
        }
        if(numero){
            where_cheque.numero = {$regex: numero}
            where_operacoes.numero = {$regex: numero}
        }
        if(tipo){
            where_cheque.tipo = tipo
            where_operacoes.tipo = tipo
        }
        if(compensado == true || compensado == false){
            where_cheque.compensado = compensado
            where_operacoes.compensado = compensado
        }
        if(tipo_operacao){
            where_cheque.tipo_operacao = tipo_operacao
            where_operacoes.tipo_operacao = tipo_operacao
        }

        try {
            const cheques = await Cheques.aggregate([
                {
                    $match: where_cheque
                },
                {
                    $lookup:{
                        from: 'clientes',
                        localField: 'titular',
                        foreignField: '_id',
                        as: 'cliente'
                    }
                },
            ]).sort('data_vencimento');
            const operacoes = await Operacoes.aggregate([
                {
                    $match: where_operacoes
                },
                {
                    $lookup:{
                        from: 'clientes',
                        localField: 'id_cliente',
                        foreignField: '_id',
                        as: 'cliente'
                    }
                },
            ]).sort('data');


            let saldoTotal = 0;
            await asyncForEach([...cheques,...operacoes], (item)=>{
                saldoTotal = (item.tipo == 1 ? saldoTotal + item.valor : saldoTotal - item.valor)
            })
            res.json({
                saldoTotal,
                contas: [...cheques,...operacoes].sort(sortDate)
            });
        } catch (error) {
            console.log(error.message);
            res.json();
        }
    },
    async dashboard(req, res){
        const { vencimento_data_ini, vencimento_data_fin } = req.body,
            data_ini = moment().startOf("week"),
            data_fin = moment().endOf("week");
        let cheques_credito     = 0,
            cheques_debito      = 0,
            cheques_total       = 0,
            pagamentos_credito  = 0,
            pagamentos_debito   = 0,
            pagamentos_total    = 0,
            gasolina_credito    = 0,
            gasolina_debito     = 0,
            gasolina_total      = 0,
            manutencao_credito  = 0,
            manutencao_debito   = 0,
            manutencao_total    = 0,
            outros_credito      = 0,
            outros_debito       = 0,
            outros_total        = 0;

        const cheques = await Cheques.find({
            data_vencimento: {$gte: data_ini, $lte: data_fin},
            compensado: false
        }).sort('data_vencimento');

        await asyncForEach(cheques, (item)=>{
            if(item.tipo == 1){
                cheques_credito = cheques_credito + item.valor;
            }else{
                cheques_debito  = cheques_debito + item.valor;
            }

            cheques_total = (item.tipo == 1 ? cheques_total + item.valor : cheques_total - item.valor)
        })


        const pagamentos = await Operacoes.find({
            data: {$gte: data_ini, $lte: data_fin},
            compensado      : false,
            tipo_operacao   : 1
        }).sort('data');

        await asyncForEach(pagamentos, (item)=>{
            if(item.tipo == 1){
                pagamentos_credito = pagamentos_credito + item.valor;
            }else{
                pagamentos_debito  = pagamentos_debito + item.valor;
            }

            pagamentos_total = (item.tipo == 1 ? pagamentos_total + item.valor : pagamentos_total - item.valor)
        })

        const gasolina = await Operacoes.find({
            data: {$gte: data_ini, $lte: data_fin},
            compensado      : false,
            tipo_operacao   : 2
        }).sort('data');

        await asyncForEach(gasolina, (item)=>{
            if(item.tipo == 1){
                gasolina_credito = gasolina_credito + item.valor;
            }else{
                gasolina_debito  = gasolina_debito + item.valor;
            }

            gasolina_total = (item.tipo == 1 ? gasolina_total + item.valor : gasolina_total - item.valor)
        })


        const manutencao = await Operacoes.find({
            data: {$gte: data_ini, $lte: data_fin},
            compensado      : false,
            tipo_operacao   : 3
        }).sort('data');

        await asyncForEach(manutencao, (item)=>{
            if(item.tipo == 1){
                manutencao_credito = manutencao_credito + item.valor;
            }else{
                manutencao_debito  = manutencao_debito + item.valor;
            }

            manutencao_total = (item.tipo == 1 ? manutencao_total + item.valor : manutencao_total - item.valor)
        })


        const outros = await Operacoes.find({
            data: {$gte: data_ini, $lte: data_fin},
            compensado      : false,
            tipo_operacao   : 4
        }).sort('data');

        await asyncForEach(outros, (item)=>{
            if(item.tipo == 1){
                outros_credito = outros_credito + item.valor;
            }else{
                outros_debito  = outros_debito + item.valor;
            }

            outros_total = (item.tipo == 1 ? outros_total + item.valor : outros_total - item.valor)
        })

        res.json({
            cheques_credito,
            cheques_debito,
            cheques_total,
            pagamentos_credito,
            pagamentos_debito,
            pagamentos_total,
            gasolina_credito,
            gasolina_debito,
            gasolina_total,
            manutencao_credito,
            manutencao_debito,
            manutencao_total,
            outros_credito,
            outros_debito,
            outros_total
        })

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
