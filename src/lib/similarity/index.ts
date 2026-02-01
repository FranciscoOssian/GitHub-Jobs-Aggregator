import { SimilarityBuilder } from "./SimilarityBuilder";

export function similarity(text: string) {
  return new SimilarityBuilder(text);
}
