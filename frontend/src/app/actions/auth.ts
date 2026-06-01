"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { users } from "@/lib/data";

export async function mockLogin(formData: FormData) {
  const email = formData.get("email")?.toString();
  
  // Verify user exists in mock data
  const user = users.find(u => u.email === email);
  
  if (!user) {
    redirect("/login?error=not_found");
  }

  // Grab the cookie store
  const cookieStore = await cookies();
  
  // Set auth tokens
  cookieStore.set("auth-token", "mock-jwt-token-123", { 
    httpOnly: true, 
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  // Set current user ID
  cookieStore.set("mock-user-id", user.id, { 
    httpOnly: true, 
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  
  redirect("/");
}

export async function mockSignup(formData: FormData) {
  // Extract fields (just for simulation)
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  
  if (!name || !email || !password) {
    redirect("/signup?error=missing_fields");
  }

  // Simulate a successful registration
  // In a real app, we'd save to DB here. For now we just redirect to login with a success param.
  redirect("/login?success=registered");
}

export async function mockLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  cookieStore.delete("mock-user-id");
  
  redirect("/login");
}
