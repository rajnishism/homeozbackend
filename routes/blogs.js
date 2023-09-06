import { v4 as uuidv4 } from "uuid";
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
import express from "express";
const router = express.Router();
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  addComment,
} from "../controllers/blogs.js";

router.get("/", getBlogs);
router.get("/:id", getBlog);
router.patch("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.post("/", createBlog);
router.post("/:id/comments", addComment);

export default router;
