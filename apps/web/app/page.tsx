"use client";

import axios from "axios";
import { useState } from "react";
import { claimCoupon } from "./lib/api";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  async function handleClaim() {
    try {
      const data = await claimCoupon();

      console.log("api response:", data);

      if (!data || typeof data !== "object" || !data.coupon) {
        throw new Error(
          data?.message || "Coupon already claimed!Try after sometime."
        );
      }
      setMessage(`Succuss!Your coupon is ${data.coupon}`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error try after sometime!"
      );
    }
  }

  return (
    <>
      <div className="flex flex-col ">
        <div className="w-fit mt-4">
          {" "}
          <img
            className="rounded-2xl"
            src="https://images.unsplash.com/photo-1741462166415-1c5bcbdbbc46?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
        <div className="min-h-screen flex flex-col md:flex-row  bg-green-200 items-center justify-around sm:justify-around  my-2 rounded-lg p-6 ">
          <div className="w-full sm:w-1/2 flex justify-center">
            <img
              className="w-[90%] rounded-xl sm:w-[450px]"
              src="https://images.unsplash.com/photo-1739582766954-800630482ccd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="w-full sm:w-1/2 text-center sm:text-left mt-6 sm:mt-0">
            <h1 className="text-3xl sm:text-4xl  font-bold mb-4">
              Claim Your Exclusive Coupon!
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Click the button below to get a unique discount coupon.
            </p>
            <button
              onClick={handleClaim}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Claim Coupon
            </button>
            <div>
              {message && (
                <p className="text-green-900 mt-4 text-xl sm:text-2xl font-bold">
                  {message}{" "}
                </p>
              )}
            </div>
          </div>
        </div>
       

      </div>
    </>
  );
}
