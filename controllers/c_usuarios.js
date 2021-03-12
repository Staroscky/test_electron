

const {Usuarios} = require('../models')
const moment = require('moment');
const jwt = require('jsonwebtoken') 
const authConfig = require('../config/auth.json')
const EXPIRA_EM_SEGUNDOS = 24 * 60 * 60; // 24 horas * 60 min * 60 seg
function generateToken(params = {}){ //no parms vai ter o id do user para gerar o token pra ele
    return jwt.sign(params, authConfig.secret, {
        //expiresIn: EXPIRA_EM_SEGUNDOS
    })
}

module.exports = {
    async login (req, res){
        const {descricao, senha} = req.body;
    
        const user = await Usuarios.findOne({"descricao": descricao, "senha": senha}).catch((err)=>{
            console.log(err)
        })

        if(user){
            res.send({
                message: "success",
                user,
                token: generateToken({id_usuarios: user.id}) //Gera um novo token para o usuario
            })
        }else{
            res.send({
                message: "error",
                messageError: "usuario nao encontrado"
            })
        }
    }
}
