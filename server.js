const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser"); // Correction de la casse
// Initialiser l'application Express
const app = express();

// Middleware de session pour Express
app.use(bodyParser.json());

const allowedOrigins = [
  'https://projet-stage1-frontend.vercel.app',
  'http://localhost:3000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Si vous utilisez des cookies ou des sessions
  }

  // Gestion des requêtes préliminaires
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploadsUser", express.static(path.join(__dirname, "uploadsUser")));

// Middleware pour le traitement des requêtes JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de données MongoDB
mongoose.connect("mongodb+srv://NymosdtCoder:Dri%24%24%40Coulib%40ly%23DevTonton%7C%7CDevNymosdt@backenddb.zav2t2n.mongodb.net/RED-Product?retryWrites=true&w=majority&appName=BackendDB")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

// Gérer les routes API avec Express
const userRoutes = require("./routes/user.route.js");
const hotelRoutes = require("./routes/hotel.route.js");
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);

// Démarrer le serveur Express
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

/********************  CREUD  ******************/

// //Afficher 1 seul utilisateur
// app.get("/api/user/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//   // console.log(req.body);
//   // res.send(req.body);
// });

// //Afficher tous les utilisateur
// app.get("/api/users", async (req, res) => {
//   try {
//     const user = await User.find({});
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//   // console.log(req.body);
//   // res.send(req.body);
// });

// // creer utilisateur
// app.post("/api/users", async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//   // console.log(req.body);
//   // res.send(req.body);
// });

// // modifier utilisateur
// app.put("/api/user/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByIdAndUpdate(id, req.body);
//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouver" });
//     }
//     const updateUser = await User.findById(id);
//     res.status(200).json(updateUser);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//   // console.log(req.body);
//   // res.send(req.body);
// });

// // Delete utilisateur
// app.delete("/api/user/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouver" });
//     }

//     res.status(200).json({ message: "User supprimer avec success" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//   // console.log(req.body);
//   // res.send(req.body);
// });
