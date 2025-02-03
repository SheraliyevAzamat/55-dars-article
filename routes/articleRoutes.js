const express = require("express");
const Article = require("../models/Article");
const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateJWT, async (req, res) => {
  const { title, content } = req.body;

  const newArticle = new Article({
    title,
    content,
    author: req.user.id
  });

  try {
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const articles = await Article.find().populate("author", "username");
  res.json(articles);
});

router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id).populate("author", "username");
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json(article);
});

router.put("/:id", authenticateJWT, async (req, res) => {
  const { title, content } = req.body;
  const article = await Article.findById(req.params.id);

  if (article.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  article.title = title;
  article.content = content;
  await article.save();
  res.json(article);
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  


  await article.deleteOne();
  res.status(200).json({ message: "Article deleted" });
});

module.exports = router;
