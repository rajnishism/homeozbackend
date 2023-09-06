import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
});

export const Contact = mongoose.model("Contact", contactSchema);
