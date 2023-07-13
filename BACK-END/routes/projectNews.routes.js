const express = require("express");
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  approveNews,
} = require("../controllers/projectNews.controllers");
const isLogged = require("../middlewares/isLogged");
const validateUser = require("../middlewares/validateUser");

const router = express.Router();

router.post("/", isLogged, validateUser, createNews);

router.get("/", isLogged, validateUser, getAllNews);

router.get("/:id", isLogged, validateUser, getNewsById);

router.put("/:id", isLogged, validateUser, updateNews);

router.delete("/:id", isLogged, validateUser, deleteNews);

router.put("/:id/approve", isLogged, validateUser, approveNews);

module.exports = router;
