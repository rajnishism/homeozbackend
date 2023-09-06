import { v4 as uuidv4 } from "uuid";
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
import express from "express";
const router = express.Router();
import {
  getDiseases,
  getFaqs,
  getTestinomials,
  getContactDetails,
  getSocialmedia,
  createDisease,
  deleteDisease,
  updateDisease,
  createFaq,
  createTestinomial,
  updateFaq,
  updateTestinomial,
  deleteFaq,
  deleteTestinomial,
  createContacts,
  updateContact,
} from "../controllers/content.js";

router.get("/diseases", getDiseases);
router.get("/faq", getFaqs);
router.get("/testinomials", getTestinomials);
router.get("/contacts", getContactDetails);

router.post("/diseases", createDisease);
router.post("/faq", createFaq);
router.post("/testinomials", createTestinomial);
router.post("/contacts", createContacts);

router.patch("/disease/:id", updateDisease);
router.patch("/faq/:id", updateFaq);
router.patch("/testinomials/:id", updateTestinomial);
router.patch("/contacts/:id", updateContact);

router.delete("/diseases/:id", deleteDisease);
router.delete("/faq/:id", deleteFaq);
router.delete("/testinomials/:id", deleteTestinomial);

export default router;
