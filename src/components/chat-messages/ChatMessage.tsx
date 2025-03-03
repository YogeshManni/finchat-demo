"use client";


import { useEffect, useRef } from "react";
import { ChatMessagesProps } from "../../helpers/types";
// Custom hooks for typewriter effect and speech synthesis
import { useTypewriter } from "./useTypewriter";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
// Sub-components for rendering message content and audio controls
import { MessageContent } from "./MessageContent";
import { AudioControls } from "./AudioControls";

// Main component to display chat messages with audio playback
export default function ChatMessages({ messages, loading }: ChatMessagesProps) {

  
  // Ref to scroll to the latest message automatically
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Ref to track the previous number of messages for change detection
  const prevMessagesLengthRef = useRef<number>(0);
  // Use typewriter hook to animate message display
  const displayedContent = useTypewriter(messages, prevMessagesLengthRef);
  // Use speech synthesis hook for audio playback functionality
  const { isPlaying, toggleAudio } = useSpeechSynthesis(messages);

  // Effect to smoothly scroll to the latest message when content changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); // Ensures the latest message is visible
    }
  }, [displayedContent, loading]);

  return (
    // Container for the chat with a dark background and custom scrollbar
    <div className="flex-1 p-6 overflow-y-auto bg-gray-900 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800">
      {/* Map through messages to render each one */}
      {messages.map((msg, index) => (
        <div
          key={index} // Unique key for each message
          className={`mb-6 flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`} // Align user messages right, AI messages left
        >
          <div
            className={`max-w-[70%] p-4 rounded-2xl shadow-lg transition-all duration-200 ${
              msg.role === "user"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" // User message styling
                : "bg-gray-800 text-gray-100 border border-gray-700" // AI message styling
            } hover:shadow-xl`} // Hover effect for depth
          >
            {msg.role === "ai" ? (
              // Render AI messages with content and audio controls
              <div>
                <MessageContent content={displayedContent[index] || ""} /> {/* Display animated content */}
                <AudioControls isPlaying={isPlaying[index]} onToggle={() => toggleAudio(index)} /> {/* Play/pause button */}
              </div>
            ) : (
              // Render user messages as plain text
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {displayedContent[index] || ""}
              </p>
            )}
            {/* Timestamp and role label below each message */}
            <span className="block mt-1 text-xs text-gray-400">
              {msg.role === "user" ? "You" : "AI"} • {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      ))}

      {/* Loading indicator shown when waiting for a response */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-gray-400 animate-pulse">
            
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            <span>Thinking...</span> 
          </div>
        </div>
      )}
      {/* Invisible div for scrolling reference */}
      <div ref={messagesEndRef} />
    </div>
  );
}