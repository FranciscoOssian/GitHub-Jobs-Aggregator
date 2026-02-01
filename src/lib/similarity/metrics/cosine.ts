export function cosineSimilarity(
  a: Map<string, number>,
  b: Map<string, number>
): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const [k, v] of a) {
    normA += v * v;
    if (b.has(k)) {
      dot += v * (b.get(k) as number);
    }
  }

  for (const v of b.values()) {
    normB += v * v;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}
