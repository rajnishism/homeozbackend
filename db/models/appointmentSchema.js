import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  personal: {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
    },
    address: {
      type: String,
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
  },
  consultation: [
    {
      mode: {
        type: String,
      },
      dateOfBooking: {
        type: String,
      },
      status: {
        type: String,
        default: "Pending",
      },
      updates: [
        {
          info: {
            type: String,
          },
          date: {
            type: String,
          },
        },
      ],
      doctor: {
        type: String,
      },
    },
  ],

  medicine: [
    {
      orderId: {
        type: String,
      },
      price: {
        type: String,
      },
      status: {
        type: String,

        default: "Not Yet Prescribed",
      },
      updates: [
        {
          update: {
            type: String,
          },
        },
      ],
    },
  ],
});

export const Appointement = mongoose.model("appointment", appointmentSchema);
/*
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Payment',
          default:'',
          required:true,
        },
        status:{
          type:Boolean,
          required:true,
          default:false
        }

*/
