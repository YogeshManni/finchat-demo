import axios from "axios";

// Fetch the FMP API key from environment variables for secure access
const FMP_API_KEY = process.env.FMP_API_KEY;
// Base URL for all FMP API requests, defined here to avoid repetition
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

// Note: If time permits, we could fetch annual reports via FMP’s API for richer data and fetch specific yearly/quarterly reports based on the query.
// However, the data volume might overwhelm OpenAI, so we’d need to extract specific sections based on the query.

// Fetches an earnings call transcript for a specific year and quarter
export async function getTranscriptByQuarter(
  companySymbol: string,
  year: number,
  quarter: number
): Promise<any> {
  try {
    // Construct the API request with year and quarter parameters
    const response = await axios.get(
      `${FMP_BASE_URL}/earning_call_transcript/${companySymbol}?year=${year}&quarter=${quarter}&apikey=${FMP_API_KEY}`
    );
    // Check if the response contains data, throw an error if it’s empty
    if (!response.data.length) {
      throw new Error(`No transcript found for ${companySymbol} Q${quarter} ${year}`);
    }
    return response.data[0]; // Return the first (and only) transcript matching the criteria
  } catch (error) {
    
    throw new Error("Failed to fetch transcript from FMP API");
  }
}

// Retrieves the most recent earnings call transcript available
export async function getLatestTranscript(companySymbol: string) {
  try {
    // Use limit=1 to get just the latest transcript
    const response = await axios.get(
      `${FMP_BASE_URL}/earning_call_transcript/${companySymbol}?limit=1&apikey=${FMP_API_KEY}`
    );
    
    return response.data[0]; // Return the latest transcript
  } catch (error) {
    
    throw new Error("Failed to fetch transcript from FMP API");
  }
}

// Fetches a specified number of recent transcripts for a company
export async function getMultipleTranscripts(companySymbol: string, limit = 3) {
  try {
    // Request multiple transcripts with a configurable limit (defaults to 3)
    const response = await axios.get(
      `${FMP_BASE_URL}/earning_call_transcript/${companySymbol}?limit=${limit}&apikey=${FMP_API_KEY}`
    );
    
    return response.data; // Return the full array of transcripts
  } catch (error) {
    
    throw new Error("Failed to fetch multiple transcripts");
  }
}

// Gets the latest financial metrics for a company
export async function getFinancialMetrics(companySymbol: string) {
  try {
    // Fetch key metrics using limit=1 for the most recent data
    const response = await axios.get(
      `${FMP_BASE_URL}/key-metrics/${companySymbol}?limit=1&apikey=${FMP_API_KEY}`
    );
    
    return response.data[0]; // Return the latest metrics object
  } catch (error) {
    
    throw new Error("Failed to fetch financial metrics");
  }
}

// Retrieves the latest income statement for a company
export async function getIncomeStatement(companySymbol: string) {
  try {
    // Use limit=1 to get the most recent income statement
    const response = await axios.get(
      `${FMP_BASE_URL}/income-statement/${companySymbol}?limit=1&apikey=${FMP_API_KEY}`
    );
    return response.data[0]; // Return the latest income statement
  } catch (error) {
    // Log a failure message if the request doesn’t work
    throw new Error("Failed to fetch income statement from FMP API");
  }
}

// Fetches the latest balance sheet for a company
export async function getBalanceSheet(companySymbol: string) {
  try {
    // Request the most recent balance sheet with limit=1
    const response = await axios.get(
      `${FMP_BASE_URL}/balance-sheet-statement/${companySymbol}?limit=1&apikey=${FMP_API_KEY}`
    );
    return response.data[0]; // Return the latest balance sheet data
  } catch (error) {
    
    throw new Error("Failed to fetch balance sheet from FMP API");
  }
}