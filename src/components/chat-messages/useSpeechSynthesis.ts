
import { useState, useEffect, useRef } from "react";
import { Message } from "../../helpers/types";


const SPEECH_LANG = "en-US";      // Language set to English (US)
const SPEECH_VOLUME = 1.0;        // Full volume for audio playback
const SPEECH_RATE = 1.0;          // Normal speaking rate

// Custom hook to manage speech synthesis for chat messages
export function useSpeechSynthesis(messages: Message[]) {

  // Ref to store speech utterances for each message
  const speechRef = useRef<SpeechSynthesisUtterance[]>([]);
  // State to track which messages are currently playing audio
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  // State to indicate when browser voices are loaded
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Effect to load available voices from the browser
  useEffect(() => {
    // Function to fetch and check available voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesLoaded(true); // Set flag when voices are ready
    };
    loadVoices(); // Initial call to load voices
    window.speechSynthesis.onvoiceschanged = loadVoices; // Listen for voice changes
    return () => {
      // Cleanup listener to prevent memory leaks
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []); 
  
  // Effect to initialize speech utterances for AI messages
  useEffect(() => {
    messages.forEach((msg, index) => {
      // Only process AI messages that don’t already have an utterance
      if (msg.role === "ai" && !speechRef.current[index]) {
        // Create a new speech utterance with the message content
        const utterance = new SpeechSynthesisUtterance(msg.content);
        utterance.lang = SPEECH_LANG;    // Set language to US English
        utterance.volume = SPEECH_VOLUME; // Set volume to max
        utterance.rate = SPEECH_RATE;    // Set normal speech rate
        if (voicesLoaded) {
          // Select a female voice if available (e.g., Samantha or Zira)
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice = voices.find(v =>
            ["Samantha", "Zira"].some(name => v.name.includes(name)) ||
            v.name.toLowerCase().includes("female")
          );
          utterance.voice = femaleVoice || voices[0]; // Fallback to first voice if no female found
        }
        speechRef.current[index] = utterance; // Store the utterance in the ref
      }
    });
    // Update isPlaying state to match the current message count
    setIsPlaying(prev => messages.map((_, i) => prev[i] || false));
  }, [messages, voicesLoaded]); // Runs when messages or voicesLoaded changes

  // Function to toggle play/pause for a specific message’s audio
  const toggleAudio = (index: number) => {
    const utterance = speechRef.current[index];
    if (!utterance) return; // Exit if no utterance exists for this index

    if (isPlaying[index]) {
      // Pause the audio if it’s currently playing
      window.speechSynthesis.pause();
    } else {
      // Stop any current audio and start playing this utterance
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
    // Toggle the playing state for this message only
    setIsPlaying(prev => prev.map((playing, i) => i === index ? !playing : playing));
  };

  // Return the playing state and toggle function for use in components
  return { isPlaying, toggleAudio };
}