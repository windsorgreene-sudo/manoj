import type { Article } from "./types";

// Seed content. Full articles carry a complete `body`; listing entries carry
// a shorter body but the same metadata shape so the migration can replace them
// one-for-one. Dates are ISO strings.

export const articles: Article[] = [
  // ---------------------------------------------------------------- PYTHON
  {
    slug: "map-function",
    title: "map() Function in Python",
    description:
      "Understand Python's built-in map() function — its syntax, parameters and practical examples for applying a function to every item of an iterable.",
    category: "python",
    subcategory: "functions",
    contentType: "tutorial",
    tags: ["python", "functions", "map", "iterables", "functional programming"],
    authorId: "manoj-purohit",
    publishedDate: "2020-05-14",
    updatedDate: "2026-09-20",
    difficulty: "beginner",
    readingMinutes: 6,
    legacyUrl: "https://mpcsblog.blogspot.com/2020/05/map-in-python.html",
    featured: true,
    popular: true,
    seoTitle: "map() Function in Python — Syntax, Parameters and Examples",
    seoDescription:
      "A clear guide to Python's map() function with syntax, parameters, worked examples and common mistakes.",
    body: [
      {
        type: "paragraph",
        text: "The map() function is one of Python's built-in higher-order functions. It applies a given function to every item of an iterable (list, tuple, and so on) and returns a map object — an iterator that yields the transformed values.",
      },
      { type: "heading", level: 2, id: "syntax", text: "Syntax" },
      {
        type: "code",
        block: {
          language: "python",
          code: "map(function, iterable, *iterables)",
        },
      },
      { type: "heading", level: 2, id: "parameters", text: "Parameters" },
      {
        type: "list",
        items: [
          "function — the function that is applied to each element of the iterable.",
          "iterable — one or more iterables whose items are passed to the function.",
        ],
      },
      {
        type: "paragraph",
        text: "map() returns an iterator. To see the values you usually convert it to a list or loop over it.",
      },
      { type: "heading", level: 2, id: "examples", text: "Examples" },
      {
        type: "paragraph",
        text: "Squaring every number in a list using a named function:",
      },
      {
        type: "code",
        block: {
          language: "python",
          code: "def square(n):\n    return n * n\n\nnumbers = [1, 2, 3, 4, 5]\nresult = map(square, numbers)\nprint(list(result))\n# Output: [1, 4, 9, 16, 25]",
        },
      },
      {
        type: "paragraph",
        text: "The same thing written more compactly with a lambda expression:",
      },
      {
        type: "code",
        block: {
          language: "python",
          code: "numbers = [1, 2, 3, 4, 5]\nsquares = list(map(lambda n: n * n, numbers))\nprint(squares)\n# Output: [1, 4, 9, 16, 25]",
        },
      },
      {
        type: "heading",
        level: 3,
        id: "multiple-iterables",
        text: "Using multiple iterables",
      },
      {
        type: "paragraph",
        text: "When you pass more than one iterable, the function must take that many arguments. map() stops when the shortest iterable is exhausted.",
      },
      {
        type: "code",
        block: {
          language: "python",
          code: "a = [1, 2, 3]\nb = [10, 20, 30]\ntotals = list(map(lambda x, y: x + y, a, b))\nprint(totals)\n# Output: [11, 22, 33]",
        },
      },
      {
        type: "heading",
        level: 2,
        id: "common-mistakes",
        text: "Common mistakes",
      },
      {
        type: "note",
        variant: "warning",
        text: "map() returns an iterator, not a list. Printing the map object directly shows something like <map object at 0x...>. Wrap it in list() to view the results.",
      },
      {
        type: "list",
        items: [
          "An iterator can only be consumed once. After you convert it to a list, iterating again yields nothing.",
          "The function is not called immediately — map() is lazy and evaluates items only as they are requested.",
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "related-concepts",
        text: "Related concepts",
      },
      {
        type: "paragraph",
        text: "map() is often used together with filter() and reduce(). In modern Python, a list comprehension is frequently preferred for readability: [n * n for n in numbers].",
      },
      {
        type: "note",
        variant: "tip",
        text: "Use map() when you already have a named function to apply. Reach for a list comprehension when the transformation is simple and inline.",
      },
    ],
  },
  {
    slug: "list-comprehension",
    title: "List Comprehension in Python",
    description:
      "A concise way to build lists in Python. Learn the syntax, conditional comprehensions and nested comprehensions with examples.",
    category: "python",
    subcategory: "basics",
    contentType: "tutorial",
    tags: ["python", "list", "comprehension", "iterables"],
    authorId: "manoj-purohit",
    publishedDate: "2020-06-02",
    updatedDate: "2026-09-15",
    difficulty: "beginner",
    readingMinutes: 5,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "A list comprehension provides a short syntax to create a new list from an existing iterable, optionally filtering or transforming items in a single expression.",
      },
      { type: "heading", level: 2, id: "syntax", text: "Syntax" },
      {
        type: "code",
        block: {
          language: "python",
          code: "[expression for item in iterable if condition]",
        },
      },
      { type: "heading", level: 2, id: "examples", text: "Examples" },
      {
        type: "code",
        block: {
          language: "python",
          code: "# Squares of even numbers from 0 to 9\nsquares = [n * n for n in range(10) if n % 2 == 0]\nprint(squares)\n# Output: [0, 4, 16, 36, 64]",
        },
      },
      {
        type: "note",
        variant: "tip",
        text: "Keep comprehensions to a single, readable line. If logic grows complex, a regular for-loop is clearer.",
      },
    ],
  },
  {
    slug: "exception-handling",
    title: "Exception Handling in Python",
    description:
      "Handle runtime errors gracefully using try, except, else and finally blocks in Python, with examples of common exceptions.",
    category: "python",
    subcategory: "basics",
    contentType: "tutorial",
    tags: ["python", "exceptions", "errors", "try except"],
    authorId: "manoj-purohit",
    publishedDate: "2020-07-11",
    updatedDate: "2026-08-30",
    difficulty: "intermediate",
    readingMinutes: 7,
    body: [
      {
        type: "paragraph",
        text: "Exception handling lets a program respond to runtime errors instead of crashing. Python uses try/except blocks to catch and handle exceptions.",
      },
      { type: "heading", level: 2, id: "syntax", text: "Basic structure" },
      {
        type: "code",
        block: {
          language: "python",
          code: "try:\n    value = int(input('Enter a number: '))\n    print(10 / value)\nexcept ValueError:\n    print('That was not a valid number.')\nexcept ZeroDivisionError:\n    print('Cannot divide by zero.')\nelse:\n    print('No errors occurred.')\nfinally:\n    print('This always runs.')",
        },
      },
      {
        type: "table",
        headers: ["Block", "When it runs"],
        rows: [
          ["try", "Contains code that might raise an exception."],
          ["except", "Runs when a matching exception is raised."],
          ["else", "Runs only if no exception was raised."],
          ["finally", "Always runs, whether or not an exception occurred."],
        ],
      },
    ],
  },
  {
    slug: "python-lab-assignment-1",
    title: "Python Lab Assignment 1 — Basic Programs",
    description:
      "A set of introductory Python lab programs: arithmetic operations, checking even/odd, and generating patterns. Suitable for first-year practicals.",
    category: "python",
    subcategory: "basics",
    contentType: "lab",
    tags: ["python", "lab", "assignment", "practicals"],
    authorId: "manoj-purohit",
    publishedDate: "2021-01-20",
    updatedDate: "2026-07-10",
    difficulty: "beginner",
    readingMinutes: 4,
    body: [
      {
        type: "paragraph",
        text: "This lab sheet contains introductory Python programs commonly given in the first practical session.",
      },
      {
        type: "heading",
        level: 2,
        id: "program-1",
        text: "Program 1: Check even or odd",
      },
      {
        type: "code",
        block: {
          language: "python",
          code: "n = int(input('Enter a number: '))\nif n % 2 == 0:\n    print(n, 'is even')\nelse:\n    print(n, 'is odd')",
        },
      },
    ],
  },
  {
    slug: "python-mcq-set-1",
    title: "Python MCQ Set 1 — Basics",
    description:
      "Practice multiple-choice questions on Python fundamentals covering data types, operators and control flow.",
    category: "python",
    contentType: "mcq",
    tags: ["python", "mcq", "test", "practice"],
    authorId: "editorial",
    publishedDate: "2022-02-01",
    updatedDate: "2026-06-01",
    difficulty: "beginner",
    readingMinutes: 8,
    body: [
      {
        type: "paragraph",
        text: "Ten multiple-choice questions to test your understanding of Python basics. Answers are given at the end.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "What is the output of type([])? (a) list (b) tuple (c) dict (d) set",
          "Which keyword defines a function in Python? (a) func (b) def (c) function (d) lambda",
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ JAVA
  {
    slug: "inheritance",
    title: "Inheritance in Java",
    description:
      "Learn how inheritance lets one class acquire the properties and methods of another in Java, including types of inheritance and the super keyword.",
    category: "java",
    subcategory: "oop",
    contentType: "tutorial",
    tags: ["java", "oop", "inheritance", "super", "extends"],
    authorId: "manoj-purohit",
    publishedDate: "2019-11-08",
    updatedDate: "2026-09-18",
    difficulty: "intermediate",
    readingMinutes: 8,
    legacyUrl: "https://mpcsblog.blogspot.com/2019/11/inheritance-in-java.html",
    featured: true,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "Inheritance is a core object-oriented programming concept in which a new class (the subclass) is derived from an existing class (the superclass). The subclass inherits fields and methods of the superclass, promoting code reuse.",
      },
      { type: "heading", level: 2, id: "syntax", text: "Syntax" },
      {
        type: "code",
        block: {
          language: "java",
          code: "class Superclass {\n    // fields and methods\n}\n\nclass Subclass extends Superclass {\n    // additional fields and methods\n}",
        },
      },
      { type: "heading", level: 2, id: "example", text: "Example" },
      {
        type: "code",
        block: {
          language: "java",
          code: "class Animal {\n    void eat() {\n        System.out.println(\"This animal eats food.\");\n    }\n}\n\nclass Dog extends Animal {\n    void bark() {\n        System.out.println(\"The dog barks.\");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog();\n        d.eat();  // inherited from Animal\n        d.bark(); // defined in Dog\n    }\n}",
        },
      },
      {
        type: "heading",
        level: 2,
        id: "types",
        text: "Types of inheritance",
      },
      {
        type: "list",
        items: [
          "Single inheritance — one subclass extends one superclass.",
          "Multilevel inheritance — a class extends a subclass, forming a chain.",
          "Hierarchical inheritance — multiple subclasses extend the same superclass.",
        ],
      },
      {
        type: "note",
        variant: "info",
        text: "Java does not support multiple inheritance with classes (a class cannot extend more than one class). Interfaces are used to achieve a similar effect.",
      },
    ],
  },
  {
    slug: "exception-handling-java",
    title: "Exception Handling in Java",
    description:
      "Understand checked and unchecked exceptions in Java and how to handle them with try, catch, finally and throw.",
    category: "java",
    subcategory: "exceptions",
    contentType: "tutorial",
    tags: ["java", "exceptions", "try catch", "errors"],
    authorId: "manoj-purohit",
    publishedDate: "2020-01-15",
    updatedDate: "2026-08-20",
    difficulty: "intermediate",
    readingMinutes: 7,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "An exception is an event that disrupts the normal flow of a program. Java provides a robust mechanism to handle exceptions using try, catch, finally, throw and throws.",
      },
      {
        type: "code",
        block: {
          language: "java",
          code: "try {\n    int[] a = new int[3];\n    a[5] = 10; // throws ArrayIndexOutOfBoundsException\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println(\"Index out of bounds: \" + e.getMessage());\n} finally {\n    System.out.println(\"Cleanup runs here.\");\n}",
        },
      },
    ],
  },
  {
    slug: "oopj-inheritance-assignment",
    title: "Inheritance Assignment — OOPJ",
    description:
      "Programming assignment on inheritance for the Object-Oriented Programming with Java course, with problem statements and expected output.",
    category: "oopj",
    subcategory: "concepts",
    contentType: "assignment",
    tags: ["oopj", "java", "inheritance", "assignment"],
    authorId: "manoj-purohit",
    publishedDate: "2021-03-05",
    updatedDate: "2026-05-12",
    difficulty: "intermediate",
    readingMinutes: 3,
    body: [
      {
        type: "paragraph",
        text: "Solve the following problems demonstrating single, multilevel and hierarchical inheritance in Java.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Create a class Employee with fields name and salary. Derive a class Manager that adds a department field.",
          "Demonstrate multilevel inheritance with classes Vehicle → Car → SportsCar.",
        ],
      },
    ],
  },

  // ------------------------------------------------------------------- C++
  {
    slug: "pointers",
    title: "Pointers in C++",
    description:
      "Understand pointers in C++ — declaration, dereferencing, pointer arithmetic and their relationship with arrays.",
    category: "cpp",
    subcategory: "pointers",
    contentType: "tutorial",
    tags: ["cpp", "pointers", "memory", "arrays"],
    authorId: "manoj-purohit",
    publishedDate: "2019-09-22",
    updatedDate: "2026-09-01",
    difficulty: "intermediate",
    readingMinutes: 9,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "A pointer is a variable that stores the memory address of another variable. Pointers are fundamental to C++ and enable dynamic memory, efficient array handling and pass-by-reference.",
      },
      {
        type: "code",
        block: {
          language: "cpp",
          code: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int value = 42;\n    int* ptr = &value; // ptr holds the address of value\n\n    cout << \"Value: \" << value << endl;\n    cout << \"Address: \" << ptr << endl;\n    cout << \"Dereferenced: \" << *ptr << endl;\n    return 0;\n}",
        },
      },
      {
        type: "note",
        variant: "warning",
        text: "Always initialise pointers. A pointer that does not point to valid memory (a dangling or wild pointer) leads to undefined behaviour.",
      },
    ],
  },
  {
    slug: "operator-overloading",
    title: "Operator Overloading in C++",
    description:
      "Learn how to give special meaning to operators for user-defined types in C++ using operator overloading.",
    category: "cpp",
    subcategory: "oop",
    contentType: "tutorial",
    tags: ["cpp", "oop", "operator overloading"],
    authorId: "manoj-purohit",
    publishedDate: "2020-02-19",
    updatedDate: "2026-07-25",
    difficulty: "advanced",
    readingMinutes: 8,
    body: [
      {
        type: "paragraph",
        text: "Operator overloading lets you redefine the behaviour of operators such as + and == for objects of a user-defined class.",
      },
      {
        type: "code",
        block: {
          language: "cpp",
          code: "class Complex {\n    double re, im;\npublic:\n    Complex(double r = 0, double i = 0) : re(r), im(i) {}\n    Complex operator+(const Complex& other) const {\n        return Complex(re + other.re, im + other.im);\n    }\n};",
        },
      },
    ],
  },

  // -------------------------------------------------------------------- SQL
  {
    slug: "sql-joins",
    title: "SQL Joins Explained",
    description:
      "Understand INNER, LEFT, RIGHT and FULL joins in SQL with clear examples and result tables.",
    category: "sql",
    subcategory: "joins",
    contentType: "tutorial",
    tags: ["sql", "joins", "database", "queries"],
    authorId: "manoj-purohit",
    publishedDate: "2020-08-14",
    updatedDate: "2026-09-10",
    difficulty: "intermediate",
    readingMinutes: 7,
    featured: true,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "A JOIN combines rows from two or more tables based on a related column. Choosing the right join type controls which rows appear in the result.",
      },
      {
        type: "code",
        block: {
          language: "sql",
          code: "SELECT s.name, c.title\nFROM students s\nINNER JOIN courses c ON s.course_id = c.id;",
        },
      },
      {
        type: "table",
        headers: ["Join type", "Rows returned"],
        rows: [
          ["INNER JOIN", "Only rows with a match in both tables."],
          ["LEFT JOIN", "All rows from the left table, matched rows from the right."],
          ["RIGHT JOIN", "All rows from the right table, matched rows from the left."],
          ["FULL JOIN", "All rows from both tables, matched where possible."],
        ],
      },
    ],
  },
  {
    slug: "normalization",
    title: "Database Normalization (1NF, 2NF, 3NF)",
    description:
      "Learn database normalization and the first three normal forms with examples to reduce redundancy and anomalies.",
    category: "sql",
    subcategory: "design",
    contentType: "notes",
    tags: ["sql", "normalization", "database design", "dbms"],
    authorId: "manoj-purohit",
    publishedDate: "2020-10-05",
    updatedDate: "2026-06-18",
    difficulty: "intermediate",
    readingMinutes: 6,
    body: [
      {
        type: "paragraph",
        text: "Normalization organises columns and tables of a database to minimise data redundancy and avoid update anomalies.",
      },
      {
        type: "list",
        items: [
          "1NF — atomic values, no repeating groups.",
          "2NF — 1NF plus no partial dependency on a composite key.",
          "3NF — 2NF plus no transitive dependency.",
        ],
      },
    ],
  },

  // -------------------------------------------------------- DATA STRUCTURES
  {
    slug: "linked-list",
    title: "Linked List — Introduction and Operations",
    description:
      "Learn the singly linked list data structure, its node representation, and insertion and deletion operations.",
    category: "data-structures",
    subcategory: "linear",
    contentType: "tutorial",
    tags: ["data structures", "linked list", "algorithms"],
    authorId: "manoj-purohit",
    publishedDate: "2020-04-01",
    updatedDate: "2026-09-05",
    difficulty: "intermediate",
    readingMinutes: 10,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "A linked list is a linear data structure where elements (nodes) are linked using pointers. Each node stores data and a reference to the next node.",
      },
      {
        type: "code",
        block: {
          language: "c",
          code: "struct Node {\n    int data;\n    struct Node* next;\n};",
        },
      },
    ],
  },
  {
    slug: "sorting-algorithms",
    title: "Sorting Algorithms Overview",
    description:
      "Compare common sorting algorithms — bubble, selection, insertion, merge and quick sort — with their time complexities.",
    category: "data-structures",
    subcategory: "algorithms",
    contentType: "notes",
    tags: ["data structures", "sorting", "algorithms", "complexity"],
    authorId: "manoj-purohit",
    publishedDate: "2020-11-18",
    updatedDate: "2026-08-08",
    difficulty: "intermediate",
    readingMinutes: 8,
    body: [
      {
        type: "table",
        headers: ["Algorithm", "Best", "Average", "Worst"],
        rows: [
          ["Bubble Sort", "O(n)", "O(n²)", "O(n²)"],
          ["Merge Sort", "O(n log n)", "O(n log n)", "O(n log n)"],
          ["Quick Sort", "O(n log n)", "O(n log n)", "O(n²)"],
        ],
      },
    ],
  },

  // ---------------------------------------------------- SOFTWARE ENGINEERING
  {
    slug: "sdlc",
    title: "Software Development Life Cycle (SDLC)",
    description:
      "Understand the phases of the Software Development Life Cycle — from requirement analysis through maintenance.",
    category: "software-engineering",
    subcategory: "process",
    contentType: "tutorial",
    tags: ["software engineering", "sdlc", "process"],
    authorId: "manoj-purohit",
    publishedDate: "2019-12-30",
    updatedDate: "2026-09-12",
    difficulty: "beginner",
    readingMinutes: 6,
    featured: true,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "The Software Development Life Cycle (SDLC) is a structured process used to design, develop and test high-quality software. It defines a sequence of phases each producing deliverables.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Requirement analysis",
          "System design",
          "Implementation (coding)",
          "Testing",
          "Deployment",
          "Maintenance",
        ],
      },
    ],
  },
  {
    slug: "agile-model",
    title: "Agile Software Development Model",
    description:
      "Learn the Agile model of software development, its principles, iterations and comparison with the waterfall model.",
    category: "software-engineering",
    subcategory: "process",
    contentType: "article",
    tags: ["software engineering", "agile", "scrum", "process"],
    authorId: "manoj-purohit",
    publishedDate: "2021-05-22",
    updatedDate: "2026-07-30",
    difficulty: "beginner",
    readingMinutes: 5,
    body: [
      {
        type: "paragraph",
        text: "Agile is an iterative approach to software delivery that builds software incrementally from the start of the project, rather than delivering it all at the end.",
      },
    ],
  },

  // ------------------------------------------------------------------- OOSE
  {
    slug: "use-case-diagram",
    title: "Use Case Diagrams in UML",
    description:
      "Learn to draw UML use case diagrams — actors, use cases and relationships — for object-oriented analysis.",
    category: "oose",
    subcategory: "analysis",
    contentType: "tutorial",
    tags: ["oose", "uml", "use case", "analysis"],
    authorId: "manoj-purohit",
    publishedDate: "2020-09-09",
    updatedDate: "2026-08-15",
    difficulty: "intermediate",
    readingMinutes: 6,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "A use case diagram is a UML behavioural diagram that shows the interactions between actors (users or external systems) and use cases (functions the system performs).",
      },
    ],
  },

  // ---------------------------------------------------------- CYBER SECURITY
  {
    slug: "types-of-cyber-attacks",
    title: "Types of Cyber Attacks",
    description:
      "An overview of common cyber attacks — malware, phishing, denial of service, man-in-the-middle and SQL injection.",
    category: "cyber-security",
    subcategory: "fundamentals",
    contentType: "notes",
    tags: ["cyber security", "attacks", "malware", "phishing"],
    authorId: "manoj-purohit",
    publishedDate: "2021-02-14",
    updatedDate: "2026-09-08",
    difficulty: "beginner",
    readingMinutes: 7,
    featured: true,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "A cyber attack is an attempt to gain unauthorised access to a computer system to cause damage or steal data. Understanding the common categories is the first step in defending against them.",
      },
      {
        type: "list",
        items: [
          "Malware — malicious software such as viruses, worms and ransomware.",
          "Phishing — fraudulent messages that trick users into revealing credentials.",
          "Denial of Service (DoS) — overwhelming a system so it becomes unavailable.",
          "Man-in-the-middle — intercepting communication between two parties.",
          "SQL injection — inserting malicious SQL into an input field.",
        ],
      },
    ],
  },
  {
    slug: "it-act-2000",
    title: "Information Technology Act, 2000 — Overview",
    description:
      "A summary of the Indian IT Act, 2000, its objectives and key provisions relating to cyber law and electronic records.",
    category: "cyber-security",
    subcategory: "cyber-law",
    contentType: "notes",
    tags: ["cyber law", "it act", "legal", "cyber security"],
    authorId: "manoj-purohit",
    publishedDate: "2021-06-30",
    updatedDate: "2026-06-25",
    difficulty: "beginner",
    readingMinutes: 6,
    body: [
      {
        type: "paragraph",
        text: "The Information Technology Act, 2000 is the primary law in India dealing with cybercrime and electronic commerce. It provides legal recognition to electronic records and digital signatures.",
      },
    ],
  },

  // ------------------------------------------------------- COMPUTER SCIENCE
  {
    slug: "process-scheduling",
    title: "CPU Process Scheduling Algorithms",
    description:
      "Understand CPU scheduling algorithms — FCFS, SJF, Round Robin and Priority scheduling — with examples.",
    category: "computer-science",
    subcategory: "os",
    contentType: "tutorial",
    tags: ["operating systems", "scheduling", "cpu", "computer science"],
    authorId: "manoj-purohit",
    publishedDate: "2020-03-11",
    updatedDate: "2026-09-02",
    difficulty: "intermediate",
    readingMinutes: 9,
    popular: true,
    body: [
      {
        type: "paragraph",
        text: "CPU scheduling determines which process in the ready queue is allocated the CPU. The choice of algorithm affects throughput, turnaround time and waiting time.",
      },
    ],
  },

  // --------------------------------------------------------------- SYLLABUS
  {
    slug: "python-syllabus",
    title: "Python Programming — Course Syllabus",
    description:
      "The complete unit-wise syllabus for the Python Programming course, listing topics and recommended references.",
    category: "python",
    contentType: "syllabus",
    tags: ["python", "syllabus", "course"],
    authorId: "editorial",
    publishedDate: "2022-01-05",
    updatedDate: "2026-01-10",
    readingMinutes: 3,
    body: [
      {
        type: "paragraph",
        text: "Unit-wise breakdown of the Python Programming course used across the semester.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.category === categorySlug);
}

export function getArticlesByType(contentType: string): Article[] {
  return articles.filter((a) => a.contentType === contentType);
}
