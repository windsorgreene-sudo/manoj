// A tiny, dependency-free syntax highlighter for code samples.
// It highlights per-line (so it composes with line numbers) and only handles
// the common token classes: comments, strings, numbers and keywords.
// Deliberately minimal — avoids shipping a heavy highlighting library.

const KEYWORDS: Record<string, string[]> = {
  python: [
    "def", "return", "if", "elif", "else", "for", "while", "in", "import",
    "from", "as", "class", "try", "except", "finally", "with", "lambda",
    "None", "True", "False", "and", "or", "not", "print", "range", "pass", "break", "continue",
  ],
  java: [
    "public", "private", "protected", "class", "interface", "extends", "implements",
    "void", "int", "double", "float", "boolean", "char", "long", "short", "String",
    "static", "final", "new", "return", "if", "else", "for", "while", "try", "catch",
    "finally", "throw", "throws", "import", "package", "this", "super", "null", "true", "false",
  ],
  cpp: [
    "int", "double", "float", "char", "bool", "void", "class", "struct", "public",
    "private", "protected", "return", "if", "else", "for", "while", "new", "delete",
    "const", "using", "namespace", "include", "cout", "cin", "endl", "std", "true", "false", "nullptr",
  ],
  c: [
    "int", "double", "float", "char", "void", "struct", "return", "if", "else",
    "for", "while", "const", "sizeof", "printf", "scanf", "NULL", "typedef",
  ],
  csharp: [
    "public", "private", "protected", "class", "interface", "void", "int", "double",
    "string", "bool", "static", "readonly", "new", "return", "if", "else", "for",
    "foreach", "while", "try", "catch", "finally", "using", "namespace", "var", "null", "true", "false",
  ],
  sql: [
    "SELECT", "FROM", "WHERE", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "JOIN",
    "ON", "GROUP", "BY", "ORDER", "HAVING", "INSERT", "INTO", "VALUES", "UPDATE",
    "SET", "DELETE", "CREATE", "TABLE", "AND", "OR", "AS", "DISTINCT", "COUNT",
  ],
};

const COMMENT: Record<string, RegExp> = {
  python: /(#.*)$/,
  java: /(\/\/.*)$/,
  cpp: /(\/\/.*|#\s*include.*)$/,
  c: /(\/\/.*)$/,
  csharp: /(\/\/.*)$/,
  sql: /(--.*)$/,
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const C_KW = "#e0b87a"; // keyword
const C_STR = "#9ecb8a"; // string
const C_NUM = "#d19a9a"; // number
const C_COM = "#6c7686"; // comment

export function highlight(line: string, lang: string): string {
  let src = escapeHtml(line);
  const placeholders: string[] = [];
  const stash = (html: string) => {
    placeholders.push(html);
    return `\u0000${placeholders.length - 1}\u0000`;
  };

  // Ordered pass: comments, then strings, numbers and keywords. Each matched
  // token is stashed as a placeholder so later passes never touch its markup.
  const commentRe = COMMENT[lang];
  if (commentRe) {
    src = src.replace(commentRe, (m) => stash(`<span style="color:${C_COM}">${m}</span>`));
  }
  // strings
  src = src.replace(/(".*?"|'.*?')/g, (m) => stash(`<span style="color:${C_STR}">${m}</span>`));
  // numbers
  src = src.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => stash(`<span style="color:${C_NUM}">${m}</span>`));
  // keywords
  const kws = KEYWORDS[lang];
  if (kws) {
    const re = new RegExp(`\\b(${kws.join("|")})\\b`, lang === "sql" ? "gi" : "g");
    src = src.replace(re, (m) => stash(`<span style="color:${C_KW}">${m}</span>`));
  }

  // Restore placeholders.
  src = src.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[Number(i)]);
  return src;
}
