import type { Course } from "./types";

// Seed courses for EduLearn. Content is real and hand-written (no lorem ipsum).
// The flagship courses (HTML, CSS, JavaScript, Python) carry a full first
// chapter with lessons + quizzes; others carry a solid starter chapter.

export const courses: Course[] = [
  // ============================================================= HTML
  {
    slug: "html-fundamentals",
    title: "HTML Fundamentals",
    description: "Build the structure of web pages with semantic, accessible HTML.",
    longDescription:
      "HTML is the language every web page is built with. In this course you will learn how to structure content, use semantic elements, build forms, and write markup that is accessible and search-engine friendly.",
    icon: "🌐",
    color: "#e34c26",
    difficulty: "beginner",
    category: "Web Development",
    tags: ["html", "web", "frontend", "markup"],
    chapters: [
      {
        title: "Getting Started",
        lessons: [
          {
            slug: "what-is-html",
            title: "What is HTML?",
            description: "Understand what HTML is and how the browser turns it into a web page.",
            duration: 6,
            codeLanguage: "html",
            codeExample:
              "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello, world!</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "HTML (HyperText Markup Language) describes the structure of a web page.",
                  "It uses tags like <h1> and <p> to mark up content.",
                  "The browser reads HTML and renders it visually.",
                ],
              },
              {
                type: "paragraph",
                text: "HTML stands for HyperText Markup Language. It is the standard language used to create the structure of web pages. Every website you visit is built on a foundation of HTML.",
              },
              {
                type: "paragraph",
                text: "HTML is not a programming language, it is a markup language. Instead of logic and loops, it uses tags to describe what each piece of content is, for example a heading, a paragraph, a link or an image.",
              },
              { type: "heading", level: 2, id: "structure", text: "A basic HTML document" },
              {
                type: "paragraph",
                text: "Every HTML document follows the same basic skeleton. Here is the smallest complete page:",
              },
              {
                type: "code",
                block: {
                  language: "html",
                  code: "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello, world!</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>",
                },
              },
              {
                type: "list",
                items: [
                  "<!DOCTYPE html> tells the browser this is an HTML5 document.",
                  "<html> is the root element that wraps everything.",
                  "<head> holds information about the page, like its title.",
                  "<body> holds everything the visitor actually sees.",
                ],
              },
              {
                type: "note",
                variant: "tip",
                text: "Save your file with a .html extension and open it in any browser to see the result. No installation needed.",
              },
            ],
            quiz: [
              {
                question: "What does HTML stand for?",
                options: [
                  "HyperText Markup Language",
                  "HighText Machine Language",
                  "HyperTool Multi Language",
                  "Home Tool Markup Language",
                ],
                correct: 0,
                explain: "HTML = HyperText Markup Language, the standard for structuring web pages.",
              },
              {
                question: "Which element holds the visible page content?",
                options: ["<head>", "<title>", "<body>", "<meta>"],
                correct: 2,
                explain: "Everything the visitor sees goes inside the <body> element.",
              },
              {
                question: "Is HTML a programming language?",
                options: [
                  "Yes, it has loops and conditions",
                  "No, it is a markup language",
                  "Yes, it compiles to machine code",
                  "No, it is a database language",
                ],
                correct: 1,
                explain: "HTML describes structure with tags; it does not contain program logic.",
              },
            ],
          },
          {
            slug: "html-elements-and-tags",
            title: "Elements and Tags",
            description: "Learn how HTML elements, tags and attributes work together.",
            duration: 7,
            codeLanguage: "html",
            codeExample:
              "<a href=\"https://example.com\" target=\"_blank\">Visit Example</a>\n<img src=\"logo.png\" alt=\"Company logo\" width=\"120\">",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "An element is usually an opening tag, content, and a closing tag.",
                  "Attributes add extra information inside the opening tag.",
                  "Some elements, like <img>, are self-closing.",
                ],
              },
              {
                type: "paragraph",
                text: "An HTML element is made up of a start tag, some content, and an end tag. For example, <p>Hello</p> is a paragraph element where <p> is the start tag and </p> is the end tag.",
              },
              { type: "heading", level: 2, id: "attributes", text: "Attributes" },
              {
                type: "paragraph",
                text: "Attributes provide extra information about an element and always go in the start tag. They come in name=\"value\" pairs.",
              },
              {
                type: "code",
                block: {
                  language: "html",
                  code: "<a href=\"https://example.com\" target=\"_blank\">Visit Example</a>",
                },
              },
              {
                type: "paragraph",
                text: "Here href is the destination URL and target=\"_blank\" opens the link in a new tab.",
              },
              { type: "heading", level: 2, id: "self-closing", text: "Self-closing elements" },
              {
                type: "paragraph",
                text: "Some elements have no content and no closing tag, such as images and line breaks.",
              },
              {
                type: "code",
                block: {
                  language: "html",
                  code: "<img src=\"logo.png\" alt=\"Company logo\" width=\"120\">\n<br>\n<hr>",
                },
              },
              {
                type: "note",
                variant: "warning",
                text: "Always add an alt attribute to images. It describes the image for screen readers and shows if the image fails to load.",
              },
            ],
            quiz: [
              {
                question: "Where do attributes go?",
                options: ["In the closing tag", "In the start tag", "Between tags", "In the <head>"],
                correct: 1,
                explain: "Attributes are written inside the opening (start) tag as name=\"value\" pairs.",
              },
              {
                question: "Which attribute describes an image for accessibility?",
                options: ["src", "title", "alt", "href"],
                correct: 2,
                explain: "The alt attribute provides alternative text for screen readers and broken images.",
              },
            ],
          },
          {
            slug: "headings-and-paragraphs",
            title: "Headings and Paragraphs",
            description: "Structure readable text using headings and paragraphs.",
            duration: 5,
            codeLanguage: "html",
            codeExample:
              "<h1>Main title</h1>\n<h2>Section title</h2>\n<p>A paragraph of text goes here.</p>",
            body: [
              {
                type: "paragraph",
                text: "HTML provides six levels of headings, from <h1> (most important) to <h6> (least important). Use them to create a clear hierarchy on your page.",
              },
              {
                type: "code",
                block: {
                  language: "html",
                  code: "<h1>Main title</h1>\n<h2>Section title</h2>\n<h3>Sub-section</h3>\n<p>A paragraph of body text.</p>",
                },
              },
              {
                type: "note",
                variant: "tip",
                text: "Use only one <h1> per page and do not skip heading levels. This helps both readers and search engines understand your content.",
              },
            ],
            quiz: [
              {
                question: "How many heading levels does HTML provide?",
                options: ["3", "6", "10", "Unlimited"],
                correct: 1,
                explain: "HTML has six heading levels, from <h1> to <h6>.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= CSS
  {
    slug: "css-mastery",
    title: "CSS Mastery",
    description: "Style beautiful, responsive interfaces with modern CSS.",
    longDescription:
      "CSS controls how your HTML looks. This course covers selectors, the box model, Flexbox, Grid, responsive design and modern layout techniques used by professional front-end developers.",
    icon: "🎨",
    color: "#264de4",
    difficulty: "beginner",
    category: "Web Development",
    tags: ["css", "web", "frontend", "styling"],
    chapters: [
      {
        title: "CSS Basics",
        lessons: [
          {
            slug: "what-is-css",
            title: "What is CSS?",
            description: "Learn how CSS styles HTML and the three ways to add it.",
            duration: 6,
            codeLanguage: "html",
            codeExample:
              "<style>\n  p { color: #2563eb; font-size: 18px; }\n</style>\n<p>Styled text</p>",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "CSS (Cascading Style Sheets) controls the look of HTML.",
                  "You can add CSS inline, internal, or in an external file.",
                  "External stylesheets are the recommended approach.",
                ],
              },
              {
                type: "paragraph",
                text: "CSS stands for Cascading Style Sheets. It describes how HTML elements should be displayed: their colors, sizes, spacing, layout and more.",
              },
              { type: "heading", level: 2, id: "adding-css", text: "Three ways to add CSS" },
              {
                type: "code",
                block: {
                  language: "css",
                  code: "/* External file: styles.css */\np {\n  color: #2563eb;\n  font-size: 18px;\n  line-height: 1.6;\n}",
                },
              },
              {
                type: "note",
                variant: "tip",
                text: "Prefer an external stylesheet linked with <link rel=\"stylesheet\" href=\"styles.css\">. It keeps structure (HTML) and style (CSS) cleanly separated.",
              },
            ],
            quiz: [
              {
                question: "What does CSS stand for?",
                options: [
                  "Cascading Style Sheets",
                  "Computer Style System",
                  "Colorful Style Syntax",
                  "Creative Styling Standard",
                ],
                correct: 0,
                explain: "CSS = Cascading Style Sheets.",
              },
              {
                question: "Which is the recommended way to add CSS?",
                options: ["Inline styles", "Internal <style>", "External stylesheet", "In the URL"],
                correct: 2,
                explain: "External stylesheets keep HTML and CSS separate and reusable.",
              },
            ],
          },
          {
            slug: "selectors",
            title: "CSS Selectors",
            description: "Target the right elements with element, class and id selectors.",
            duration: 7,
            codeLanguage: "css",
            codeExample:
              "h1 { color: navy; }\n.button { padding: 12px 20px; }\n#hero { background: #f1f5f9; }",
            body: [
              {
                type: "paragraph",
                text: "Selectors decide which elements your rules apply to. The three most common are element, class and id selectors.",
              },
              {
                type: "table",
                headers: ["Selector", "Targets"],
                rows: [
                  ["h1", "All <h1> elements"],
                  [".button", "All elements with class=\"button\""],
                  ["#hero", "The single element with id=\"hero\""],
                ],
              },
              {
                type: "code",
                block: {
                  language: "css",
                  code: "h1 { color: navy; }\n.button { padding: 12px 20px; border-radius: 8px; }\n#hero { background: #f1f5f9; }",
                },
              },
              {
                type: "note",
                variant: "tip",
                text: "Prefer classes for styling. Ids should be unique per page and are better used for anchors and JavaScript hooks.",
              },
            ],
            quiz: [
              {
                question: "Which symbol targets a class?",
                options: ["#", ".", "@", "*"],
                correct: 1,
                explain: "A dot (.) targets a class; a hash (#) targets an id.",
              },
            ],
          },
          {
            slug: "the-box-model",
            title: "The Box Model",
            description: "Understand content, padding, border and margin.",
            duration: 8,
            codeLanguage: "css",
            codeExample:
              ".card {\n  padding: 16px;\n  border: 1px solid #e2e8f0;\n  margin: 12px;\n}",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "Every element is a box: content, padding, border, margin.",
                  "padding is space inside the border; margin is space outside it.",
                  "box-sizing: border-box makes width include padding and border.",
                ],
              },
              {
                type: "paragraph",
                text: "In CSS, every element is a rectangular box. The box model describes the layers around the content: padding, then border, then margin.",
              },
              {
                type: "code",
                block: {
                  language: "css",
                  code: "* { box-sizing: border-box; }\n\n.card {\n  padding: 16px;   /* space inside */\n  border: 1px solid #e2e8f0;\n  margin: 12px;    /* space outside */\n}",
                },
              },
              {
                type: "note",
                variant: "info",
                text: "Setting box-sizing: border-box on everything is a common best practice: it makes element widths predictable.",
              },
            ],
            quiz: [
              {
                question: "Which property adds space inside the border?",
                options: ["margin", "padding", "gap", "outline"],
                correct: 1,
                explain: "padding is the space between the content and the border (inside).",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= JAVASCRIPT
  {
    slug: "javascript-core",
    title: "JavaScript Core",
    description: "Learn the language that powers interactive websites.",
    longDescription:
      "JavaScript makes web pages interactive. This course covers variables, data types, functions, arrays, objects, the DOM and modern ES6+ features, with runnable examples throughout.",
    icon: "⚡",
    color: "#f7df1e",
    difficulty: "beginner",
    category: "Web Development",
    tags: ["javascript", "js", "web", "frontend", "programming"],
    chapters: [
      {
        title: "JavaScript Basics",
        lessons: [
          {
            slug: "variables-and-types",
            title: "Variables and Data Types",
            description: "Declare variables with let and const and learn the core data types.",
            duration: 8,
            codeLanguage: "javascript",
            codeExample:
              "let name = 'Aarav';\nconst age = 21;\nlet isStudent = true;\nconsole.log(name, age, isStudent);",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "Use const by default; use let only when the value must change.",
                  "Common types: string, number, boolean, null, undefined, object.",
                  "Avoid var in modern JavaScript.",
                ],
              },
              {
                type: "paragraph",
                text: "A variable is a named container for a value. In modern JavaScript you declare variables with const (for values that do not change) or let (for values that do).",
              },
              {
                type: "code",
                block: {
                  language: "javascript",
                  code: "const name = 'Aarav';   // string\nlet age = 21;            // number\nlet isStudent = true;    // boolean\n\nconsole.log(name, age, isStudent);\n// Output: Aarav 21 true",
                },
              },
              { type: "heading", level: 2, id: "types", text: "Core data types" },
              {
                type: "list",
                items: [
                  "string: text, for example 'hello'",
                  "number: integers and decimals, for example 42 or 3.14",
                  "boolean: true or false",
                  "null and undefined: represent 'no value'",
                  "object: collections of key-value pairs",
                ],
              },
              {
                type: "note",
                variant: "warning",
                text: "const does not mean the value is frozen; it means the variable cannot be reassigned. Object contents can still change.",
              },
            ],
            quiz: [
              {
                question: "Which keyword should you use by default?",
                options: ["var", "let", "const", "define"],
                correct: 2,
                explain: "Use const by default and switch to let only when reassignment is needed.",
              },
              {
                question: "What is the type of true?",
                options: ["string", "boolean", "number", "object"],
                correct: 1,
                explain: "true and false are boolean values.",
              },
              {
                question: "Which is NOT a JavaScript data type?",
                options: ["string", "number", "character", "boolean"],
                correct: 2,
                explain: "JavaScript has no separate character type; single characters are just strings.",
              },
            ],
          },
          {
            slug: "functions",
            title: "Functions",
            description: "Write reusable blocks of code with functions and arrow functions.",
            duration: 9,
            codeLanguage: "javascript",
            codeExample:
              "function add(a, b) {\n  return a + b;\n}\nconst square = (n) => n * n;\nconsole.log(add(2, 3), square(4));",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "A function groups code you can reuse by calling its name.",
                  "Functions can take parameters and return a value.",
                  "Arrow functions are a shorter syntax for writing functions.",
                ],
              },
              {
                type: "paragraph",
                text: "A function is a reusable block of code. You define it once and call it as many times as you need. Functions can accept inputs (parameters) and produce an output (a return value).",
              },
              {
                type: "code",
                block: {
                  language: "javascript",
                  code: "function add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(2, 3)); // 5",
                },
              },
              { type: "heading", level: 2, id: "arrow", text: "Arrow functions" },
              {
                type: "code",
                block: {
                  language: "javascript",
                  code: "const square = (n) => n * n;\nconsole.log(square(4)); // 16",
                },
              },
              {
                type: "note",
                variant: "tip",
                text: "If an arrow function just returns a value, you can skip the braces and the return keyword, as shown above.",
              },
            ],
            quiz: [
              {
                question: "What does the return statement do?",
                options: [
                  "Prints to the console",
                  "Sends a value back from the function",
                  "Stops the whole program",
                  "Declares a variable",
                ],
                correct: 1,
                explain: "return sends a value back to wherever the function was called.",
              },
              {
                question: "What does square(4) return for const square = (n) => n * n?",
                options: ["8", "16", "4", "undefined"],
                correct: 1,
                explain: "4 * 4 = 16.",
              },
            ],
          },
          {
            slug: "arrays",
            title: "Arrays",
            description: "Store lists of values and loop over them.",
            duration: 8,
            codeLanguage: "javascript",
            codeExample:
              "const fruits = ['apple', 'banana', 'cherry'];\nfruits.push('date');\nfruits.forEach((f) => console.log(f));",
            body: [
              {
                type: "paragraph",
                text: "An array is an ordered list of values. You create one with square brackets and access items by their index, starting at 0.",
              },
              {
                type: "code",
                block: {
                  language: "javascript",
                  code: "const fruits = ['apple', 'banana', 'cherry'];\nconsole.log(fruits[0]); // apple\nconsole.log(fruits.length); // 3\n\nfruits.push('date'); // add to the end\nfruits.forEach((f) => console.log(f));",
                },
              },
              {
                type: "note",
                variant: "info",
                text: "Array indexes start at 0, so the first item is fruits[0] and the last is fruits[fruits.length - 1].",
              },
            ],
            quiz: [
              {
                question: "What is the index of the first array element?",
                options: ["1", "0", "-1", "It depends"],
                correct: 1,
                explain: "Arrays are zero-indexed: the first element is at index 0.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= PYTHON
  {
    slug: "python-for-beginners",
    title: "Python for Beginners",
    description: "Start programming with one of the most readable languages.",
    longDescription:
      "Python is a beginner-friendly language used in web development, data science, automation and AI. This course covers variables, data types, control flow, functions and data structures with runnable examples.",
    icon: "🐍",
    color: "#3776ab",
    difficulty: "beginner",
    category: "Python",
    tags: ["python", "programming", "beginner"],
    chapters: [
      {
        title: "Python Basics",
        lessons: [
          {
            slug: "hello-python",
            title: "Your First Python Program",
            description: "Print output and understand how Python runs code.",
            duration: 5,
            codeLanguage: "python",
            codeExample: "print('Hello, world!')\nname = 'Aarav'\nprint('Hello,', name)",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "print() displays output.",
                  "Python runs top to bottom, line by line.",
                  "No semicolons or braces needed; indentation matters.",
                ],
              },
              {
                type: "paragraph",
                text: "Python is known for its clean, readable syntax. The classic first program simply prints a message to the screen using the built-in print() function.",
              },
              {
                type: "code",
                block: {
                  language: "python",
                  code: "print('Hello, world!')\n# Output: Hello, world!",
                },
              },
              {
                type: "note",
                variant: "tip",
                text: "Run this in the playground on this page to see the output instantly.",
              },
            ],
            quiz: [
              {
                question: "Which function displays output in Python?",
                options: ["echo()", "printf()", "print()", "console.log()"],
                correct: 2,
                explain: "print() is Python's built-in function for displaying output.",
              },
              {
                question: "Does Python require semicolons at the end of lines?",
                options: ["Yes, always", "No", "Only inside functions", "Only for print"],
                correct: 1,
                explain: "Python uses newlines and indentation instead of semicolons and braces.",
              },
            ],
          },
          {
            slug: "variables-python",
            title: "Variables and Data Types",
            description: "Store data in variables and learn Python's core types.",
            duration: 7,
            codeLanguage: "python",
            codeExample:
              "name = 'Aarav'\nage = 21\nheight = 5.9\nis_student = True\nprint(name, age, height, is_student)",
            body: [
              {
                type: "paragraph",
                text: "A variable stores a value. In Python you do not declare a type; it is inferred from the value you assign.",
              },
              {
                type: "code",
                block: {
                  language: "python",
                  code: "name = 'Aarav'      # str\nage = 21            # int\nheight = 5.9        # float\nis_student = True   # bool\n\nprint(name, age, height, is_student)",
                },
              },
              {
                type: "table",
                headers: ["Type", "Example"],
                rows: [
                  ["str", "'hello'"],
                  ["int", "42"],
                  ["float", "3.14"],
                  ["bool", "True / False"],
                ],
              },
            ],
            quiz: [
              {
                question: "What type is the value 3.14?",
                options: ["int", "float", "str", "bool"],
                correct: 1,
                explain: "Numbers with a decimal point are of type float.",
              },
            ],
          },
          {
            slug: "if-statements-python",
            title: "If Statements",
            description: "Make decisions in code with if, elif and else.",
            duration: 7,
            codeLanguage: "python",
            codeExample:
              "score = 82\nif score >= 90:\n    print('A')\nelif score >= 75:\n    print('B')\nelse:\n    print('C')",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "if runs a block when a condition is True.",
                  "elif checks another condition; else covers everything else.",
                  "Indentation defines which lines belong to each block.",
                ],
              },
              {
                type: "paragraph",
                text: "Conditional statements let your program make decisions. Python uses if, elif (else if) and else.",
              },
              {
                type: "code",
                block: {
                  language: "python",
                  code: "score = 82\n\nif score >= 90:\n    print('Grade A')\nelif score >= 75:\n    print('Grade B')\nelse:\n    print('Grade C')\n\n# Output: Grade B",
                },
              },
              {
                type: "note",
                variant: "warning",
                text: "Indentation is not optional in Python. The lines inside each block must be indented consistently (4 spaces is standard).",
              },
            ],
            quiz: [
              {
                question: "What keyword means 'else if' in Python?",
                options: ["elseif", "elif", "elsif", "ei"],
                correct: 1,
                explain: "Python uses elif for additional conditions.",
              },
              {
                question: "For score = 82, what does the example print?",
                options: ["Grade A", "Grade B", "Grade C", "Nothing"],
                correct: 1,
                explain: "82 is not >= 90 but is >= 75, so the elif branch runs: Grade B.",
              },
            ],
          },
        ],
      },
    ],
  },

  // =========================================== REMAINING COURSES (starters)
  {
    slug: "react-complete",
    title: "React.js Complete",
    description: "Build modern, component-based user interfaces with React.",
    longDescription:
      "React is the most popular library for building user interfaces. Learn components, props, state, hooks and how to compose them into real applications.",
    icon: "⚛️",
    color: "#61dafb",
    difficulty: "intermediate",
    category: "Web Development",
    tags: ["react", "javascript", "frontend", "hooks"],
    chapters: [
      {
        title: "React Foundations",
        lessons: [
          {
            slug: "what-is-react",
            title: "What is React?",
            description: "Understand components and why React is popular.",
            duration: 7,
            codeLanguage: "javascript",
            codeExample:
              "function Welcome() {\n  return <h1>Hello from React</h1>;\n}",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "React builds UIs from reusable pieces called components.",
                  "Components return JSX, which looks like HTML in JavaScript.",
                  "React updates the screen efficiently when data changes.",
                ],
              },
              {
                type: "paragraph",
                text: "React is a JavaScript library for building user interfaces out of components: small, reusable pieces that describe part of the screen.",
              },
              {
                type: "code",
                block: {
                  language: "javascript",
                  code: "function Welcome() {\n  return <h1>Hello from React</h1>;\n}",
                },
              },
            ],
            quiz: [
              {
                question: "What are React UIs built from?",
                options: ["Templates", "Components", "Pages", "Widgets only"],
                correct: 1,
                explain: "React composes UIs from reusable components.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master the concepts asked in every coding interview.",
    longDescription:
      "Data structures and algorithms are the foundation of efficient programming and technical interviews. Learn arrays, linked lists, stacks, trees, sorting, searching and complexity analysis.",
    icon: "🧩",
    color: "#7c3aed",
    difficulty: "intermediate",
    category: "DSA",
    tags: ["dsa", "algorithms", "data structures", "interview"],
    chapters: [
      {
        title: "Foundations",
        lessons: [
          {
            slug: "big-o-notation",
            title: "Big-O Notation",
            description: "Measure how an algorithm scales with input size.",
            duration: 8,
            codeLanguage: "python",
            codeExample:
              "def find(arr, target):\n    for x in arr:\n        if x == target:\n            return True\n    return False",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "Big-O describes how running time grows as input grows.",
                  "O(1) is constant, O(n) is linear, O(n^2) is quadratic.",
                  "We care about the worst case as n gets large.",
                ],
              },
              {
                type: "paragraph",
                text: "Big-O notation describes the performance of an algorithm as the size of the input grows. It lets us compare algorithms independently of the machine they run on.",
              },
              {
                type: "table",
                headers: ["Notation", "Name", "Example"],
                rows: [
                  ["O(1)", "Constant", "Accessing an array index"],
                  ["O(n)", "Linear", "Scanning a list once"],
                  ["O(n log n)", "Linearithmic", "Merge sort"],
                  ["O(n^2)", "Quadratic", "Nested loops"],
                ],
              },
            ],
            quiz: [
              {
                question: "What is the time complexity of scanning a list once?",
                options: ["O(1)", "O(n)", "O(n^2)", "O(log n)"],
                correct: 1,
                explain: "Visiting each of n items once is O(n), linear time.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "sql-databases",
    title: "SQL & Databases",
    description: "Query and design relational databases with SQL.",
    longDescription:
      "SQL is the language of databases. Learn to query data, join tables, aggregate results and design normalized schemas.",
    icon: "🗃️",
    color: "#00758f",
    difficulty: "beginner",
    category: "Databases",
    tags: ["sql", "database", "dbms", "backend"],
    chapters: [
      {
        title: "Querying Data",
        lessons: [
          {
            slug: "select-basics",
            title: "The SELECT Statement",
            description: "Read data from a table with SELECT.",
            duration: 6,
            codeLanguage: "sql",
            codeExample: "SELECT name, age FROM students WHERE age >= 18;",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "SELECT reads columns from a table.",
                  "WHERE filters which rows come back.",
                  "Use * to select all columns.",
                ],
              },
              {
                type: "paragraph",
                text: "The SELECT statement is how you read data from a relational database. You choose which columns you want and, optionally, filter the rows with WHERE.",
              },
              {
                type: "code",
                block: {
                  language: "sql",
                  code: "SELECT name, age\nFROM students\nWHERE age >= 18\nORDER BY name;",
                },
              },
            ],
            quiz: [
              {
                question: "Which clause filters rows in a query?",
                options: ["SELECT", "FROM", "WHERE", "ORDER BY"],
                correct: 2,
                explain: "WHERE filters which rows are returned.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "git-github",
    title: "Git & GitHub",
    description: "Track changes and collaborate on code with confidence.",
    longDescription:
      "Git is the version control system every developer uses. Learn commits, branches, merges and how to collaborate on GitHub.",
    icon: "🐙",
    color: "#f05033",
    difficulty: "beginner",
    category: "DevOps",
    tags: ["git", "github", "version control", "collaboration"],
    chapters: [
      {
        title: "Git Basics",
        lessons: [
          {
            slug: "git-init-commit",
            title: "Your First Commit",
            description: "Initialise a repository and save a snapshot.",
            duration: 7,
            codeLanguage: "bash",
            codeExample: "git init\ngit add .\ngit commit -m \"Initial commit\"",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "git init starts tracking a project.",
                  "git add stages changes; git commit saves a snapshot.",
                  "Each commit has a message describing the change.",
                ],
              },
              {
                type: "paragraph",
                text: "Git records snapshots of your project over time. You stage the changes you want to save, then commit them with a short message.",
              },
              {
                type: "code",
                block: {
                  language: "bash",
                  code: "git init\ngit add .\ngit commit -m \"Initial commit\"",
                },
              },
            ],
            quiz: [
              {
                question: "Which command saves a snapshot with a message?",
                options: ["git save", "git commit", "git push", "git stage"],
                correct: 1,
                explain: "git commit -m \"message\" saves a snapshot of the staged changes.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "nodejs-backend",
    title: "Node.js Backend",
    description: "Build servers and APIs with JavaScript on the backend.",
    longDescription:
      "Node.js lets you run JavaScript on the server. Learn modules, the HTTP server, Express and how to build a REST API.",
    icon: "🟢",
    color: "#43853d",
    difficulty: "intermediate",
    category: "Web Development",
    tags: ["nodejs", "backend", "express", "api"],
    chapters: [
      {
        title: "Getting Started",
        lessons: [
          {
            slug: "what-is-node",
            title: "What is Node.js?",
            description: "Run JavaScript outside the browser.",
            duration: 6,
            codeLanguage: "javascript",
            codeExample: "console.log('Running on Node.js');",
            body: [
              {
                type: "paragraph",
                text: "Node.js is a runtime that lets you run JavaScript on the server, outside the browser. It is used to build web servers, APIs and command-line tools.",
              },
              {
                type: "code",
                block: {
                  language: "javascript",
                  code: "// hello.js\nconsole.log('Running on Node.js');\n// Run with: node hello.js",
                },
              },
            ],
            quiz: [
              {
                question: "Where does Node.js run JavaScript?",
                options: ["In the browser", "On the server", "In a database", "In CSS"],
                correct: 1,
                explain: "Node.js runs JavaScript on the server, outside the browser.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "system-design",
    title: "System Design",
    description: "Design scalable systems for real-world applications.",
    longDescription:
      "System design is about building software that scales. Learn about load balancing, caching, databases, and how large systems are structured.",
    icon: "🏗️",
    color: "#0f172a",
    difficulty: "advanced",
    category: "DevOps",
    tags: ["system design", "architecture", "scalability", "backend"],
    chapters: [
      {
        title: "Fundamentals",
        lessons: [
          {
            slug: "scalability-basics",
            title: "Scalability Basics",
            description: "Understand vertical vs horizontal scaling.",
            duration: 8,
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "Vertical scaling means a bigger machine.",
                  "Horizontal scaling means more machines.",
                  "Horizontal scaling is how large systems handle growth.",
                ],
              },
              {
                type: "paragraph",
                text: "Scalability is a system's ability to handle more load. You can scale vertically (add more power to one server) or horizontally (add more servers). Large systems rely on horizontal scaling behind a load balancer.",
              },
              {
                type: "table",
                headers: ["Approach", "Meaning", "Limit"],
                rows: [
                  ["Vertical", "Bigger server (more CPU/RAM)", "Hardware ceiling"],
                  ["Horizontal", "More servers in parallel", "Coordination complexity"],
                ],
              },
            ],
            quiz: [
              {
                question: "What is horizontal scaling?",
                options: [
                  "Upgrading to a bigger server",
                  "Adding more servers",
                  "Deleting old data",
                  "Compressing files",
                ],
                correct: 1,
                explain: "Horizontal scaling adds more machines to share the load.",
              },
            ],
          },
        ],
      },
    ],
  },
];
