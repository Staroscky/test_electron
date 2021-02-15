const { Router } = require("express");
const c_views = require('../controllers/c_views')
const api = require('./api')
const routes = Router()


/*********** cheques  ************/
routes.get('/', c_views.index);
routes.get('/cad_cheques', c_views.cadastro);

routes.use('/api', api);

module.exports = routes