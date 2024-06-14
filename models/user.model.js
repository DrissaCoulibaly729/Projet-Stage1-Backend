const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "S'il vous plaît, entrez le nom de l'utilisateur"],
    },
    email: {
      type: String,
      required: [
        true,
        "S'il vous plaît, entrez l'adresse e-mail de l'utilisateur",
      ],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "S'il vous plaît, entrez une adresse e-mail valide",
      ],
    },
    password: {
      type: String,
      required: [
        true,
        "S'il vous plaît, entrez le mot de passe de l'utilisateur",
      ],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // permet d'Ajoute les champs createdAt et updatedAt automatiquement
  }
);

const User = mongoose.model('User', UserSchema); 
module.exports = User;

// mongoose.model('User', UserSchema) crée un modèle basé sur ce schéma.
// User est le nom que vous donnez à ce modèle. C'est le nom que vous utiliserez pour interagir avec la collection MongoDB correspondante.
// Le modèle représente la collection MongoDB et fournit une interface pour effectuer des opérations CRUD (Create, Read, Update, Delete) sur les documents de cette collection.