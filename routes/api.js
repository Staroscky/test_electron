const { Router } = require("express");
const c_cheques = require('../controllers/c_cheques')
const c_operacoes = require('../controllers/c_operacoes')
const c_usuarios = require('../controllers/c_usuarios')
const c_consultas = require('../controllers/c_consultas')
const c_clientes = require('../controllers/c_clientes')
const api = Router()


/***********  cheques  ************/
api.get('/cheques', c_cheques.index)
api.post('/cheques', c_cheques.store)
api.put('/cheques', c_cheques.update)
api.delete('/cheques/:_id', c_cheques.destroy)
api.post('/busca_cheques', c_cheques.show)

/***********  cheques  ************/
api.get('/operacoes', c_operacoes.index)
api.post('/operacoes', c_operacoes.store)
api.put('/operacoes', c_operacoes.update)
api.delete('/operacoes/:_id', c_operacoes.destroy)

/***********  cheques  ************/
api.get('/clientes', c_clientes.index)
api.post('/clientes', c_clientes.store)
api.put('/clientes', c_clientes.update)
api.delete('/clientes/:_id', c_clientes.destroy)


api.post('/busca_contas', c_consultas.show)
api.get('/dashboard', c_consultas.dashboard)

/***********  usuarios  ************/
api.post('/login', c_usuarios.login)

module.exports = api;