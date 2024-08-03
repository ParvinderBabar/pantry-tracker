

"use client";

import Walkthrough from "@/Components/Walkthrough.js";
import { UserProvider } from "./UserContext/page.js";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <UserProvider>
  <Walkthrough />
      </UserProvider>
    
    </div>
  );
}
