const mongoose = require("mongoose");

const Clientes = new mongoose.Schema(
    {
        nome: {
            required: true,
            type: String
        },
        cnpj: {
            type: String,
            unique: true
        },
        id_cidades: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
module.exports = mongoose.model("Clientes", Clientes);
