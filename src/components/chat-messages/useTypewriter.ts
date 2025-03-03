
import { useEffect, useState } from "react";
import { Message } from "../../helpers/types";

// define the delay between words for the typewriter effect
const TYPEWRITER_DELAY_MS = 20;

// Custom hook to animate message display with a typewriter effect
export function useTypewriter(messages: Message[], prevLengthRef: React.MutableRefObject<number>) {
  
  // State to hold the content being displayed, initialized with full message contents
  const [displayedContent, setDisplayedContent] = useState<string[]>(messages.map(msg => msg.content));

  // Effect to handle new messages and apply the typewriter animation
  useEffect(() => {
    // Calculate how many new messages have been added since last render
    const newMessageCount = messages.length - prevLengthRef.current;
    if (newMessageCount <= 0) return; // Exit if no new messages to process

    // Get the most recent message to check its role
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "ai") {
      // For non-AI messages, update content immediately without animation
      setDisplayedContent(messages.map(msg => msg.content));
      prevLengthRef.current = messages.length; // Update the ref to the current length
      return;
    }

    // Split the AI message into words for the typewriter effect
    const words = lastMessage.content.split(" ");
    let currentContent = ""; // Build the content word by word
    let wordIndex = 0;       // Track the current word index

    // Recursive function to simulate typing by adding words over time
    const typeNextWord = () => {
      if (wordIndex < words.length) {
        // Add the next word, with a space if not the first word
        currentContent += currentContent ? " " + words[wordIndex] : words[wordIndex];
        // Update displayed content with the latest typed portion
        setDisplayedContent([...messages.slice(0, -1).map(msg => msg.content), currentContent]);
        wordIndex++;
        // Schedule the next word after a short delay
        setTimeout(typeNextWord, TYPEWRITER_DELAY_MS);
      }
    };

    // Start with an empty string for the new AI message to begin typing
    setDisplayedContent([...messages.slice(0, -1).map(msg => msg.content), ""]);
    // Kick off the typewriter effect with an initial delay
    setTimeout(typeNextWord, TYPEWRITER_DELAY_MS);
    prevLengthRef.current = messages.length; // Update ref after processing
  }, [messages]); // Runs when the messages array changes

  // Return the current displayed content for use in the component
  return displayedContent;
}