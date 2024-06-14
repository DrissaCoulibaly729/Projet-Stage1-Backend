const express = require("express");
const Hotel = require("../models/hotel.model.js");
const router = express.Router();
const upload = require("../server/upload");

const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,  
  deleteHotel,
  getHotelsByIdUser,
  countHotelsByIdUser
} = require("../controllers/hotel.controller.js");

router.get("/", getHotels);
router.get("/:id", getHotel);

router.get("/addedBy/:addedBy", getHotelsByIdUser);

router.get('/count/:addedBy', countHotelsByIdUser);

//router.post('/', upload.single('photo'), createHotel);
router.post('/', upload.single('photo'), createHotel);

router.put('/:id', upload.single('photo'), updateHotel);

router.delete("/:id", deleteHotel);

module.exports = router;
