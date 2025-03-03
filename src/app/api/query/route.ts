import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  getLatestTranscript,
  getMultipleTranscripts,
  getFinancialMetrics,
  getIncomeStatement,
  getBalanceSheet,
} from "../../../utils/fmpApi";
import {
  summarizeTranscript,
  extractComments,
  getCategorizedData,
} from "../../../utils/openAiApi";
import logger from "../../../utils/logger";

// Retrieve FMP API key from environment variables for secure access
const FMP_API_KEY = process.env.FMP_API_KEY || "";
// Define the base URL for FMP API requests to centralize configuration
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

// Converts a company name to its ticker symbol using FMP's search endpoint
async function getTickerFromCompanyName(companyName: string): Promise<string> {
  try {
    const response = await axios.get(
      `${FMP_BASE_URL}/search?query=${encodeURIComponent(
        companyName
      )}&limit=1&apikey=${FMP_API_KEY}`
    );
    const data = response.data;
    // Return the ticker if found, otherwise an empty string
    return data.length > 0 ? data[0].symbol : "";
  } catch (error) {
    // Log any errors encountered during the ticker fetch
    console.error(`Failed to fetch ticker for ${companyName}:`, error);
    return "";
  }
}

// Uses OpenAI to categorize the prompt into predefined categories
async function categorizePrompt(prompt: string) {
  // List of supported categories for prompt classification
  const categories = [
    // for now I have just added some simple basic categories, but it should be refined more, and more categories can be added.
    "Company Info",
    "CEO Comments",
    "Earnings Summary",
    "Financial Metrics",
    "General Inquiry",
    "Mixed Query", // Included to handle combined intents
    
  ];
  const response = await getCategorizedData(prompt, categories);
  const result = JSON.parse(response);
  return result; // Returns parsed categorization data
}

