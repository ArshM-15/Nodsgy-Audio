import { parseOfficeAsync } from "officeparser";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { chdir } from "process";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

let numOfChunks;

export async function POST(req) {
  try {
    // Save the original working directory
    const originalCwd = process.cwd();

    // Change the working directory to /tmp, where AWS Lambda allows write access
    chdir("/tmp");

    const tempDir = path.join(process.cwd(), "officeParserTemp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded." }), {
        status: 400,
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the file within the /tmp directory
    const extractedData = await parseOfficeAsync(buffer);
    const text = extractedData.toString();
    console.log(text);

    // Revert to the original working directory after parsing
    chdir(originalCwd);

    await checkNumOfChunks(text);
    if (numOfChunks < 3 || numOfChunks > 5) {
      numOfChunks = 5;
    }
    console.log("Number of chunks", numOfChunks);

    const textChunks = splitTextIntoChunks(text, numOfChunks);
    console.log("text chunks", textChunks);

    const subtopicsPromises = textChunks.map((chunk) =>
      generateSubtopic(chunk)
    );
    const subtopics = await Promise.all(subtopicsPromises);
    console.log("text subtopics", subtopics);

    return new Response(
      JSON.stringify({
        success: true,
        titles: subtopics,
        chunks: textChunks,
        numOfChunks: numOfChunks,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating audio titles:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

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

  const returnedNumOfChunks = completion.choices[0].message.content.trim();
  console.log("Number of chunks", returnedNumOfChunks);
  numOfChunks = returnedNumOfChunks;
}

function splitTextIntoChunks(text, numOfChunks) {
  const lines = text.split("\n");
  const chunkSize = Math.ceil(lines.length / numOfChunks);
  const chunks = [];

  for (let i = 0; i < numOfChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = lines.slice(start, end).join("\n");
    chunks.push(chunk);
  }

  return chunks;
}

async function generateSubtopic(textChunk) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Generate a title from the following content. The title should summarize the key concept in this section of the content. Focus only on teachable concepts and nothing else. There shouldn't be any unnecessary special characters in the title.",
      },
      { role: "user", content: textChunk },
    ],
  });

  const subtopicResponse = completion.choices[0].message.content.trim();
  return subtopicResponse;
}
