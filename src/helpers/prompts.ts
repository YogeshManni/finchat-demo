interface Transcript {
  content: string;
}


const prettifyPrompt =
  "Format the response as plain text with clear section headers and structured paragraphs. Highlight the headings and key metrics such as numbers and focused items. Do not use Markdown symbols like asterisks (**) or dashes (-) for bullet points, use plain text instead. Don't use markdown language to return data. Format the response as plain text with clear section headers (e.g., 'Apple Q1 Fiscal Year 2025 Earnings Call Summary', 'Key Highlights') and structured paragraphs. Under no circumstances use Markdown symbols such as asterisks (*) or dashes (-) for bullet points or emphasis—use plain text exclusively. For example, instead of '- Revenue: $124.3 billion' or '**Revenue**', write 'Revenue: $124.3 billion' in plain text.";

export const categoryPrompt = (categories: any) =>
  filterData(`You are an AI assistant specializing in prompt categorization. Analyze the provided prompt and categorize it into one of these categories: ${categories.join(
    ", "
  )}. 
              Return a complete JSON object with: { category: string, companies: string[], ceos?: string[], topic: string }. Also make sure that for companies, return their parent company for example for facebook its Meta, so do the same for all. 
              If no CEOs are mentioned, omit the ceos field. For mixed intents (e.g., summary and comments), use "Mixed Query". Ensure the response is accurate and fully structured without truncation. Example for categories - "CEO Comments": For prompts like "What are Mark Zuckerberg's and Satya Nadella's recent comments about AI?"—focuses on extracting individual or management statements from transcripts.
"Earnings Summary": For prompts like "Summarize Spotify's latest conference call"—focuses on summarizing entire earnings call transcripts.
"Financial Metrics": For prompts like "How many new large deals did ServiceNow sign in the last quarter?"—focuses on specific financial or operational metrics, often combining transcript data and key metrics.
"General Inquiry": A catch-all for broader or less specific queries.
"Mixed Query": For prompts combining multiple intents (e.g., summary + comments).`);

export const summarizeSystemPrompts = () =>
  filterData(`You are a financial analyst tasked with providing concise, accurate summaries of earnings calls
 or financial metrics.
 
 For Earnings calls : Provide a complete summary of the earnings call or financial data, ensuring all key points are included without truncation. 
 Ensure the summary is complete, capturing all key points without omitting critical
  details, and avoid cutting off mid-sentence.   ${prettifyPrompt} 
  `);

export const summarizeUserPrompts = (prompt : string, transcript : Transcript) => filterData(`${prompt}\n\nData to summarize:\n${transcript.content}\n\nPlease provide a full summary of the provided data, ensuring all relevant information is included without truncation.
${lastResortPrompt()}
    `);  

export const extractCommentsSystemPrompt = () =>
  filterData(
    `You are a financial analyst skilled at extracting specific comments from financial data. Ensure all relevant comments about the topic are included comprehensively, without cutting off mid-response, and provide a complete extraction. and ${prettifyPrompt}`
  );

export const financialMetricsPrompt = (combinedContent: any, prompt: string) =>
  filterData(
    `This is the question asked by user - ${prompt}, Focus on giving the answer the user want by analyzing all the following data  - ${combinedContent}, ${lastResortPrompt()}, also give metrics in a table form in a well structured manner while giving the answer.`
  );

export const extractCommentsUserPrompt = (
  prompt: string,
  topic: string,
  combinedContent: any
) =>
  filterData(
    `This is the question asked by user ${prompt}. Extract all comments related to "${topic}" and the question from user from the following data ${combinedContent}.\n\n ${lastResortPrompt()}. \n\n Ensure the response is complete, capturing every relevant statement without omission and try to summarize things as well, don't just return the raw text:\n\n`
  );

const lastResortPrompt = () => "If you can't find the answer from the data I provided or if data is not available or if you see that provided data does not contain specific information, then search on your own and give me best and accurate answer possible. But always try to find an answer using the provided data first and then try on your own, and in answer don't write that provided data does not contain specific information."

const filterData = (data: string) => data.replaceAll("`", "").trim();


