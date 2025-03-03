import OpenAI from "openai";
import logger from "./logger";
import {
  categoryPrompt,
  extractCommentsSystemPrompt,
  extractCommentsUserPrompt,
  financialMetricsPrompt,
  summarizeSystemPrompts,
  summarizeUserPrompts,
} from "@/helpers/prompts";
import { Transcript } from "@/helpers/types";

// Set up the OpenAI client with our API key from the environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Core function to interact with OpenAI's chat API
async function callOpenAiChat(
  messages: OpenAI.Chat.ChatCompletionCreateParams["messages"],
  options: Partial<OpenAI.Chat.ChatCompletionCreateParams> = {}
): Promise<string> {
  try {
    // Sending the request to OpenAI with our configured settings
    const response: any = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini for efficiency
      max_tokens: 2000,     // Limiting response length to manage costs
      temperature: 0.2,     // Keeping it low for more deterministic outputs
      ...options,           // Allowing custom options to override defaults
      messages,
    });
    const content = response.choices[0].message.content.trim(); // Extracting and cleaning up the response text
    /*  logger.info({
      message: "OpenAI response received",
      data: { tokenUsage: response.usage },
    }); */ 
    return content; // Return the trimmed content to the caller
  } catch (error) {
    // Log any issues with the API call for troubleshooting
    logger.error({
      message: `OpenAI API call failed`,
      data: `${(error as Error).message}`,
    });
    // Re-throw the error so the caller knows something went wrong
    throw new Error(`OpenAI API call failed: ${(error as Error).message}`);
  }
}

// Function to summarize a single transcript based on the user’s prompt
export async function summarizeTranscript(
  transcript: Transcript,
  prompt: string
): Promise<string> {
  // Building the message array with system and user prompts
  const messages: any = [
    {
      role: "system",
      content: summarizeSystemPrompts(), // System instructions for summarization
    },
    {
      role: "user",
      content: summarizeUserPrompts(prompt, transcript), // User prompt with transcript data
    },
  ];

  // Call OpenAI to process the summary
  return callOpenAiChat(messages);
}

// Extracts specific comments from transcripts based on topic and category
export async function extractComments(
  data: Transcript[],
  topic: string,
  category: string,
  prompt: string
): Promise<string> {
  // Combine all transcript contents into one string for processing
  const combinedContent = data.map((t) => t.content).join("\n\n");

  // Log what we’re sending to OpenAI - helps track data flow
  logger.info({
    message: "Sending Prompt and Data Received from FMP to OpenAI: ",
    data: combinedContent,
  });

  // Prepare messages based on category type
  const messages: any = [
    {
      role: "system",
      content: extractCommentsSystemPrompt(), // System instructions for comment extraction
    },
    {
      role: "user",
      content:
        category === "Financial Metrics"
          ? financialMetricsPrompt(combinedContent, prompt) // Special prompt for financial metrics
          : extractCommentsUserPrompt(prompt, topic, combinedContent), // Default extraction prompt
    },
  ];
  // Call OpenAI with a higher token limit for detailed responses
  return callOpenAiChat(messages, { max_tokens: 2000 });
}

// Categorizes the user’s prompt into predefined categories
export async function getCategorizedData(
  prompt: string,
  categories: string[]
): Promise<string> {
  // Set up the message structure for categorization
  const messages: any = [
    {
      role: "system",
      content: categoryPrompt(categories), // System prompt with category definitions
    },
    {
      role: "user",
      content: `Categorize this prompt and return the full JSON object: ${prompt}`, // User instruction to analyze the prompt
    },
  ];
  // Log the messages for debugging - can remove later if not needed
  console.log(messages);
  // Call OpenAI with a generous token limit to ensure full JSON output
  return callOpenAiChat(messages, { max_tokens: 2000 });
}