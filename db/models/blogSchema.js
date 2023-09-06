import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imgLink: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  date: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  comments: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

export const Blog = mongoose.model("blog", blogSchema);
