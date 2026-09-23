import type { Chapter } from "./types";

// Additional chapters, keyed by course slug. Merged into the base courses in
// data.ts so course files stay readable. All content is hand-written English.

export const extraChapters: Record<string, Chapter[]> = {
  // --------------------------------------------------------------- HTML
  "html-fundamentals": [
    {
      title: "Links, Lists and Images",
      lessons: [
        {
          slug: "links",
          title: "Links and Navigation",
          description: "Connect pages together with the anchor element.",
          duration: 6,
          codeLanguage: "html",
          codeExample: '<a href="about.html">About us</a>\n<a href="#top">Back to top</a>',
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "The <a> element creates a hyperlink.",
                "href sets the destination (a URL or #anchor).",
                "Use descriptive link text, not 'click here'.",
              ],
            },
            {
              type: "paragraph",
              text: "Links are what make the web a web. The anchor element <a> turns text or images into clickable links using the href attribute.",
            },
            {
              type: "code",
              block: {
                language: "html",
                code: '<a href="https://example.com">External site</a>\n<a href="about.html">Internal page</a>\n<a href="#section-2">Jump to a section</a>\n<a href="mailto:hi@site.com">Email us</a>',
              },
            },
            {
              type: "note",
              variant: "tip",
              text: "Write link text that makes sense on its own. 'Read the setup guide' is far better than 'click here' for accessibility and SEO.",
            },
          ],
          quiz: [
            {
              question: "Which attribute sets a link's destination?",
              options: ["src", "href", "link", "to"],
              correct: 1,
              explain: "The href attribute holds the URL or anchor a link points to.",
            },
            {
              question: "What does href='#top' do?",
              options: [
                "Opens a new tab",
                "Jumps to an element with id='top' on the page",
                "Downloads a file",
                "Reloads the page",
              ],
              correct: 1,
              explain: "A hash link jumps to the element whose id matches, here id='top'.",
            },
          ],
        },
        {
          slug: "lists",
          title: "Ordered and Unordered Lists",
          description: "Group related items with list elements.",
          duration: 5,
          codeLanguage: "html",
          codeExample: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>",
          body: [
            {
              type: "paragraph",
              text: "Lists group related items. Use an unordered list <ul> when order does not matter, and an ordered list <ol> when it does (like steps).",
            },
            {
              type: "code",
              block: {
                language: "html",
                code: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n\n<ol>\n  <li>Plan</li>\n  <li>Build</li>\n  <li>Ship</li>\n</ol>",
              },
            },
          ],
          quiz: [
            {
              question: "Which element creates a numbered list?",
              options: ["<ul>", "<ol>", "<li>", "<list>"],
              correct: 1,
              explain: "<ol> is an ordered (numbered) list; <ul> is unordered (bullets).",
            },
          ],
        },
        {
          slug: "images",
          title: "Adding Images",
          description: "Embed images with the img element and good alt text.",
          duration: 5,
          codeLanguage: "html",
          codeExample: '<img src="cat.jpg" alt="A sleeping cat" width="300">',
          body: [
            {
              type: "paragraph",
              text: "The <img> element embeds an image. It needs a src (the file) and should always have an alt attribute describing the image.",
            },
            {
              type: "code",
              block: {
                language: "html",
                code: '<img src="cat.jpg" alt="A sleeping orange cat" width="300" loading="lazy">',
              },
            },
            {
              type: "note",
              variant: "warning",
              text: "Add loading='lazy' to images below the fold so the page loads faster.",
            },
          ],
          quiz: [
            {
              question: "Which attribute should every image include for accessibility?",
              options: ["title", "alt", "caption", "label"],
              correct: 1,
              explain: "alt describes the image for screen readers and when the image fails to load.",
            },
          ],
        },
      ],
    },
    {
      title: "Forms",
      lessons: [
        {
          slug: "forms-basics",
          title: "Building a Form",
          description: "Collect user input with form controls.",
          duration: 8,
          codeLanguage: "html",
          codeExample:
            '<form>\n  <label>Name <input type="text" name="name"></label>\n  <button type="submit">Send</button>\n</form>',
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "The <form> element wraps input controls.",
                "<input>, <textarea> and <select> collect data.",
                "Always pair inputs with a <label> for accessibility.",
              ],
            },
            {
              type: "paragraph",
              text: "Forms let users send data: logins, searches, sign-ups and more. A form wraps one or more controls and a submit button.",
            },
            {
              type: "code",
              block: {
                language: "html",
                code: '<form action="/subscribe" method="post">\n  <label for="email">Email</label>\n  <input id="email" type="email" name="email" required>\n\n  <button type="submit">Subscribe</button>\n</form>',
              },
            },
            {
              type: "note",
              variant: "tip",
              text: "Use the right input type (email, number, date). Mobile keyboards adapt and browsers validate automatically.",
            },
          ],
          quiz: [
            {
              question: "Why pair an input with a <label>?",
              options: [
                "It is required by HTML",
                "For accessibility and a larger click target",
                "To style the input",
                "It submits the form",
              ],
              correct: 1,
              explain: "Labels describe inputs for screen readers and let users click the label to focus the field.",
            },
          ],
        },
      ],
    },
  ],

  // --------------------------------------------------------------- CSS
  "css-mastery": [
    {
      title: "Layout with Flexbox",
      lessons: [
        {
          slug: "flexbox",
          title: "Flexbox Basics",
          description: "Arrange items in a row or column with Flexbox.",
          duration: 9,
          codeLanguage: "css",
          codeExample:
            ".row {\n  display: flex;\n  gap: 12px;\n  justify-content: space-between;\n  align-items: center;\n}",
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "display: flex turns an element into a flex container.",
                "justify-content aligns items along the main axis.",
                "align-items aligns items along the cross axis.",
              ],
            },
            {
              type: "paragraph",
              text: "Flexbox is a one-dimensional layout system for arranging items in a row or a column. It makes centering and spacing straightforward.",
            },
            {
              type: "code",
              block: {
                language: "css",
                code: ".navbar {\n  display: flex;\n  justify-content: space-between; /* space between items */\n  align-items: center;           /* vertical centering */\n  gap: 16px;\n}",
              },
            },
            {
              type: "table",
              headers: ["Property", "Controls"],
              rows: [
                ["justify-content", "Main-axis alignment (usually horizontal)"],
                ["align-items", "Cross-axis alignment (usually vertical)"],
                ["gap", "Space between items"],
                ["flex-direction", "Row or column"],
              ],
            },
          ],
          quiz: [
            {
              question: "What does display: flex do?",
              options: [
                "Hides the element",
                "Makes it a flex container",
                "Adds a border",
                "Centers text only",
              ],
              correct: 1,
              explain: "display: flex turns an element into a flex container whose children become flex items.",
            },
            {
              question: "Which property centers items vertically in a row?",
              options: ["justify-content", "align-items", "text-align", "gap"],
              correct: 1,
              explain: "In a row, align-items controls the vertical (cross-axis) alignment.",
            },
          ],
        },
        {
          slug: "grid",
          title: "CSS Grid Basics",
          description: "Build two-dimensional layouts with Grid.",
          duration: 9,
          codeLanguage: "css",
          codeExample:
            ".grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}",
          body: [
            {
              type: "paragraph",
              text: "CSS Grid is a two-dimensional layout system: it handles rows and columns at the same time, which makes it perfect for page layouts and card grids.",
            },
            {
              type: "code",
              block: {
                language: "css",
                code: ".gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */\n  gap: 16px;\n}",
              },
            },
            {
              type: "note",
              variant: "info",
              text: "Use Flexbox for one direction (a row or column) and Grid when you need to control both rows and columns together.",
            },
          ],
          quiz: [
            {
              question: "CSS Grid is best described as:",
              options: [
                "One-dimensional layout",
                "Two-dimensional layout",
                "A color system",
                "An animation tool",
              ],
              correct: 1,
              explain: "Grid lays out content in two dimensions (rows and columns) at once.",
            },
          ],
        },
      ],
    },
  ],

  // --------------------------------------------------------- JAVASCRIPT
  "javascript-core": [
    {
      title: "Objects and Logic",
      lessons: [
        {
          slug: "objects",
          title: "Objects",
          description: "Group related data with key-value pairs.",
          duration: 8,
          codeLanguage: "javascript",
          codeExample:
            "const user = { name: 'Aarav', age: 21 };\nconsole.log(user.name);",
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "An object stores data as key-value pairs.",
                "Access values with dot notation: user.name.",
                "Objects can hold values, arrays and functions.",
              ],
            },
            {
              type: "paragraph",
              text: "Objects group related data together under named keys. They are one of the most-used structures in JavaScript.",
            },
            {
              type: "code",
              block: {
                language: "javascript",
                code: "const user = {\n  name: 'Aarav',\n  age: 21,\n  skills: ['HTML', 'CSS'],\n};\n\nconsole.log(user.name);      // Aarav\nconsole.log(user.skills[0]); // HTML",
              },
            },
          ],
          quiz: [
            {
              question: "How do you read the name from const user = { name: 'Sam' }?",
              options: ["user->name", "user.name", "user[name]", "name(user)"],
              correct: 1,
              explain: "Dot notation user.name reads the value stored under the 'name' key.",
            },
          ],
        },
        {
          slug: "conditionals",
          title: "Conditionals and Loops",
          description: "Make decisions and repeat work.",
          duration: 9,
          codeLanguage: "javascript",
          codeExample:
            "for (let i = 1; i <= 3; i++) {\n  console.log(i % 2 === 0 ? 'even' : 'odd');\n}",
          body: [
            {
              type: "paragraph",
              text: "Conditionals let your code choose a path with if/else, and loops let you repeat work with for and while.",
            },
            {
              type: "code",
              block: {
                language: "javascript",
                code: "const score = 72;\nif (score >= 90) {\n  console.log('A');\n} else if (score >= 60) {\n  console.log('Pass');\n} else {\n  console.log('Retry');\n}\n\nfor (let i = 1; i <= 3; i++) {\n  console.log('Attempt', i);\n}",
              },
            },
          ],
          quiz: [
            {
              question: "What does a for loop do?",
              options: [
                "Runs code once",
                "Repeats code a number of times",
                "Defines a function",
                "Creates an object",
              ],
              correct: 1,
              explain: "A for loop repeats a block of code, usually a set number of times.",
            },
          ],
        },
      ],
    },
  ],

  // --------------------------------------------------------------- PYTHON
  "python-for-beginners": [
    {
      title: "Loops and Data Structures",
      lessons: [
        {
          slug: "loops-python",
          title: "For Loops",
          description: "Repeat actions over a range or a list.",
          duration: 7,
          codeLanguage: "python",
          codeExample: "for i in range(5):\n    print(i)",
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "A for loop repeats over a sequence.",
                "range(n) gives numbers 0 to n-1.",
                "You can loop directly over a list.",
              ],
            },
            {
              type: "paragraph",
              text: "For loops repeat an action for each item in a sequence, such as a range of numbers or the items of a list.",
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "for i in range(5):\n    print(i)\n# 0 1 2 3 4\n\nfruits = ['apple', 'banana']\nfor fruit in fruits:\n    print(fruit)",
              },
            },
          ],
          quiz: [
            {
              question: "What does range(3) produce?",
              options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"],
              correct: 1,
              explain: "range(3) yields 0, 1, 2 (starts at 0, stops before 3).",
            },
          ],
        },
        {
          slug: "lists-python",
          title: "Lists",
          description: "Store ordered collections you can change.",
          duration: 7,
          codeLanguage: "python",
          codeExample:
            "nums = [3, 1, 2]\nnums.append(4)\nnums.sort()\nprint(nums)",
          body: [
            {
              type: "paragraph",
              text: "A list is an ordered, changeable collection of items. You can add, remove, sort and index into it.",
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "nums = [3, 1, 2]\nnums.append(4)   # [3, 1, 2, 4]\nnums.sort()      # [1, 2, 3, 4]\nprint(nums[0])   # 1\nprint(len(nums)) # 4",
              },
            },
          ],
          quiz: [
            {
              question: "Which method adds an item to the end of a list?",
              options: ["add()", "push()", "append()", "insert()"],
              correct: 2,
              explain: "append() adds an item to the end of a Python list.",
            },
          ],
        },
        {
          slug: "functions-python",
          title: "Functions",
          description: "Package reusable logic with def.",
          duration: 7,
          codeLanguage: "python",
          codeExample: "def greet(name):\n    return f'Hi, {name}!'\n\nprint(greet('Sam'))",
          body: [
            {
              type: "paragraph",
              text: "Functions let you name and reuse a block of code. Define them with def, give them parameters, and return a result.",
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "def area(width, height):\n    return width * height\n\nprint(area(4, 3))  # 12",
              },
            },
          ],
          quiz: [
            {
              question: "Which keyword defines a function in Python?",
              options: ["func", "function", "def", "define"],
              correct: 2,
              explain: "Python uses the def keyword to define a function.",
            },
          ],
        },
      ],
    },
  ],
};
