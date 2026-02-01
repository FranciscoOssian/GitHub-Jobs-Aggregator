import natural from "natural";
import { cosineSimilarity } from "../metrics/cosine";

export class CharNGramTFIDF {
  private tfidf = new natural.TfIdf();
  private vectors: Map<string, number>[] = [];
  private n: number;

  constructor(n: number) {
    this.n = n;
  }

  private charNGrams(text: string): string[] {
    const grams: string[] = [];
    for (let i = 0; i <= text.length - this.n; i++) {
      grams.push(text.slice(i, i + this.n));
    }
    return grams;
  }

  add(text: string) {
    const grams = this.charNGrams(text);
    this.tfidf.addDocument(grams);
    this.vectors.push(this.buildVector(this.vectors.length));
  }

  private buildVector(docIndex: number): Map<string, number> {
    const vec = new Map<string, number>();
    this.tfidf.listTerms(docIndex).forEach(t => {
      vec.set(t.term, t.tfidf);
    });
    return vec;
  }

  similarity(i: number, j: number): number {
    return cosineSimilarity(this.vectors[i], this.vectors[j]);
  }
}
