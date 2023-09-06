const faq = [
  {
    question: "What are the benefits of homeopathy?",
    answer:
      "Homeopathy is free of steroids. It is infact derived from plants ad hence has no side effects. For this reason, it is best suitedto pregnant and lactating women , young children and even the even the elderly. Homeopathy also cures many autoimmune diseases which have no cure in the mainstream medicine.",
  },
];
import { Contact } from "../db/models/contactSchema.js";
import { Disease } from "../db/models/diseaseSchema.js";
import { Faq } from "../db/models/faqSchema.js";
import { Testinomial } from "../db/models/testinomialSchema.js";

//get routes

export const getDiseases = (req, res) => {
  Disease.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getFaqs = (req, res) => {
  Faq.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

export const getTestinomials = (req, res) => {
  Testinomial.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

export const getContactDetails = (req, res) => {
  Contact.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

export const getSocialmedia = (req, res) => {
  res.send({
    facebook: "afb.fb.com",
    instagram: "afd.insta",
    twitter: "adv.twit",
    linkedIn: "ad.linkedInd",
  });
};
// creat routes
export const createDisease = (req, res) => {
  try {
    const newDisease = new Disease(req.body);
    newDisease.save();
    res.send("added");
  } catch (err) {
    res.send(err);
  }
};

export const createFaq = (req, res) => {
  try {
    const newFaq = new Faq(req.body);
    newFaq.save();
    res.send("added");
  } catch (err) {
    res.send(err);
  }
};

export const createTestinomial = (req, res) => {
  try {
    const newTestinomial = new Testinomial(req.body);
    newTestinomial.save();
    res.send("added");
  } catch (err) {
    res.send(err);
  }
};

export const createContacts = (req, res) => {
  try {
    const newContact = new Contact(req.body);
    newContact.save();
    res.send("added");
  } catch (err) {
    res.send(err);
  }
};

// update routes

export const updateDisease = (req, res) => {
  const { name, image } = req.body;
  const id = req.params.id;
  Disease.updateOne({ _id: id }, { $set: req.body })
    .then(
      console.log(
        `disease  with id : ${id} updated sucessfully to -> ${req.body.name}`
      )
    )
    .catch((err) => res.send("error"));
};

export const updateContact = (req, res) => {
  const id = req.params.id;
  Contact.updateOne({ _id: id }, { $set: req.body })
    .then(
      res.send(
        `Faq  with id : ${id} updated sucessfully to -> ${req.body.question}`
      )
    )
    .catch((err) => res.send("error"));
};

export const updateFaq = (req, res) => {
  const id = req.params.id;
  Faq.updateOne({ _id: id }, { $set: req.body })
    .then(
      res.send(
        `Faq  with id : ${id} updated sucessfully to -> ${req.body.question}`
      )
    )
    .catch((err) => res.send("error"));
};

export const updateTestinomial = (req, res) => {
  const id = req.params.id;
  Testinomial.updateOne({ _id: id }, { $set: req.body })
    .then(
      res.send(
        `Testinomials  with id : ${id} updated sucessfully to -> ${req.body.question}`
      )
    )
    .catch((err) => res.send("error"));
};

//delete routes

export const deleteDisease = (req, res) => {
  const id = req.params.id;

  Disease.deleteOne({ _id: id })
    .then(() => {
      console.log(`disease with id: ${id} is deleted`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteFaq = (req, res) => {
  const id = req.params.id;

  Faq.deleteOne({ _id: id })
    .then(() => {
      res.send(`disease with id: ${id} is deleted`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteTestinomial = (req, res) => {
  const id = req.params.id;

  Testinomial.deleteOne({ _id: id })
    .then(() => {
      res.send(`Testinomial with id: ${id} is deleted`);
    })
    .catch((err) => {
      res.send("error");
      console.log(err);
    });
};
