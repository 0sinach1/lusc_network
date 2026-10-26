"use server";

import { cookies } from "next/headers";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("lusc_session"); 
  cookieStore.delete("token"); 
}

export async function getSessionRole() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("lusc_session")?.value || cookieStore.get("token")?.value;
    
    if (!token) return "chairman"; 
    
    // Safely decode the JWT
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    const userIdentifier = payload.username || payload.role || "chairman";
    return String(userIdentifier).toLowerCase(); 
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return "chairman"; // Failsafe
  }
}