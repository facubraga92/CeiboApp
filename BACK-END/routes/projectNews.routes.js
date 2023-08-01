const express = require("express");
const {
  createNews,
  getAllNews,
  getNewsProyect,
  getNewsById,
  updateNews,
  deleteNews,
  approveNews,
  addCommentToNews,
  updateNewsManager,
} = require("../controllers/projectNews.controllers");
const isLogged = require("../middlewares/isLogged");
const validateUser = require("../middlewares/validateUser");

const router = express.Router();

router.post("/", isLogged, validateUser, createNews);

router.get("/", isLogged, validateUser, getAllNews);

router.get("/newsProject/:id", isLogged, getNewsProyect);

router.get("/:id", isLogged, getNewsById);

router.put("/:id", isLogged, validateUser, addCommentToNews);

router.delete("/:id", isLogged, validateUser, deleteNews);

router.put("/:id/approve", isLogged, validateUser, approveNews);

router.put("/:id/modify", isLogged, validateUser, updateNews);

module.exports = router;
