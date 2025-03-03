export interface Message {
    role: "user" | "ai";
    content: string;
  }
  
  export interface ChatMessagesProps {
    messages: Message[];
    loading: boolean;
  }

  export interface AudioControlsProps {
    isPlaying: boolean;
    onToggle: () => void;
  }
  
  export interface MessageContentProps {
    content: string;
  }

  export interface Transcript {
    content: string;
  }
  