import axios from "axios";

const BASE_API = process.env.NEXT_PUBLIC_BACKEND_URL || "https://the-sales-studio.up.railway.app/api";

const api = axios.create({baseURL:BASE_API,withCredentials:true});



//claiming the coupon
export const claimCoupon =  async()=>{
    try{
        const response = await api.post("/claim");
        console.log("api responsees",response.data)
        return response.data;

    }catch(error){
        
        throw new Error("You have already claim try later!")
        
    }
}
//admin login
export const adminLogin= async( username:string, password:string)=>{
    try{
        const response = await api.post("/admin/login",{username,password});
        console.log("response data of admin:",response.data)
        return response.data;

    }catch(error){
        console.error(error,"error while loging in admin section")
    }
}
//geting coupons
export const getAdminCoupons= async ()=>{
    try{
        const response = await api.get("admin/coupons");
        console.log("in api.ts get admincoups:",response.data)
        return response.data;
    }catch(error){
        console.error(error,"errr while geting coupons for admin")
    }
}
//add Coupon
export const addCoupon = async ()=>{
    try{
        const response = await api.post("admin/add/");
    }catch(error){

    }
}