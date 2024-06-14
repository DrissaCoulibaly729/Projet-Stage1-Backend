const { Console } = require("console");
const Hotel = require("../models/hotel.model");
const path = require('path');
const upload = require("../server/upload");
const fs = require('fs');

const getHotels = async (req, res) => {
  try {
    const hotel = await Hotel.find({});
    console.log(hotel);
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getHotelsByIdUser = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
    const addedBy = req.params.addedBy;

    // Rechercher les hôtels appartenant à cet utilisateur spécifique
    const hotels = await Hotel.find({ addedBy: addedBy });

    // Envoyer les hôtels trouvés en réponse
    res.status(200).json(hotels);
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ message: error.message });
  }
};

const countHotelsByIdUser = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
    const addedBy = req.params.addedBy;

    // Compter les hôtels appartenant à cet utilisateur spécifique
    const hotelCount = await Hotel.countDocuments({ addedBy: addedBy });

    // Envoyer le nombre d'hôtels trouvés en réponse
    res.status(200).json({ count: hotelCount });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ message: error.message });
  }
};



const getHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createHotel = async (req, res) => {
  console.log('Entrée dans createHotel');
  try {
    const { hotelName, userId, address, email, phoneNumber, pricePerNight, currency } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucune photo téléchargée' });
    }

    const photo = req.file.filename;
    console.log('Nom de l\'hôtel:', hotelName);
    console.log('Nom du fichier photo:', photo);

    const newHotel = new Hotel({
      name: hotelName,
      addedBy: userId,
      address,
      email,
      phoneNumber,
      pricePerNight,
      currency,
      photo: `${req.protocol}://${req.get('host')}/uploads/${photo}`
    });

    console.log('Détails du nouvel hôtel:', newHotel);

    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    console.error('Erreur lors de l\'insertion de l\'hôtel:', error);
    res.status(500).json({ message: error.message });
  }
};





// const createHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.create(req.body);
//     res.status(200).json(hotel);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateHotel = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const hotel = await Hotel.findByIdAndUpdate(id, req.body);
//     if (!hotel) {
//       return res.status(404).json({ message: "Hotel non trouver" });
//     }
//     const updateHotel = await Hotel.findById(id);
//     res.status(200).json(updateHotel);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updateHotel = async (req, res) => {


    try {
      const { id } = req.params;
      console.log('ID:', id);
      console.log('Body:', req.body);

      // Initialiser les données de mise à jour
      const { hotelName, userId, address, email, phoneNumber, pricePerNight, currency } = req.body;
      const updateData = { name: hotelName, userId, address, email, phoneNumber, pricePerNight, currency };
      console.log('nouveau nom de l hotel :', updateData.name);

      // Vérifiez que les champs ne sont pas undefined ou null
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      console.log('Update Data:', updateData);
      console.log('file :', req.file);

      // Si une nouvelle photo est téléchargée
      if (req.file) {
        console.log('file :', req.file);

        // Récupérer l'hôtel avant d'utiliser `hotel`
        const hotel = await Hotel.findById(id);

        if (hotel && hotel.photo) {
          const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(hotel.photo));
          try {
            fs.unlinkSync(oldImagePath);
            console.log('Ancienne image supprimée:', oldImagePath);
          } catch (unlinkErr) {
            console.error('Erreur lors de la suppression de l\'ancienne image:', unlinkErr);
          }
        }

        // Mettre à jour le chemin de la nouvelle image
        updateData.photo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log('New photo path:', updateData.photo);
      }

      const updatedHotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedHotel) {
        return res.status(404).json({ message: "Hotel non trouvé" });
      }

      console.log('Hotel updated:', updatedHotel);
      res.status(200).json(updatedHotel);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'hôtel:', error);
      res.status(500).json({ message: error.message });
    }
};


const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel non trouvé" });
    }

    // Supprimer la photo de l'hôtel du répertoire d'uploads
    const imagePath = hotel.photo; // Suppose que le chemin de l'image est stocké dans hotel.photo
    if (imagePath) {
      // Si le chemin de l'image existe
      const fs = require("fs");
      const path = require("path");

      // Construire le chemin complet de l'image sur le serveur
      const imageFullPath = path.join(__dirname, "../uploads", imagePath);

      // Vérifier si le fichier existe avant de le supprimer
      if (fs.existsSync(imageFullPath)) {
        fs.unlinkSync(imageFullPath); // Supprimer le fichier
      }
    }

    res.status(200).json({ message: "Hotel supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsByIdUser,
  countHotelsByIdUser
};



// const Hotel = require("../models/hotel.model");
// const upload = require("../upload");

// const getHotels = async (req, res) => {
//   try {
//     const hotels = await Hotel.find({});
//     console.log(hotels);
//     res.status(200).json(hotels);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// const getHotel = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const hotel = await Hotel.findById(id);
//     res.status(200).json(hotel);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const createHotel = async (req, res) => {
//   try {
//     const { hotelName, userId, address, email, phoneNumber, pricePerNight, currency } = req.body;
//     const photo = req.file ? req.file.filename : null;

//     const newHotel = new Hotel({
//       name: hotelName,
//       addedBy: userId,
//       address,
//       email,
//       phoneNumber,
//       pricePerNight,
//       currency,
//       photo
//     });

//     await newHotel.save();
//     res.status(200).json(newHotel);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateHotel = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const hotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true });
//     if (!hotel) {
//       return res.status(404).json({ message: "Hotel non trouvé" });
//     }
//     res.status(200).json(hotel);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteHotel = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const hotel = await Hotel.findByIdAndDelete(id);
//     if (!hotel) {
//       return res.status(404).json({ message: "Hotel non trouvé" });
//     }
//     res.status(200).json({ message: "Hotel supprimé avec succès" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getHotels,
//   getHotel,
//   createHotel,
//   updateHotel,
//   deleteHotel,
// };
