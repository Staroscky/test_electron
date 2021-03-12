const mongoose = require("mongoose");

const Usuarios = new mongoose.Schema(
    {
        descricao: {
            required: true,
            type: String,
            unique: true
        },
        senha: {
            required: true,
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
module.exports = mongoose.model("Usuarios", Usuarios);
