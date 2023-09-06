import mongoose from "mongoose";

const testinomialSchema = new mongoose.Schema({
  testinomial: {
    type: String,
    required: true,
  },
  person: {
    type: String,
    required: true,
  },
});

export const Testinomial = mongoose.model("Testinomial", testinomialSchema);
