const mongoose = require("mongoose");

const Cheques = new mongoose.Schema(
    {
        numero: {
            required: true,
            type: String,
            unique: true
        },
        data_recebimento: {
            type: Date
        },
        data_vencimento: {
            required: true,
            type: Date
        },
        valor: {
            required: true,
            type: Number,
        },
        tipo: {
            required: true,
            type: Number
        },
        titular:{
            type: String
        },
        compensado: {
            type: Boolean,
            default: false,
        },
        contato:{
            type: String,
        },
        observacao:{
            type: String,
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
module.exports = mongoose.model("Cheques", Cheques);
