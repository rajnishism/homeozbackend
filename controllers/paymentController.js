import Razorpay from "razorpay";
import crypto from "crypto";

import { Appointement } from "../db/models/appointmentSchema.js";
import { Payment } from "../db/models/payments.js";
import { updateAppointmentTimeStats } from "../services/appointmentTimeStats.service.js";

/* ======================================================
   RAZORPAY CONFIGURATION
   ====================================================== */

const razorpay = new Razorpay({
  key_id: "rzp_test_wnTfrZx6ogS5Ge",
  key_secret: "GneHyAZ9Kx4tEvSITAy4SrXJ",
});

/* ======================================================
   CREATE ORDER
   - Creates appointment (PENDING payment)
   - Creates Razorpay order
   ====================================================== */

export const createOrder = async (req, res) => {
  console.log("🟢 CREATE ORDER API HIT");

  try {
    const { data, fee } = req.body;
    console.log("📥 Request body:", data, "Fee:", fee);

    /* ---------- Step 1: Booking date ---------- */
    const bookingDate = new Date();
    console.log("📅 Booking date:", bookingDate);

    /* ---------- Step 2: Create appointment (pending) ---------- */
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
          dateOfBooking: bookingDate,
        },
      ],
    });

    console.log("💾 Appointment created:", newAppointment._id);

    /* ---------- Step 3: Create Razorpay order ---------- */
    const amount = Number(fee * 100); // INR → paisa
    const options = {
      amount,
      currency: "INR",
    };

    console.log("💳 Creating Razorpay order...");
    const order = await razorpay.orders.create(options);
    console.log("💳 Razorpay order created:", order.id);

    /* ---------- Step 4: Respond to frontend ---------- */
    return res.status(200).json({
      message: "Order created",
      order,
      appointmentId: newAppointment._id,
    });
  } catch (err) {
    console.error("❌ Error in createOrder:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   VERIFY PAYMENT
   - Verifies Razorpay signature
   - Saves payment
   - Updates appointment stats (ONLY on success)
   ====================================================== */

export const verifyPayment = async (req, res) => {
  console.log("🟢 VERIFY PAYMENT API HIT");

  try {
    /* ---------- Step 1: Extract appointmentId & amount ---------- */
    const [appointmentId, amountStr] = req.params.id.split(".");
    const amount = Number(amountStr);

    console.log("🔍 Appointment ID:", appointmentId, "Amount:", amount);

    const appointment = await Appointement.findById(appointmentId);
    if (!appointment) {
      console.warn("⚠️ Appointment not found");
      return res.status(404).send("Appointment not found");
    }

    /* ---------- Step 2: Razorpay signature verification ---------- */
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const secret = "GneHyAZ9Kx4tEvSITAy4SrXJ";
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    /* ================= PAYMENT SUCCESS ================= */
    if (generatedSignature === razorpay_signature) {
      console.log("✅ Payment verified successfully");

      /* ---------- Step 3: Save successful payment ---------- */
      const payment = await Payment.create({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount,
        status: true,
        user: appointment._id,
      });

      appointment.personal.payments.push(payment._id);
      await appointment.save();

      console.log("💾 Payment saved:", payment._id);

      /* ---------- Step 4: Update appointment time stats ---------- */
      const bookingDate = appointment.consultation[0]?.dateOfBooking;

      console.log("📊 Updating time stats for:", bookingDate);
      await updateAppointmentTimeStats(bookingDate, +1);
      console.log("✅ Time stats updated");

      return res.redirect(
        `http://localhost:3000/paymentSuccess?ref=${razorpay_payment_id}`
      );
    }

    /* ================= PAYMENT FAILED ================= */
    console.warn("❌ Payment verification failed");

    const failedPayment = await Payment.create({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount,
      status: false,
      user: appointment._id,
    });

    appointment.personal.payments.push(failedPayment._id);
    await appointment.save();

    return res.redirect(`http://localhost:3000/falied-payment`);
  } catch (err) {
    console.error("❌ Error in verifyPayment:", err);
    return res.status(500).send(err.message);
  }
};

/* ======================================================
   PAYMENT UTILITIES
   ====================================================== */

/**
 * Delete all payment records
 */
export const deleteAllPayments = async (_req, res) => {
  try {
    await Payment.deleteMany({});
    return res.status(200).json({ message: "All payments deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all successful payments
 */
export const getAllPayments = async (_req, res) => {
  try {
    const payments = await Payment.find({ status: true });
    return res.status(200).json({
      message: "All successful payments",
      data: payments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get payments for a specific user
 */
export const getUserPayment = async (req, res) => {
  try {
    const { name } = req.body;

    const appointment = await Appointement.findOne({
      "personal.name": name,
    }).populate("personal.payments");

    if (!appointment) {
      return res.status(400).json({ message: "No Payment Found" });
    }

    return res.status(200).json({
      message: "User payments",
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
