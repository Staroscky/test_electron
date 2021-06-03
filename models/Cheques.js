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
            type: mongoose.Schema.Types.ObjectId
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

Cheques.set("toObject", { virtuals: true });
Cheques.set("toJSON", { virtuals: true });

Cheques.virtual("clientes", {
    ref: "Clientes",
    localField: "titular",
    foreignField: "_id"
});

module.exports = mongoose.model("Cheques", Cheques);
