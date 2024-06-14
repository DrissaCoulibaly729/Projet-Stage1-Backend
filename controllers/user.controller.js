const User = require("../models/user.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const uploadUser = require("../server/uploadUser");
const path = require("path");
const fs = require("fs");

const generatePassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.params; // Utilisez req.params pour extraire l'email de l'URL
    console.log("Email reçu:", email);

    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ email: email });
    console.log("Utilisateur trouvé:", user);

    if (!user) {
      console.log("Utilisateur non trouvé pour l'email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // Générer un nouveau mot de passe
    const newPassword = generatePassword();
    console.log("Nouveau mot de passe généré:", newPassword);

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    user.password = newPassword; // Vous devrez probablement hacher le mot de passe ici
    await user.save();
    console.log("Mot de passe mis à jour dans la base de données");

    // Configurer le transporteur nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "dc377303@gmail.com",
        pass: "ickc cfpx dcsf gxvs",
      },
    });

    // Configurer l'email
    const mailOptions = {
      from: "dc377303@gmail.com",
      to: user.email,
      subject: "Réinitialisation du mot de passe",
      text: `Votre nouveau mot de passe est : ${newPassword}. Veuillez vous connecter et changer votre mot de passe immédiatement.`,
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);
    console.log("Email envoyé à:", user.email);

    res.status(200).json({ message: "New password sent to your email" });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    console.log('mes donnee : ',req.body);
    const user = await User.create(req.body);
    console.log('user : ',user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouver" });
    }
    const updateUser = await User.findById(id);
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouver" });
    }

    res.status(200).json({ message: " User supprimer avec success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.session.userId = user._id;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSessionUserId = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res
        .status(404)
        .json({ message: "ID de session utilisateur non trouvé" });
    }
    res.status(200).json({ userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;

    // Vérifier si un fichier a été téléchargé
    if (!file) {
      return res.status(400).json({ message: "Aucun fichier sélectionné." });
    }

    // Récupérer l'utilisateur pour obtenir l'image précédente s'il y en a une
    const user = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res
        .status(404)
        .json({ message: `Utilisateur avec l'ID ${userId} non trouvé.` });
    }

    // Supprimer l'image précédente si elle existe
    if (user.photo) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(user.photo)
      );
      try {
        fs.unlinkSync(oldImagePath);
        console.log("Ancienne image supprimée:", oldImagePath);
      } catch (unlinkErr) {
        console.error(
          "Erreur lors de la suppression de l'ancienne image:",
          unlinkErr
        );
      }
    }

    // Mettre à jour le chemin de la nouvelle image
    const newPhotoPath = `${req.protocol}://${req.get("host")}/uploadsUser/${
      file.filename
    }`;
    console.log("Nouveau chemin de la photo:", newPhotoPath);

    // Mettre à jour l'utilisateur avec le nouveau chemin de la photo
    user.photo = newPhotoPath;
    await user.save();

    // Répondre avec les données mises à jour de l'utilisateur
    res
      .status(200)
      .json({ message: "Image utilisateur mise à jour avec succès.", user });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la photo utilisateur:",
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de la mise à jour de la photo utilisateur.",
      });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getSessionUserId,
  resetPassword,
  updateUserImage,
};
