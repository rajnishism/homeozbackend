import Razorpay from "razorpay";
import { Appointement } from "../db/models/appointmentSchema.js";
import { Payment } from "../db/models/payments.js";
import crypto from "crypto";
import { type } from "os";
const razorpay = new Razorpay({
  key_id: "rzp_test_wnTfrZx6ogS5Ge",
  key_secret: "GneHyAZ9Kx4tEvSITAy4SrXJ",
});

export const createOrder = async (req, res) => {
  try {
    const { data, fee } = req.body;
    // let allApointMent=await Appointement.find({});
    // console.log(allApointMent.length);
    // let aid=`Homeoz000${allApointMent.length+1}`
    // console.log(aid);
    const date = new Date();
    const newAppointment = await Appointement.create({
      personal: {
        name: data.name,

        age: data.age,
        gender: data.gender,
        phone: data.phone,
        symptoms: data.symptom,
      },
      consultation: [
        {
          dateOfBooking: date,
        },
      ],
    });
    if (!newAppointment) {
      console.log("Error");
    }
    // console.log(newAppointment);
    const amount = Number(fee * 100); // Amount in paisa (e.g., 10000 paisa = 100 INR)
    const currency = "INR";
    const options = {
      amount,
      currency,
      // You can generate a unique receipt ID here
    };

    const order = await razorpay.orders.create(options);
    // console.log(order);
    //   res.send("added");
    return res.status(200).json({
      message: "Success",
      data: order,
      aid: newAppointment._id,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    // console.log(req.body);
    const fulliId = req.params.id.split(".");
    const aid = fulliId[0];
    let currentAppointment = await Appointement.findById(aid);
    const amount = Number(fulliId[1]);
    let secret = "GneHyAZ9Kx4tEvSITAy4SrXJ";
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const order_id = req.body.razorpay_order_id;
    const razorpay_signature = req.body.razorpay_signature;
    const final = order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(final.toString())
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      //save transaction in db-:
      let newPayment = await Payment.create({
        paymentId: razorpay_payment_id,
        orderId: order_id,
        amount: amount,
        status: true,
        user: currentAppointment.id,
      });

      currentAppointment.personal.payments.push(newPayment.id);
      currentAppointment.save();
      return res.redirect(
        `http://localhost:3000/paymentSuccess?ref=${razorpay_payment_id}`
      );
    } else {
      // console.log("false");
      let newPayment = await Payment.create({
        paymentId: razorpay_payment_id,
        orderId: order_id,
        amount: amount,
        status: false,
        user: currentAppointment.id,
      });
      currentAppointment.personal.payments.push(newPayment.id);
      currentAppointment.save();
      return res.redirect(`http://localhost:3000/falied-payment`);
    }
  } catch (err) {
    res.send(err);
  }
};

export const deleteAllPayments = async (req, res) => {
  try {
    let allPayments = await Payment.deleteMany({});
    return res.status(200).json({
      message: "All Payments",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server Error",
    });
  }
};
export const getAllPayments = async (req, res) => {
  try {
    let allPayments = await Payment.find({ status: true });
    return res.status(200).json({
      message: "All Payments",
      data: allPayments,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server Error",
    });
  }
};
export const getUserPayment = async (req, res) => {
  try {
    let { name } = req.body;
    // console.log(name);
    let allPayments = await Appointement.findOne({
      "personal.name": name,
    }).populate("personal.payments");
    if (!allPayments) {
      return res.status(400).json({
        message: "No Payment Found",
      });
    }
    // console.log(allPayments);
    return res.status(200).json({
      message: "All Payments",
      data: allPayments,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server Error",
    });
  }
};
