import { Blog } from "../db/models/blogSchema.js";

export const getBlogs = (req, res) => {
  Blog.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createBlog = (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    newBlog.save();
    res.send("added");
  } catch (err) {
    res.send(err);
  }
};

export const addComment = (req, res) => {
  const id = req.params.id;
  console.log(id);
  console.log(req.body);

  Blog.findOneAndUpdate({ _id: id }, { $push: { comments: req.body } })
    .then(
      console.log(
        `Blog with id : ${id} updated sucessfully with a new comment `
      )
    )
    .catch((err) => res.send("error"));
};

export const getBlog = (req, res) => {
  const id = req.params.id;
  Blog.findOne({ _id: id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateBlog = (req, res) => {
  const id = req.params.id;
  Blog.updateOne({ _id: id }, { $set: req.body })
    .then(res.send(`Blog with id : ${id} updated sucessfully to -> new one `))
    .catch((err) => res.send("error"));
};

export const deleteBlog = (req, res) => {
  const id = req.params.id;

  Blog.deleteOne({ _id: id })
    .then(() => {
      console.log(`disease with id: ${id} is deleted`);
    })
    .catch((err) => {
      console.log(err);
    });
};
