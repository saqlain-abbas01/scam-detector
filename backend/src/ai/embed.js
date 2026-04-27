import hf from "./hfclient.js";

export const embedText = async (text) => {
  try {
    const output = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    return output; // already a vector
  } catch (err) {
    const providerStatus = err?.httpResponse?.status || null;
    const providerError = err?.httpResponse?.body?.error;
    const providerMessage =
      (typeof providerError === "string" && providerError) ||
      providerError?.message ||
      err?.message ||
      "Failed to create embedding.";

    const error = new Error(`Embedding error: ${providerMessage}`);
    error.statusCode = providerStatus || 502;
    throw error;
  }
};
