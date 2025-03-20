"use client";
import axios from "axios";

import { redirect, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { adminLogin } from "@/lib/api";

export function Login() {
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleLogin() {
    const username = userRef.current?.value.trim();
    const password = passRef.current?.value.trim();
    if (!username || !password) {
      alert("Invalid credentials");
      return;
    }
    try{
    const data = await adminLogin(username ,password);
    if(data?.success){
      router.push("/admin/dashboard")
    }else{
      alert(data?.message || "login failed")
    }
     
  }catch(error){
    console.error("Error while loging!",error);
    alert("Something went wrong try again!")
  }
  }
  return (
    <>
      
        <div className=" h-75 w-70 rounded-2xl p-4 shadow-2xl hidden:md:flex">
          <div>
            <h1 className="text-2xl font-serif text-center p-2 ">Admin Login </h1>
          </div>
          <div className="p-2">
            <h1 className="text-lg text-black font-serif">Username</h1>
            <input
              ref={userRef}
              className="outline-none bg-blue-100 p-1 rounded-lg"
              type="text"
              placeholder="Enter username"
            />
          </div>
          <div className="p-2">
            <h1 className="text-lg text-black font-serif">Passoword</h1>
            <input
              ref={passRef}
              className="outline-none bg-blue-100 p-1 rounded-lg"
              type="password"
              placeholder="Enter password"
            />
          </div>
          <div className="p-2">
            <div
              onClick={handleLogin}
              className="hover:bg-black cursor-pointer bg-blue-700 text-white p-1 text-lg text-center rounded-2xl"
            >
              Login
            </div>
          </div>
        </div>
     
      
    </>
  );
}
