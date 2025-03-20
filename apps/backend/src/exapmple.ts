import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

// 🎟️ Coupon Schema (Stores coupons & claim data)
const CouponSchema = new Schema({
    code: { type: String, unique: true, required: true }, // Unique coupon code
    discount: { type: Number, required: true }, // Discount percentage
    isActive: { type: Boolean, default: true }, // Admin can enable/disable
    claimedBy: [{
        ip: { type: String, required: true }, // IP address of the user
        sessionId: { type: String, required: true }, // Unique session ID (stored in cookies)
        timeStamp: { type: Date, default: Date.now }
    }],
    admin: { type: Types.ObjectId, ref: "Admin", required: true }, // Admin reference
    createdAt: { type: Date, default: Date.now }
});

// 🛠️ Admin Schema (For authentication & managing coupons)
const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// ✅ Export Models
export const CouponModel = model("Coupon", CouponSchema);
export const AdminModel = model("Admin", AdminSchema);
