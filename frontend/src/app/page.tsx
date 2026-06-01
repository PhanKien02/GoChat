import { cookies } from "next/headers";
import { users, currentUser } from "@/lib/data";
import { ChatApp } from "@/components/chat/chat-app";

export default async function Home() {
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock-user-id")?.value;

  // Find the logged in user or default to the first user
  const loggedInUser = users.find(u => u._id === mockUserId) || currentUser;

  return <ChatApp initialUser={loggedInUser} />;
}
