const mongoose = require("mongoose");

const Clientes = new mongoose.Schema(
    {
        nome: {
            required: true,
            type: String
        },
        cnpj: {
            type: String
        },
        id_cidades: {
            type: mongoose.Schema.Types.ObjectId
        },
        contato:{
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

module.exports = mongoose.model("Clientes", Clientes);
