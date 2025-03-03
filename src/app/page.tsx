"use client";

import { useState } from "react";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/chat-messages/ChatMessage";

export default function Home() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (input: string) => {
    const userMessage = { role: "user", content: input };
    setMessages((prev : any ) => [...prev , userMessage]);
    setLoading(true);

    try {
     const { data } = await axios.post("/api/query", { prompt: input });
     console.log(data)
      if (data.error) throw new Error(data.error);

      const aiMessage = { role: "ai", content: data.response };
      setMessages((prev : any) => [...prev , aiMessage]);
      
          } catch (error) {
            console.log(error)
      const errorMessage = { role: "ai", content: `Error: ${(error as Error)}` };
      setMessages((prev : any) => [...prev , errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-gray-900">
      <header className="p-6 bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">FinChat</h1>
      </header>
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}