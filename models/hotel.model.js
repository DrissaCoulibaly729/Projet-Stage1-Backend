const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "S'il vous plaît, entrez le nom de l'hôtel"],
    },
    // Ajoutez le champ pour stocker l'ID de l'utilisateur qui a ajouté l'hôtel
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Référence vers le modèle d'utilisateur
      required: true
    },
    address: {
      type: String,
      required: [true, "S'il vous plaît, entrez l'adresse de l'hôtel"],
    },
    email: {
      type: String,
      required: [true, "S'il vous plaît, entrez l'adresse e-mail de l'hôtel"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "S'il vous plaît, entrez une adresse e-mail valide",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "S'il vous plaît, entrez le numéro de téléphone de l'hôtel"],
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "S'il vous plaît, entrez un numéro de téléphone valide",
      ],
    },
    pricePerNight: {
      type: Number,
      required: [true, "S'il vous plaît, entrez le prix par nuit de l'hôtel"],
    },
    currency: {
      type: String,
      required: [true, "S'il vous plaît, entrez la devise du prix"],
      enum: ["XOF", "Euro", "Dollar"], // Limite les devises aux options spécifiées
    },
    photo: {
      type: String,
      required: [true, "S'il vous plaît, entrez le nom de la photo de l'hôtel"],
    },
  },
  {
    timestamps: true, // Ajoute les champs createdAt et updatedAt automatiquement
  }
);

const Hotel = mongoose.model('Hotel', HotelSchema);
module.exports = Hotel;
