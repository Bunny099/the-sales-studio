import mongoose, { Document } from "mongoose";
import { Schema } from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;


const CouponSchema = new Schema({
    coupon: { type: String, unique:true,required:true },
    isActive: { type: Boolean, default: true },
    isClaimed:{type:Boolean,default:false},
    claimedBy: [{
        ip: { type: String , required:true},
        cookie: { type: String,required:true },
        timeStamp:{ type:Date, default:Date.now}
    }],
    admin: { type: ObjectId, ref: "Admin", required: true },
    assignedAt:{type:Date},
    createdAt: { type: Date, default: Date.now }
})
const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})
const systemSchema = new Schema ({
    lastAssignedCoupon:{type:ObjectId,ref:"Coupon",default:null}
})


export const CouponModel = mongoose.model("Coupon", CouponSchema)
export const AdminModel = mongoose.model("Admin", AdminSchema);
export const systemModel= mongoose.model("System",systemSchema)
