export const LANGUAGES = ["CPP", "JAVA", "PYTHON", "JAVASCRIPT", "C", "GO"] as const;
export type LanguageKey = (typeof LANGUAGES)[number];
export const RUNNABLE: readonly LanguageKey[] = LANGUAGES;

export const LANGUAGE_META: Record<LanguageKey, { label: string; monaco: string; judge0Id: number; ext: string; shiki: string }> = {
  CPP: { label: "C++", monaco: "cpp", judge0Id: 54, ext: "cpp", shiki: "cpp" },
  JAVA: { label: "Java", monaco: "java", judge0Id: 62, ext: "java", shiki: "java" },
  PYTHON: { label: "Python", monaco: "python", judge0Id: 71, ext: "py", shiki: "python" },
  JAVASCRIPT: { label: "JavaScript", monaco: "javascript", judge0Id: 63, ext: "js", shiki: "javascript" },
  C: { label: "C", monaco: "c", judge0Id: 50, ext: "c", shiki: "c" },
  GO: { label: "Go", monaco: "go", judge0Id: 60, ext: "go", shiki: "go" },
};

export function toLanguage(lang: string): LanguageKey | null {
  const l = lang.toLowerCase();
  const map: Record<string, LanguageKey> = { cpp: "CPP", "c++": "CPP", java: "JAVA", python: "PYTHON", py: "PYTHON", javascript: "JAVASCRIPT", js: "JAVASCRIPT", c: "C", go: "GO" };
  return map[l] ?? null;
}

export const HELLO_WORLD: Record<LanguageKey, string> = {
  CPP: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string name;\n    getline(cin, name);\n    cout << "Hello, " << (name.empty() ? "Kodshala" : name) << "!" << endl;\n    return 0;\n}\n',
  JAVA: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.hasNextLine() ? sc.nextLine() : "Kodshala";\n        System.out.println("Hello, " + name + "!");\n    }\n}\n',
  PYTHON: 'import sys\n\nname = sys.stdin.readline().strip()\nprint(f"Hello, {name or \'Kodshala\'}!")\n',
  JAVASCRIPT: 'const input = require("fs").readFileSync(0, "utf8").trim();\nconsole.log(`Hello, ${input || "Kodshala"}!`);\n',
  C: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char name[100] = "Kodshala";\n    if (fgets(name, sizeof name, stdin)) name[strcspn(name, "\\n")] = 0;\n    printf("Hello, %s!\\n", name);\n    return 0;\n}\n',
  GO: 'package main\n\nimport (\n\t"bufio"\n\t"fmt"\n\t"os"\n\t"strings"\n)\n\nfunc main() {\n\treader := bufio.NewReader(os.Stdin)\n\tname, _ := reader.ReadString(\'\\n\')\n\tname = strings.TrimSpace(name)\n\tif name == "" {\n\t\tname = "Kodshala"\n\t}\n\tfmt.Printf("Hello, %s!\\n", name)\n}\n',
};
