// // server/server.js
// const express = require('express');
// const path = require('path');
// const helmet = require('helmet');
// const upload = require('./upload'); // Importer le middleware de téléchargement

// const app = express();

// // Utiliser Helmet pour configurer les en-têtes de sécurité, y compris la CSP
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       fontSrc: ["'self'", "http://localhost:5000"],
//       imgSrc: ["'self'", "http://localhost:5000"],
//       // Ajoutez d'autres directives selon vos besoins
//     }
//   }
// }));

// // Servir les fichiers statiques du répertoire 'uploads'
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // Exemple de route pour télécharger un fichier
// app.post('/upload', upload.single('photo'), (req, res) => {
//   try {
//     res.status(200).json({
//       message: 'File uploaded successfully',
//       file: req.file
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // // Démarrer le serveur
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });
