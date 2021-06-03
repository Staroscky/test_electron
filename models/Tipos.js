const mongoose = require("mongoose");

const Cidades = new mongoose.Schema(
    {
        descricao: {
            required: true,
            type: String,
            unique: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
module.exports = mongoose.model("Cidades", Cidades);
