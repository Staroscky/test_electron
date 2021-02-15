const { Router } = require("express");
const c_cheques = require('../controllers/c_cheques')
const api = Router()


/***********  cheques  ************/
api.get('/cheques', c_cheques.index)
api.post('/cheques', c_cheques.store)
api.put('/cheques', c_cheques.update)
api.delete('/cheques/:_id', c_cheques.destroy)

api.post('/busca_cheques', c_cheques.show)


module.exports = api;