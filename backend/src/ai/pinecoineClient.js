import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = "scam-detector";
export const PINECONE_NAMESPACE = "scam-detector-seed";

let indexInstance;

export const initPinecone = async () => {
  const existingIndexes = await pc.listIndexes();

  const exists = existingIndexes.indexes?.some((i) => i.name === indexName);

  if (!exists) {
    console.log("Creating Pinecone index...");

    await pc.createIndex({
      name: indexName,
      dimension: 384, // ⚠️ must match embedding size
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    console.log("✅ Index created");
  } else {
    console.log("✅ Index already exists");
  }

  if (!indexInstance) {
    indexInstance = pc.index(indexName);
  }

  return indexInstance;
};

export const getPineconeClient = () => pc;
