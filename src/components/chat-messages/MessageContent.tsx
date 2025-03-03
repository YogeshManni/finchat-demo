
import { MessageContentProps } from "@/helpers/types";

// Component to render structured message content with headers and body text
export function MessageContent({ content }: MessageContentProps) {

  // Split the content into sections based on double newlines, filtering out empty ones
  const sections = content.split("\n\n").filter(Boolean);

  return (
    
    <>
      {/* Iterate over each section to display headers and paragraphs */}
      {sections.map((section, index) => {
        // Break the section into lines, removing any empty ones
        const lines = section.split("\n").filter(Boolean);
        const header = lines[0]; // First line is treated as the header
        const bodyLines = lines.slice(1); // Remaining lines form the body text

        return (
          // Container for each section with spacing for readability
          <div key={index} className="mb-6">
            {/* Header styled prominently with a light gray color */}
            <h3 className="text-base font-semibold text-gray-200 mb-2">{header}</h3>
            {/* Body text container with relaxed leading for better legibility */}
            <div className="text-sm text-gray-300 leading-relaxed">
              {/* Render each body line as a separate paragraph */}
              {bodyLines.map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}