"use server";

import { cookies } from "next/headers";

export async function logout() {
  // Ensure this matches your actual cookie name
  cookies().delete("lusc_session"); 
}

export async function getSessionRole() {
  const token = cookies().get("lusc_session")?.value;
  if (!token) return "chairman"; // Fallback
  
  try {
    // Decode the JWT payload without needing external libraries
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    // Assuming your JWT payload has a 'role' property (e.g., { role: "superadmin" })
    return payload.role; 
  } catch (error) {
    return "chairman";
  }
}