// Handles POST requests to process user prompts and fetch financial data
export async function POST(req: NextRequest) {
  // Extract the user's prompt from the request body
  const { prompt } = await req.json();

  try {
    // Step 1: Categorize the prompt using OpenAI
    const { category, companies, ceos, topic } = await categorizePrompt(prompt);
    // Log the categorization result for debugging and tracking
    logger.info({
      message: "Categorized prompt",
      data: { category, companies, ceos, topic },
    });

    // Step 2: Resolve company names to ticker symbols
    const companySymbols = await Promise.all(
      companies.map(async (company: string) => {
        const ticker = await getTickerFromCompanyName(company);
        return ticker || ""; // Filter out invalid tickers later
      })
    ).then((tickers) => tickers.filter((t) => t)); // Remove empty results

    // Warn if no valid company symbols are found, but proceed with empty data
    if (!companySymbols.length) {
      logger.warn({
        message: "No valid companies identified in the prompt.",
        data: { category, companies, ceos, topic },
      });
      
      // throw new Error("No valid companies identified in the prompt.");
    }

    // Step 3: Fetch data from FMP based on the identified category
    let dataToProcess: string = "";

    // Encapsulate FMP data fetching in a try-catch for error handling
    try {
      switch (category) {
        case "CEO Comments":
          // Fetch multiple transcripts per company to extract CEO comments
          const allComments = await Promise.all(
            companySymbols.map(async (symbol) => {
              const transcripts = await getMultipleTranscripts(symbol);
              return transcripts.length > 0
                ? `${symbol} transcripts:\n${transcripts
                    .map((t: any) => t.content)
                    .join("\n\n")}`
                : `${symbol}: `;
            })
          );
          dataToProcess = allComments.join("\n\n"); // Concatenate all comments
          break;

        case "Earnings Summary":
          // Retrieve the latest transcript for a summary
          const transcript = await getLatestTranscript(companySymbols[0]);
          dataToProcess = transcript
            ? transcript.content
            : ""; // Fallback message if no data
          break;

        case "Financial Metrics":
          // Fetch financial data concurrently for efficiency
          const [metrics, _transcript, income, balance] = await Promise.all([
            getFinancialMetrics(companySymbols[0]).catch(() => ""),
            getLatestTranscript(companySymbols[0]).catch(() => ""),
            getIncomeStatement(companySymbols[0]).catch(() => ""),
            getBalanceSheet(companySymbols[0]).catch(() => ""),
          ]);

          // Check if all data fetches failed
          if (
            metrics === "" &&
            income === "" &&
            balance === "" &&
            _transcript === ""
          ) {
            dataToProcess = "";
          } else {
            // Format fetched data into a structured string
            dataToProcess = `Key Financial Metrics:\n${JSON.stringify(
              metrics,
              null,
              2
            )}\n\n
                         Income Statement:\n${JSON.stringify(
                           income,
                           null,
                           2
                         )}\n\n
                         Balance Sheet:\n${JSON.stringify(balance, null, 2)}
                         Transcipt that we can use : \n${JSON.stringify(
                           _transcript.content,
                           null,
                           2
                         )}`;
          }
          break;

        case "General Inquiry":
          // Fetch multiple transcripts for broader inquiries
          const generalTranscripts = await getMultipleTranscripts(
            companySymbols[0]
          );
          dataToProcess =
            generalTranscripts.length > 0
              ? generalTranscripts.map((t: any) => t.content).join("\n\n")
              : "";
          break;

        case "Mixed Query":
          // Handle queries with multiple intents (e.g., summary + metrics)
          const mixedData: string[] = [];

          // Fetch summary transcript
          const summaryTranscript = await getLatestTranscript(companySymbols[0]);
          mixedData.push(
            summaryTranscript
              ? `Earnings Summary:\n${summaryTranscript.content}`
              : ""
          );

          // Fetch comments from all companies
          const commentsData = await Promise.all(
            companySymbols.map(async (symbol) => {
              const transcripts = await getMultipleTranscripts(symbol);
              return transcripts.length > 0
                ? `${symbol} transcripts:\n${transcripts
                    .map((t: any) => t.content)
                    .join("\n\n")}`
                : `${symbol}: `;
            })
          );
          mixedData.push(`Comments:\n${commentsData.join("\n\n")}`);

          // Add metrics if the prompt asks for numeric data
          if (
            prompt.toLowerCase().includes("how many") ||
            prompt.toLowerCase().includes("revenue") ||
            prompt.toLowerCase().includes("spending")
          ) {
            const metricsData = await getFinancialMetrics(companySymbols[0]);
            mixedData.push(
              metricsData
                ? `Metrics:\n${JSON.stringify(metricsData)}`
                : "No financial metrics available"
            );
          }

          dataToProcess = mixedData.join("\n\n"); // Join all data sections
          break;

        default:
          // Unrecognized category from OpenAI - throw an error
          throw new Error("Unrecognized category");
      }
    } catch (error: any) {
      // Handle errors from FMP data fetching
      if (dataToProcess === null || dataToProcess === undefined || dataToProcess === "No data available") {
        dataToProcess = ""; // Ensure dataToProcess is a string if invalid
      }
      logger.error({
        message: "Error while fetching and processing data from FMP api - ",
        data: error,
      });
    } finally {
      // Prepare the final prompt for OpenAI processing
      const finalPrompt = `Prompt: ${prompt}\nCategory: ${category}\n${
        ceos ? `CEOs: ${ceos.join(", ")}\n` : ""
      }Topic: ${topic}`;

      // Log what we’re sending to OpenAI for tracking
      logger.info({
        message: "Sending Prompt and Data Received from FMP to OpenAI: ",
        data: dataToProcess,
      });

      // Process the data with OpenAI based on category
      const finalResponse =
        category === "Earnings Summary"
          ? await summarizeTranscript({ content: dataToProcess }, finalPrompt)
          : await extractComments(
              [{ content: dataToProcess }],
              topic,
              category,
              prompt
            );

      // Log the final response before sending it back
      logger.info({ message: "Final response from OpenAI", data: finalResponse });
      return NextResponse.json({ response: finalResponse });
    }
  } catch (error: any) {
    // Catch any top-level errors and return a 500 response
    logger.error({
      message: "Error processing prompt : ",
      data: error.message,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}