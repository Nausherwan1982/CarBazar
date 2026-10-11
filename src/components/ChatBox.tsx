"use client";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-20 md:bottom-6 right-4 z-40 bg-red-600 text-white p-4 rounded-full shadow-xl hover:bg-red-700">
        {open ? <X /> : <MessageCircle />}
      </button>
      {open && (
        <div className="fixed bottom-36 md:bottom-24 right-4 w-80 h-96 bg-white rounded-2xl shadow-2xl z-40 flex flex-col">
          <div className="p-3 bg-red-600 text-white rounded-t-2xl font-semibold">CarBazar Chat</div>
          <div className="flex-1 p-3 text-sm text-gray-600 overflow-y-auto">Hi  How can we help you today?</div>
          <input className="border-t p-3 outline-none" placeholder="Type a message" />
        </div>
      )}
    </>
  );
}
