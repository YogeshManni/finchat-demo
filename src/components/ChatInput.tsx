"use client";


import { useState } from "react";

// ChatInput component that takes an onSend callback to pass user input upstream

export default function ChatInput({ onSend }: { onSend: (input: string) => void }) {
  //track the user's input in the text field
  const [input, setInput] = useState("");

  // Handle form submission when the user sends a message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form refresh behavior
    if (input.trim()) { // Only proceed if there’s actual text after trimming whitespace
      onSend(input);    // Send the input to the parent component via callback
      setInput("");     // Clear the input field after sending
    }
  };

  return (
   
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gradient-to-t from-gray-800 to-gray-900 border-t border-gray-700 shadow-lg"
    >
      {/* Container for input and button with a fade-in animation */}
      <div className="flex items-center gap-4 animate-fade-in">
        {/* Text input field with custom styling for dark mode */}
        <input
          type="text"
          value={input} // Bind the input value to our state
          onChange={(e) => setInput(e.target.value)} // Update state on every change
          placeholder="Ask about a company, Ex - Summarize Spotify's latest conference call..." 
          className="flex-1 p-4 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-all duration-300 placeholder-gray-400 text-sm font-medium shadow-inner hover:border-gray-500"
        />
        {/* Submit button with gradient styling and hover effects */}
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-blue-600 hover:scale-105 transition-all duration-300 transform active:scale-95 font-semibold tracking-wide"
        >
          Send
        </button>
      </div>
    </form>
  );
}