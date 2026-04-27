import dotenv from "dotenv";
import client from "./hfclient.js";

dotenv.config();

const HF_MODEL = "Qwen/Qwen2.5-7B-Instruct";

export const callHuggingFace = async (prompt) => {
  try {
    const response = await client.chatCompletion({
      provider: "auto",
      model: HF_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.2,
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) {
      const error = new Error("Hugging Face returned an empty response.");
      error.statusCode = 502;
      throw error;
    }

    return content;
  } catch (err) {
    console.error("Error calling Hugging Face API:", err);
    const providerStatus = err?.httpResponse?.status;
    const providerError = err?.httpResponse?.body?.error;
    const providerMessage =
      (typeof providerError === "string" && providerError) ||
      providerError?.message ||
      err?.message ||
      "Hugging Face inference request failed.";

    console.error("Hugging Face API error:", providerError);

    const error = new Error(`Hugging Face error: ${providerMessage}`);
    error.statusCode = providerStatus || 502;
    error.details = {
      provider: "huggingface",
      model: HF_MODEL,
      status: providerStatus || null,
      requestId: err?.httpResponse?.requestId || null,
    };
    throw error;
  }
};
