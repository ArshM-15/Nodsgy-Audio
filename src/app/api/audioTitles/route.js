import { parseOfficeAsync } from "officeparser";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { chdir } from "process";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let numOfChunks;

export async function POST(req) {
  try {
    // Save the original working directory
    const originalCwd = process.cwd();

    // Change to the /tmp directory
    chdir("/tmp");

    const tempDir = path.join(process.cwd(), "officeParserTemp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Parse form data
    const formData = await req.formData();
    const inputValue = formData.get("inputValue");
    const file = formData.get("file");

    // Case 1: Input text provided
    if (inputValue) {
      const subtopic = await generateSubtopic(inputValue);

      return new Response(
        JSON.stringify({
          success: true,
          titles: [subtopic], // Single title for input
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Case 2: File uploaded
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse file and extract text
      const extractedData = await parseOfficeAsync(buffer);
      const text = extractedData.toString();

      // Return to the original working directory
      chdir(originalCwd);

      // Determine the number of chunks
      await checkNumOfChunks(text);
      if (numOfChunks < 3 || numOfChunks > 5) numOfChunks = 5;

      const textChunks = splitTextIntoChunks(text, numOfChunks);
      const subtopicsPromises = textChunks.map((chunk) =>
        generateSubtopic(chunk)
      );
      const subtopics = await Promise.all(subtopicsPromises);

      return new Response(
        JSON.stringify({
          success: true,
          titles: subtopics, // Multiple titles for file
          chunks: textChunks,
          numOfChunks,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Error: No valid input
    return new Response(JSON.stringify({ error: "No input provided." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating titles:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to determine the number of chunks
async function checkNumOfChunks(text) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "I want to break down the text into 3 to 5 pieces for teaching purposes. How many pieces should this text be broken down into. Just give me a number between 3 and 5. Just a number.",
      },
      { role: "user", content: text },
    ],
  });

  numOfChunks = parseInt(completion.choices[0].message.content.trim(), 10);
}

// Helper function to split text into chunks
function splitTextIntoChunks(text, numOfChunks) {
  const lines = text.split("\n");
  const chunkSize = Math.ceil(lines.length / numOfChunks);
  const chunks = [];

  for (let i = 0; i < numOfChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    chunks.push(lines.slice(start, end).join("\n"));
  }

  return chunks;
}

// Helper function to generate a title for a text chunk
async function generateSubtopic(textChunk) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Generate a title from the following content. The title should summarize the key concept in this section of the content. Focus only on teachable concepts and nothing else. There shouldn't be any unnecessary special characters in the title. Also don't overuse the word understanding. Only use it when it really matters.",
      },
      { role: "user", content: textChunk },
    ],
  });

  return completion.choices[0].message.content.trim();
}
