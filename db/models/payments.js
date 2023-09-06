import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
    paymentId:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:false
    },
    amount:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'appointment'
    }
})

export const Payment=mongoose.model('Payment',paymentSchema);