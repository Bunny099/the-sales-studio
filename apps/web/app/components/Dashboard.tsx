"use client";
import { useState, useEffect } from "react";
import { getAdminCoupons } from "@/lib/api";


interface ClaimedBy{
  ip:string,
  cookie:string,
  timeStamp:string
}
interface Coupon{
  coupon:string,
  isActive:Boolean,
  isClaimed:Boolean,
  claimedBy:ClaimedBy[];
}

export function Dashboard() {
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAdminCoupons(); // Wait for API response
      console.log("API dashboard response:", data);
      if (data && Array.isArray(data.coupons)) {
        setCoupons(data.coupons); // Ensure you set the correct field
      }else{
        setCoupons([])
      }
    };

    fetchData();
  }, []);

  return (
    <div>
    <div>
      <h1 className="text-2xl text-black font-bold">Dashboard</h1>
     
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-200">
                < th className="border border-gray-300 p-2">Coupon code</ th>
                < th className="border border-gray-300 p-2">Active</ th>
                < th className="border border-gray-300 p-2">Claimed</ th>
                < th className="border border-gray-300 p-2">Claimed By</ th>
               
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0? (
              coupons.map((coupon,index)=>(
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{coupon.coupon}</td>
                  <td className="border border-gray-300 p-2">{coupon.isActive ? "Yes":"No"}</td>
                  <td className="border border-gray-300 p-2">{coupon.isClaimed? "yes" :"No"}</td>
                  <td className="border border-gray-300 p-2">
                    {coupon.claimedBy.length > 0 ? (
                      <table className="w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-blue-200">
                            < th className="border border-gray-200 p-1">Ip Address</ th>
                            < th className="border border-gray-200 p-1">Cookie</ th>
                            < th className="border border-gray-200 p-1">Timestamp</ th>
                          </tr>
                        </thead>
                        <tbody>
                          {coupon.claimedBy.map((claim:ClaimedBy,i)=>(
                            <tr key={i}>
                              <td className="border border-gray-200 p-1 whitespace-nowrap text-sm w-28">{claim.ip}</td>
                              <td className="border border-gray-200 p-1 overflow-hidden text-ellipsis max-w-xs ">{claim.cookie}</td>
                              <td className="border border-gray-200 p-1 text-sm ">{new Date(claim.timeStamp).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) :("No claimed yet")}
                  </td>
                </tr>
              ))
              ):(
                <tr>
                  <td colSpan={4} className="border border-gray-300 p-2">No coupons availble</td>
                </tr>
              )}

            </tbody>
          </table>


    </div>

  
    </div>
      
  );
}

export default Dashboard;
