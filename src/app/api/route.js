import { parseOfficeAsync } from "officeparser";

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

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error extracting text:", error);
    return new Response(JSON.stringify({ error: "Failed to extract text." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
