import { initPinecone, PINECONE_NAMESPACE } from "./pinecoineClient.js";
import { embedText } from "./embed.js";

const SCAM_SEED_DATA = [
  {
    id: "seed-1",
    text: "You won $1,000 - click here to claim your prize now.",
    label: "scam",
  },
  {
    id: "seed-2",
    text: "Your bank account is blocked. Verify your login immediately.",
    label: "scam",
  },
  {
    id: "seed-3",
    text: "Urgent IRS notice - pay now to avoid legal action.",
    label: "scam",
  },
  {
    id: "seed-4",
    text: "Free iPhone 15 limited offer. Act fast and submit your details.",
    label: "scam",
  },
];

const toVector = (embedding) => {
  if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
    return embedding[0];
  }
  return embedding;
};

export const findSimilarScams = async (message, topK = 3) => {
  if (!message || typeof message !== "string" || !message.trim()) {
    return [];
  }

  const index = await initPinecone();
  const embedding = await embedText(message.trim());
  const vector = toVector(embedding);

  if (!Array.isArray(vector) || vector.length === 0) {
    return [];
  }

  const queryResult = await index.query({
    namespace: PINECONE_NAMESPACE,
    vector,
    topK,
    includeMetadata: true,
  });

  const matches = queryResult?.matches || [];

  return matches
    .filter((match) => match?.metadata?.text)
    .map((match) => ({
      text: match.metadata.text,
      label: match.metadata.label || "unknown",
      score: Number(match.score || 0),
    }));
};

export const storeScams = async (scams = SCAM_SEED_DATA) => {
  const index = await initPinecone();
  const stats = await index.describeIndexStats();

  const existingCount =
    stats?.namespaces?.[PINECONE_NAMESPACE]?.recordCount || 0;

  if (existingCount > 0) {
    console.log(
      `✅ Pinecone already has ${existingCount} vectors in namespace '${PINECONE_NAMESPACE}'. Skipping seed.`,
    );
    return {
      seeded: false,
      count: existingCount,
    };
  }

  const vectors = [];

  for (let i = 0; i < scams.length; i++) {
    const embedding = await embedText(scams[i].text);
    const values = toVector(embedding);

    if (!Array.isArray(values) || values.length === 0) {
      throw new Error(
        `Invalid embedding generated for seed ${scams[i].id || i}`,
      );
    }

    vectors.push({
      id: scams[i].id || `scam-${i}`,
      values,
      metadata: {
        text: scams[i].text,
        label: scams[i].label,
      },
    });
  }

  await index.upsert({
    namespace: PINECONE_NAMESPACE,
    records: vectors,
  });
  console.log(`✅ Seeded ${vectors.length} vectors into Pinecone.`);

  return {
    seeded: true,
    count: vectors.length,
  };
};

export const ensureScamEmbeddings = async () => {
  return storeScams();
};
