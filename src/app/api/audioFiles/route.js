import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, fileStorage } from "../../firebase/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let numOfChunks;
export async function POST(req) {
  try {
    const body = await req.json();
    const { titles, customId, chunks } = body;
    numOfChunks = chunks.length;

    if (!titles || titles.length === 0) {
      return new Response(JSON.stringify({ error: "No titles provided." }), {
        status: 400,
      });
    }

    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for (let i = 0; i < chunks.length; i++) {
            await createAudioForSubtopic(
              chunks[i],
              titles[i],
              customId,
              controller,
              i
            );
          }
        } catch (error) {
          controller.error(error);
        }
        controller.close();
      },
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error("Error creating audio files:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

async function createAudioForSubtopic(
  chunk,
  title,
  customId,
  controller,
  index
) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Provide a detailed explanation of the following as clearly as you possibly can and use simple words. Use information from the text itself as much as possible to explain the concept. Talk like how a human talks, use human-like words, and add a few extra commas. No need to create an opening sentence, just dive straight into the topic. ${
            index === numOfChunks - 1
              ? "If there is anyhting else important in the text, like something that is upcoming, remind that."
              : ""
          } The explanation must be between 200-400 words.`,
        },
        { role: "user", content: chunk },
      ],
    });

    const subtopicText = completion.choices[0].message.content;

    await createKeyPoints(subtopicText, title, customId, controller, index);

    controller.enqueue(
      `data: ${JSON.stringify({ success: true, message: chunk })}\n\n`
    );
  } catch (error) {
    console.error("Error creating audio for subtopic:", error);
    controller.enqueue(
      `data: ${JSON.stringify({ error: "Error during audio creation." })}\n\n`
    );
  }
}

async function createKeyPoints(
  writtenResponse,
  title,
  customId,
  controller,
  index
) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Give 4 to 7 key points regarding the text. Each point should be short and specifc. It shouldn't have any unnecessary special characters and each key point should begin with a '->'. ${
            index === numOfChunks - 1
              ? "If there is anyhting else important in the text, like something that is upcoming, remind that at the last key point."
              : ""
          } Don't add unnecessary points if you don't need them, try to use as less as possible(min 4 max 7).`,
        },
        { role: "user", content: writtenResponse },
      ],
    });

    const keyPoints = completion.choices[0].message.content;

    await textToSpeech(writtenResponse, title, customId, keyPoints);

    controller.enqueue(
      `data: ${JSON.stringify({ success: true, message: writtenResponse })}\n\n`
    );
  } catch (error) {
    console.error("Error creating audio for subtopic:", error);
    controller.enqueue(
      `data: ${JSON.stringify({ error: "Error during audio creation." })}\n\n`
    );
  }
}

async function textToSpeech(writtenResponse, title, customId, keyPoints) {
  try {
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: writtenResponse,
    });

    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    const audioRef = ref(fileStorage, `audioFiles/${title}_${customId}.mp3`);
    await uploadBytes(audioRef, buffer);

    const downloadURL = await getDownloadURL(audioRef);

    const customDocId = `${customId}_${title}`;
    const docRef = doc(collection(db, "audioFiles"));
    await setDoc(docRef, {
      name: customDocId,
      url: downloadURL,
      keyPoints: keyPoints,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error converting text to speech or uploading audio:", error);
  }
}
//asdads
