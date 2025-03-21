import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { AdminModel, CouponModel, systemModel } from "./database";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config()
const app = express();

const PORT = Number(process.env.PORT) || 3001;

mongoose.connect(process.env.MONGO_URI as string).then(() => console.log("Mongodb connected")).catch((err) => console.error("Mongodb connection erroer:", err));


app.use(express.json());
app.use(cors({ origin:[process.env.CLIENT_URL || "http://localhost:3000", "https://the-sales-studio-web.vercel.app/"],
  credentials:true ,
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type", "Authorization"]

}));

app.use(cookieParser());
app.set("trust proxy", 1)



app.get("/", (req, res) => {
  res.send("Backend is running!");
});


app.post("/api/claim", async (req: Request, res: Response) => {
  let ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress || '';

  if (ip === "::1") { ip = "127.0.01" }

  let cookie = req.cookies.user_id;
  console.log("cookie recived:", req.cookies)
  if (!cookie) {
    cookie = uuidv4();
    res.cookie("user_id", cookie, {
      "httpOnly": true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      domain:process.env.CLIENT_URL ? new URL(process.env.CLIENT_URL).hostname : undefined,
      "maxAge": 1 * 24 * 60 * 60 * 1000

    });
    console.log(`cookie is: ${cookie}`)
  } else {
    console.log(`existing cookie not found`)

  }

  try {
    const existingClaim = await CouponModel.findOne({
      "claimedBy": {
        $elemMatch: {
          ip: ip,
          cookie: cookie,
          timeStamp: { $gt: new Date(Date.now() - 10 * 60 * 1000) }
        }
      }

    });

    if (existingClaim) {
      res
        .status(400)
        .json({
          message: "you have already claimed the coupon try after sometime!",
        });
      return;
    }
    //  Find the next available coupon (Round-Robin)
    let system = await systemModel.findOne();
    if (!system) {
      system = new systemModel({ lastAssignedCoupon: null });
      await system.save();
    }

    let nextCoupon;
    if (system.lastAssignedCoupon) {
      nextCoupon = await CouponModel.findOneAndUpdate(
        {
          _id: { $gt: system.lastAssignedCoupon },
          isActive: true,
        },
        { $set: { isClaimed: true } },
        { sort: { _id: 1 }, new: true }
      );
    }
    // If no more coupons after last assigned, restart from the first coupon
    if (!nextCoupon) {
      nextCoupon = await CouponModel.findOneAndUpdate(
        {
          isActive: true,
        },
        { $set: { isClaimed: true } },
        { sort: { _id: 1 }, new: true }
      );
    }
    //if all coupon all ready assign restart the sequence
    if (!nextCoupon) {
      await CouponModel.updateMany({}, { $set: { isClaimed: false } });
      nextCoupon = await CouponModel.findOneAndUpdate(
        {
          isActive: true
        },
        { $set: { isClaimed: true } },
        { sort: { _id: 1 }, new: true }
      )
    }
    if (!nextCoupon || !nextCoupon.coupon) {
      res.status(400).json({ message: "No more coupons available." });
      return;
    }
    //assign the coupon to user

    nextCoupon.claimedBy.push({ ip, cookie, timeStamp: new Date() });
    nextCoupon.isClaimed = true;
    await nextCoupon.save();

    //updating the last assign coupon in system model
    system.lastAssignedCoupon = nextCoupon._id;
    await system.save();

    res
      .status(200)
      .json({
        message: "coupon claimed succussfully!",
        coupon: nextCoupon.coupon,
        cookie: cookie,
        ip: ip
      });
  } catch (error) {
    console.error("error while claiming!", error);

    res.status(400).json({ message: "internal server error!" });
  }
});


app.post("/api/admin/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const admin = await AdminModel.findOne({ username, password });
    if (!admin) {
      res
        .status(401)
        .json({ success: false, message: "invalid credential" });
      return;
    }
    res.status(200).json({ success: true, message: "login successful", admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
});

app.get("/api/admin/coupons", async (req, res) => {
  try {
    const coupons = await CouponModel.find().populate("claimedBy");

    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "error while fetching" });
  }
});

app.post("/api/admin/add", async (req, res) => {
  const { coupon, adminId } = req.body;
  try {
    const newCoupon = new CouponModel({
      coupon: coupon,
      isClaimed: false,
      admin: adminId,
    });
    await newCoupon.save();
    res
      .status(200)
      .json({ success: true, message: "coupon created succussfuly" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error while adding coupon" });
  }
});


app.listen(PORT,'0.0.0.0',() => {
  console.log(`Server is running on: ${PORT}`)
});


