/** pdf-lib standard fonts only support WinAnsi; normalise common Unicode and drop the rest. */
export function winAnsi(s: string) {
  return s
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[, -]/g, "-")
    .replace(/…/g, "...")
    .replace(/[→]/g, "->")
    .replace(/[≤]/g, "<=")
    .replace(/[≥]/g, ">=")
    .replace(/[²]/g, "^2")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");
}

export function wrap(text: string, maxChars: number) {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      if ((line + " " + word).trim().length > maxChars) {
        if (line) lines.push(line);
        line = word;
      } else line = (line + " " + word).trim();
    }
    lines.push(line);
  }
  return lines;
}
