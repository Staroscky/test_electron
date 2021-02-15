const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const helpers = require('./helpers')
const bodyParser = require('body-parser');
const cors = require("cors");
const routes = require("./routes")
const http = require("http").createServer(app);
require("./database")
//config
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));


// funcoes para auxilo de front end
var hbs = handlebars.create(helpers);

// app.engine para usar o helpers em vez de html, para assim usar dados ali dentro como se fosse php;
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static("./public"));

// Rotas
app.use(routes)


//Porta
const PORT = 3000;
http.listen(PORT);
