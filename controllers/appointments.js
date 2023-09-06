import { Appointement } from "../db/models/appointmentSchema.js";
import Razorpay from "razorpay";
const razorpay = new Razorpay({
  key_id: "rzp_test_wnTfrZx6ogS5Ge",
  key_secret: "GneHyAZ9Kx4tEvSITAy4SrXJ",
});
export const getAppointements = (req, res) => {
  Appointement.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const createAppointment = async (req, res) => {
  try {
    // const newAppointment = new Appointement(req.body);
    // newAppointment.save();
    const { data } = req.body;
    console.log("Aaya", data);
    const amount = 10000; // Amount in paisa (e.g., 10000 paisa = 100 INR)
    const currency = "INR";
    const options = {
      amount,
      currency,
      receipt: "order_receipt", // You can generate a unique receipt ID here
    };

    const order = await razorpay.orders.create(options);
    console.log(order);
    res.send("added");
  } catch (err) {
    res.send(err);
  }
};

export const getAppointement = (req, res) => {
  const id = req.params.id;
  Appointement.findOne({ _id: id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateAppointment = (req, res) => {
  const id = req.params.id;
  Appointement.updateOne({ _id: id }, { $set: req.body })
    .then(res.send(`Blog with id : ${id} updated sucessfully to -> new one `))
    .catch((err) => res.send("error"));
};

export const deleteAppointment = (req, res) => {
  const id = req.params.id;

  Appointement.deleteOne({ _id: id })
    .then(() => {
      res.send(`disease with id: ${id} is deleted`);
    })
    .catch((err) => {
      res.send(err);
    });
};

export const getPaidAppointments = (req, res) => {
  console.log("njhn");
  const paidappointment = [];
  Appointement.find({})
    .then((result) => {
      result.map((data) => {
        if (data.personal.payments.length == 1) {
          paidappointment.push(data);
        }
      });
      res.send(paidappointment);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getPendingConsultation = (req, res) => {
  console.log("getPendingConsultation");
  const pendingConsultation = [];
  Appointement.find({})
    .then((result) => {
      result.map((data) => {
        if (
          data.consultation[data.consultation.length - 1].status == "Pending"
        ) {
          pendingConsultation.push(data);
        }
      });
      res.send(pendingConsultation);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getRevisit = (req, res) => {
  const revisit = [];
  Appointement.find({})
    .then((result) => {
      result.map((data) => {
        if (data.consultation.length > 1) {
          revisit.push(data);
        }
      });
      res.send(revisit);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getPendingMedication = (req, res) => {
  const pendingMedication = [];
  Appointement.find({})
    .then((result) => {
      result.map((data) => {
        if (
          data.consultation[data.consultation.length - 1].status == "Done" ||
          true
        ) {
          pendingMedication.push(data);
        }
      });
      res.send(pendingMedication);
    })
    .catch((err) => {
      console.log(err);
    });
};
