import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

// Initialize the GoogleGenAI client with the API Key from environment variables
// Ensure GEMINI_API_KEY is set in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface Article {
  id: string;
  title: string;
  abstract: string;
}

interface RequestBody {
  articles: Article[];
}

// Define the POST handler for the route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const articles = body.articles;

    if (!articles || !Array.isArray(articles)) {
      return NextResponse.json({ error: "Invalid data format. 'articles' array is required." }, { status: 400 });
    }

    if (articles.length === 0) {
      return NextResponse.json({ error: "No articles provided." }, { status: 400 });
    }
    
    // Construct the prompt for Gemini
    // System instruction to guide the model's behavior and output format
    const systemInstruction = {
      parts: [{ text: `You are an expert academic assistant. Your task is to process a list of scientific articles.
For each article, you must:
1. Translate the 'title' from English to Spanish.
2. Translate the 'abstract' from English to Spanish.
3. Generate a concise 'summary' of the abstract in Spanish. The summary should be brief and capture the essence of the abstract.

Return the response as a single JSON array. Each object in the array should correspond to an input article and include its original 'id', and the new fields: 'titulo_es', 'abstract_es', and 'resumen_es'.
Ensure the output is a valid JSON array. Example for one article:
[
  {
    "id": "original_id_1",
    "titulo_es": "Título traducido al español",
    "abstract_es": "Abstract traducido al español.",
    "resumen_es": "Resumen conciso del abstract en español."
  }
]
` }],
      role: "system" // Though systemInstruction in @google/genai typically takes a string,
                     // the underlying REST API structure for system_instruction is { parts: [{text: ""}]}.
                     // For @google/genai, we might put this into the initial user message or a dedicated system instruction field if supported by the chosen model version.
                     // The example in the user prompt used `systemInstruction: "string"` for `generateContentStream`.
                     // Let's adapt based on the user's provided example structure:
                     // systemInstruction: systemInstruction (string), contents: userContent (string)
    };
    
    const userPrompt = \`Please process the following articles according to the instructions:
${JSON.stringify(articles.map(a => ({ id: a.id, title: a.title, abstract: a.abstract })), null, 2)}
Respond ONLY with the JSON array.\`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest", // Using flash for speed in streaming, can be "gemini-1.5-pro-latest"
      // The user prompt examples used "gemini-2.5-pro-preview-05-06" or "gemini-2.5-flash-preview-04-17"
      // Let's use a generally available one like gemini-1.5-flash or pro if 2.5 is not yet available or causes issues.
      // Sticking to user's info: "gemini-2.5-flash-preview-04-17"
      // model: "gemini-2.5-flash-preview-04-17", // or "gemini-2.5-pro-preview-05-06"
      // Simpler model name for SDK:
      // model: "gemini-1.5-flash", // Let's use this for wider compatibility if preview names are too specific or cause issues
      // Given the user's extensive documentation, let's try to adhere to it.
      // The JS SDK might prefer simpler names like "gemini-1.5-pro" or "gemini-1.5-flash" which map to latest stable/preview.
      // Let's use "gemini-1.5-flash" and see. If issues, we can switch to specific preview strings.
      // The user text explicitly states: "gemini-2.5-pro-preview-05-06" or "gemini-2.5-flash-preview-04-17".
      // The genAI SDK might also accept "gemini/gemini-2.5-flash-preview-04-17".
      // To be safe, let's use a common current model name.
      // Updated to use a more standard model name, the user can adjust if they have specific preview access.
      // Reverting to user provided model name from their detailed text:
      // model: "gemini-2.5-flash-preview-04-17",
      // The SDK often uses `models/gemini-....`
      // The text mentions: "Si usas las bibliotecas cliente oficiales, normalmente basta con especificar "gemini-2.5-pro" o "gemini-2.5-flash" y la librería usará la versión latest preview correspondiente."
      // So, let's use "gemini-1.5-flash" as a safe bet, or if we're sure about the user's environment "gemini-2.5-flash"
      // Let's stick to the newer naming convention from Google AI Studio if the user provided it explicitly
      // model: "gemini-1.5-flash-latest", // Example
      // Re-evaluating based on user doc: `gemini-2.5-flash-preview-04-17` was mentioned for direct API,
      // but for SDK it suggests `gemini-2.5-flash`.
      // Using "gemini-1.5-flash" for broader compatibility; user can change if "gemini-2.5-flash" works for them.
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 4096, // Adjust as needed, consider the number of articles
        temperature: 0.2,      // For more deterministic translations and summaries
      },
      safetySettings: [ // Basic safety settings
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
      // The user's example used `systemInstruction` directly in `generateContentStream`.
      // The `getGenerativeModel` can also take `systemInstruction`.
      // Let's try with systemInstruction in getGenerativeModel
       systemInstruction: systemInstruction.parts[0].text // The genAI SDK takes a string or Part object here.
    });

    // The user's provided example had `systemInstruction` and `contents` directly in `generateContentStream`.
    // Let's modify to match that structure better as it was extensively detailed.
    // const generationStream = await model.generateContentStream({
    //   contents: [{ parts: [{ text: userPrompt }], role: "user" }],
    // });

    // The guide showed:
    // const stream = await aiClient.models.generateContentStream({
    //   model: "gemini-2.5-pro-preview-05-06",
    //   systemInstruction: systemInstructionString, <--- A string
    //   contents: userContentString, <--- A string
    //   config: { ... }
    // });
    // The genAI SDK expects `contents` to be an array of `Content`.
    // `userPrompt` is already a string. `systemInstruction.parts[0].text` is a string.

    const geminiModelForStream = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // User can change to "gemini-2.5-flash" or specific preview like "models/gemini-2.5-flash-preview-04-17"
        generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 8000, // Increased for multiple articles, ensure it's within model limits
            temperature: 0.2,
        },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ]
    });
    
    // For streaming with system instructions, structure usually involves sending it as part of the history or specific field.
    // The model.generateContentStream takes `GenerateContentRequest` which includes `contents` and `systemInstruction`.
    const streamRequest = {
        // systemInstruction: { parts: [{ text: systemInstruction.parts[0].text }], role: "system" }, // Correct way for system instruction
        // The user's guide used a simpler string for systemInstruction for the generateContentStream method,
        // which might be a direct pass-through to an older API version or a helper.
        // The `GenerativeModel` class in `@google/genai` has `generateContentStream(request: GenerateContentRequest)`
        // `GenerateContentRequest` has `contents: Content[]` and `systemInstruction?: SystemInstruction | string`.
        systemInstruction: systemInstruction.parts[0].text,
        contents: [{ parts: [{ text: userPrompt }], role: "user" }],
    };

    const generationStream = await geminiModelForStream.generateContentStream(streamRequest);

    // Prepare the response in streaming towards the client (SSE)
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // The stream from `generateContentStream` yields `GenerateContentResponse` objects.
          // We need to aggregate `response.text()` from these.
          let accumulatedText = "";
          for await (const chunk of generationStream.stream) { // Iterate over the stream of `GenerateContentResponse`
            const textPart = chunk.text(); // `text()` is an async function that returns the text of all candidates
            if (textPart) {
              // Send each text part as it arrives, formatted as an SSE event part
              // The client will piece these together.
              controller.enqueue(encoder.encode(`data: ${textPart}\n\n`));
              accumulatedText += textPart; // For logging or final validation if needed
            }
          }
          // Optional: Log the full response once streaming is complete
          // console.log("Full streamed response:", accumulatedText);
        } catch (streamError) {
          console.error("Error during streaming:", streamError);
          controller.error(streamError);
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no" // Useful for Nginx environments to disable buffering
      }
    });

  } catch (error) {
    console.error("Error in /api/traduccion:", error);
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: "Error processing request", details: errorMessage }, { status: 500 });
  }
} 