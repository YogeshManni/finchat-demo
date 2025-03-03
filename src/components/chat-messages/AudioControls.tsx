 
import { AudioControlsProps } from "../../helpers/types";

// AudioControls component to render a play/pause toggle button
export function AudioControls({ isPlaying, onToggle }: AudioControlsProps) {
  return (
    // Button with dynamic styling based on play/pause state
    <button
      onClick={onToggle} // Trigger the toggle function passed from the parent
      className={`mt-2 px-4 py-1 ${
        isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
      } text-white rounded-lg transition-all duration-200`} // Conditional styling: red for pause, blue for play
      aria-label={isPlaying ? "Pause audio" : "Play audio"} // Accessibility label for screen readers
    >
      {isPlaying ? "Pause" : "Play"} 
    </button>
  );
}