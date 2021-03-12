const { Router } = require("express");
const c_cheques = require('../controllers/c_cheques')
const c_usuarios = require('../controllers/c_usuarios')
const api = Router()


/***********  cheques  ************/
api.get('/cheques', c_cheques.index)
api.post('/cheques', c_cheques.store)
api.put('/cheques', c_cheques.update)
api.delete('/cheques/:_id', c_cheques.destroy)
api.post('/busca_cheques', c_cheques.show)

/***********  usuarios  ************/
api.post('/login', c_usuarios.login)

module.exports = api;