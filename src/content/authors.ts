import type { Author } from "./types";

export const authors: Author[] = [
  {
    id: "manoj-purohit",
    name: "Manoj Purohit",
    role: "Editor & Faculty, Computer Science",
  },
  {
    id: "editorial",
    name: "CodeVidya Editorial",
    role: "Reviewed by the CodeVidya team",
  },
];

export function getAuthor(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}
