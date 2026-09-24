// A tiny, dependency-free syntax highlighter for code samples.
// It highlights per-line (so it composes with line numbers) and only handles
// the common token classes: comments, strings, numbers and keywords.
// Deliberately minimal, avoids shipping a heavy highlighting library.

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

  // Placeholder token must NOT contain characters that any later pass can
  // match. Earlier versions used digits (\u0000{index}\u0000), so the numbers
  // pass matched the index digit inside a string/comment placeholder and
  // corrupted it — that was the "printf(0)" / stray-"0" bug. We encode the
  // index in a non-word, non-digit private-use band instead.
  const OPEN = "\uE000";
  const CLOSE = "\uE001";
  const encodeIndex = (n: number) =>
    // map each digit to a private-use code point outside \w and \d
    String(n)
      .split("")
      .map((d) => String.fromCharCode(0xe010 + Number(d)))
      .join("");
  const stash = (html: string) => {
    placeholders.push(html);
    return `${OPEN}${encodeIndex(placeholders.length - 1)}${CLOSE}`;
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

  // Restore placeholders. Decode the private-use index band back to a number.
  const restoreRe = new RegExp(`${OPEN}([\\uE010-\\uE019]+)${CLOSE}`, "g");
  src = src.replace(restoreRe, (_, enc: string) => {
    const idx = Number(
      enc
        .split("")
        .map((ch) => ch.charCodeAt(0) - 0xe010)
        .join(""),
    );
    return placeholders[idx] ?? "";
  });
  return src;
}
