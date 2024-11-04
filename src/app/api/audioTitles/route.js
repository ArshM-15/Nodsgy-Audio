import { parseOfficeAsync } from "officeparser";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
let numOfChunks;
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded." }), {
        status: 400,
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extractedData = await parseOfficeAsync(buffer);
    const text = extractedData.toString();
    console.log(text);

    await checkNumOfChunks(text);
    if (numOfChunks < 3 || numOfChunks > 5) {
      numOfChunks = 5;
    }
    console.log("Number of chunksssss", numOfChunks);

    const textChunks = splitTextIntoChunks(text, numOfChunks);
    console.log("text chunjs", textChunks);

    const subtopicsPromises = textChunks.map((chunk) =>
      generateSubtopic(chunk)
    );
    const subtopics = await Promise.all(subtopicsPromises);
    console.log("text chunjsss", textChunks);

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
  // return returnedNumOfChunks;
}

// Function to split text into equal parts
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

// Function to generate a subtopic from a text chunk
async function generateSubtopic(textChunk) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Generate a title from the following content. The title should summarize the key concept in this section of the content. Focus only on teachable concepts and nothing else. There shouldn't be any unnecessary special charecters in the title.",
      },
      { role: "user", content: textChunk },
    ],
  });

  const subtopicResponse = completion.choices[0].message.content.trim();
  return subtopicResponse;
}
