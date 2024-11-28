const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({

    title: { type: String, required: true },
    categorie: { type: String, required: true },
    imageUrl: { type: String },
    organization: { type: String },
    coaching: { type: String },
    expiration: { type: String},
    variante: { type: String },
});

module.exports = mongoose.model("Exercise", exerciseSchema);