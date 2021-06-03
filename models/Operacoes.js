const mongoose = require("mongoose");

const Operacoes = new mongoose.Schema(
    {
        data: {
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
        tipo_operacao: {
            required: true,
            type: Number
        },
        compensado: {
            type: Boolean,
            default: false,
        },
        id_cliente: {
            type: mongoose.Schema.Types.ObjectId
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

Operacoes.set("toObject", { virtuals: true });
Operacoes.set("toJSON", { virtuals: true });

Operacoes.virtual("clientes", {
    ref: "Clientes",
    localField: "id_cliente",
    foreignField: "_id"
});

module.exports = mongoose.model("Operacoes", Operacoes);
