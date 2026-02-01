import { basicNormalize } from "./normalizers/basicNormalizer";
import { CharNGramTFIDF } from "./vectorizers/charNGramTfidf";

export class SimilarityBuilder {
  private text: string;
  private vectorizer: CharNGramTFIDF | null = null;

  constructor(text: string) {
    this.text = text;
  }

  normalize() {
    this.text = basicNormalize(this.text);
    return this;
  }

  charNGramTFIDF(n: number) {
    this.vectorizer = new CharNGramTFIDF(n);
    this.vectorizer.add(this.text);
    return this;
  }

  compare(otherText: string): number {
    if (!this.vectorizer) {
      throw new Error("No vectorizer selected");
    }

    const normalized = basicNormalize(otherText);
    this.vectorizer.add(normalized);

    return this.vectorizer.similarity(0, 1);
  }
}
