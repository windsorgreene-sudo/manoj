import type { Course } from "./types";

// CodeVidya courses for GGSIPU (IP University) computer science subjects.
// Content is exam-oriented and hand-written: theory, code, tables, notes and
// MCQ quizzes. Additional chapters live in extra.ts and are merged in index.ts.

export const courses: Course[] = [
  // ============================================================= C PROGRAMMING
  {
    slug: "c-programming",
    title: "C Programming",
    description: "The foundation language of every BCA and B.Tech first year.",
    longDescription:
      "C is the first programming language in the IPU curriculum. This course covers the structure of a C program, variables, operators, control flow, functions, arrays, pointers and strings, with exam-ready explanations and solved programs.",
    icon: "💻",
    color: "#5468ff",
    difficulty: "beginner",
    category: "Programming",
    tags: ["c", "programming", "bca", "btech", "semester 1"],
    chapters: [
      {
        title: "Getting Started with C",
        lessons: [
          {
            slug: "intro-to-c",
            title: "Introduction to C",
            description: "What C is, its features and the structure of a C program.",
            duration: 7,
            codeLanguage: "c",
            codeExample:
              '#include <stdio.h>\n\nint main() {\n    printf("Hello, IPU!\\n");\n    return 0;\n}',
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "C is a general-purpose, procedural, structured programming language.",
                  "Developed by Dennis Ritchie at Bell Labs in 1972.",
                  "Execution always begins from the main() function.",
                ],
              },
              {
                type: "paragraph",
                text: "C is a general-purpose programming language developed by Dennis Ritchie in 1972 at Bell Laboratories. It is called a middle-level language because it combines the features of high-level and low-level languages. It is the base for many later languages such as C++, Java and Python.",
              },
              { type: "heading", level: 2, id: "features", text: "Features of C" },
              {
                type: "list",
                items: [
                  "Simple and structured language.",
                  "Fast and efficient (close to hardware).",
                  "Portable across machines.",
                  "Rich set of built-in operators and library functions.",
                  "Supports pointers for direct memory access.",
                ],
              },
              { type: "heading", level: 2, id: "structure", text: "Structure of a C program" },
              {
                type: "code",
                block: {
                  language: "c",
                  code: '#include <stdio.h>   // preprocessor directive\n\nint main() {          // main function, entry point\n    printf("Hello, IPU!\\n");\n    return 0;         // returns 0 to the OS\n}',
                },
              },
              {
                type: "table",
                headers: ["Part", "Purpose"],
                rows: [
                  ["#include", "Includes header files like stdio.h"],
                  ["main()", "Entry point where execution starts"],
                  ["printf()", "Prints output to the screen"],
                  ["return 0", "Tells the OS the program ended successfully"],
                ],
              },
              {
                type: "note",
                variant: "tip",
                text: "A common exam question: 'Why is C called a middle-level language?' Answer: it supports low-level features (pointers, bit manipulation) and high-level structured programming.",
              },
            ],
            quiz: [
              {
                question: "Who developed the C language?",
                options: ["James Gosling", "Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum"],
                correct: 1,
                explain: "C was developed by Dennis Ritchie at Bell Labs in 1972.",
              },
              {
                question: "Where does execution of a C program begin?",
                options: ["First function", "main()", "printf()", "The last line"],
                correct: 1,
                explain: "Execution always begins from the main() function.",
              },
              {
                question: "C is often called a:",
                options: ["Low-level language", "Middle-level language", "Markup language", "Query language"],
                correct: 1,
                explain: "C mixes low-level (pointers) and high-level (structured) features, so it is middle-level.",
              },
            ],
          },
          {
            slug: "variables-data-types-c",
            title: "Variables and Data Types",
            description: "Declare variables and use C's fundamental data types.",
            duration: 8,
            codeLanguage: "c",
            codeExample:
              '#include <stdio.h>\nint main() {\n    int age = 20;\n    float marks = 87.5;\n    char grade = \'A\';\n    printf("%d %.1f %c\\n", age, marks, grade);\n    return 0;\n}',
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "A variable is a named memory location.",
                  "You must declare a variable's type before using it.",
                  "Basic types: int, float, double, char.",
                ],
              },
              {
                type: "paragraph",
                text: "A variable is a name given to a memory location that stores a value. In C every variable must be declared with a data type, which decides how much memory it uses and what values it can hold.",
              },
              { type: "heading", level: 2, id: "basic-types", text: "Fundamental data types" },
              {
                type: "table",
                headers: ["Type", "Size (typical)", "Example", "Format specifier"],
                rows: [
                  ["int", "2 or 4 bytes", "int x = 10;", "%d"],
                  ["float", "4 bytes", "float p = 3.14;", "%f"],
                  ["double", "8 bytes", "double d = 3.14159;", "%lf"],
                  ["char", "1 byte", "char c = 'A';", "%c"],
                ],
              },
              {
                type: "code",
                block: {
                  language: "c",
                  code: '#include <stdio.h>\nint main() {\n    int age = 20;\n    float marks = 87.5;\n    char grade = \'A\';\n    printf("Age: %d, Marks: %.1f, Grade: %c\\n", age, marks, grade);\n    return 0;\n}',
                },
              },
              {
                type: "note",
                variant: "warning",
                text: "The format specifier must match the type: %d for int, %f for float, %c for char. A mismatch gives wrong output.",
              },
            ],
            quiz: [
              {
                question: "Which format specifier is used for an integer?",
                options: ["%c", "%f", "%d", "%s"],
                correct: 2,
                explain: "%d is used to read and print integer values.",
              },
              {
                question: "How much memory does a char typically use?",
                options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
                correct: 0,
                explain: "A char occupies 1 byte.",
              },
            ],
          },
          {
            slug: "operators-c",
            title: "Operators in C",
            description: "Arithmetic, relational, logical and assignment operators.",
            duration: 7,
            codeLanguage: "c",
            codeExample:
              "int a = 10, b = 3;\nprintf(\"%d %d %d\", a + b, a % b, a > b);",
            body: [
              {
                type: "paragraph",
                text: "An operator is a symbol that performs an operation on operands. C provides a rich set of operators grouped into several categories.",
              },
              {
                type: "table",
                headers: ["Category", "Operators", "Example"],
                rows: [
                  ["Arithmetic", "+ - * / %", "a + b"],
                  ["Relational", "< > <= >= == !=", "a > b"],
                  ["Logical", "&& || !", "a > 0 && b > 0"],
                  ["Assignment", "= += -= *= /=", "a += 5"],
                  ["Increment/Decrement", "++ --", "a++"],
                ],
              },
              {
                type: "note",
                variant: "info",
                text: "The modulus operator % gives the remainder and works only with integers. 10 % 3 is 1.",
              },
            ],
            quiz: [
              {
                question: "What does 17 % 5 evaluate to?",
                options: ["3", "2", "3.4", "0"],
                correct: 1,
                explain: "17 divided by 5 leaves a remainder of 2.",
              },
              {
                question: "Which is a logical operator?",
                options: ["%", "&&", "+=", ">"],
                correct: 1,
                explain: "&& is the logical AND operator.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= PYTHON
  {
    slug: "python-programming",
    title: "Python Programming",
    description: "A beginner-friendly language used across the IPU syllabus.",
    longDescription:
      "Python is widely taught in BCA and B.Tech for its clean syntax. This course covers input/output, data types, control flow, functions, strings, lists, dictionaries and file handling, with runnable examples.",
    icon: "🐍",
    color: "#3776ab",
    difficulty: "beginner",
    category: "Programming",
    tags: ["python", "programming", "bca", "scripting"],
    chapters: [
      {
        title: "Python Basics",
        lessons: [
          {
            slug: "intro-python",
            title: "Introduction to Python",
            description: "Why Python, its features and your first program.",
            duration: 6,
            codeLanguage: "python",
            codeExample: "print('Hello, IPU!')\nname = input('Your name: ')\nprint('Welcome,', name)",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "Python is a high-level, interpreted, general-purpose language.",
                  "Created by Guido van Rossum in 1991.",
                  "Indentation defines blocks; no braces or semicolons.",
                ],
              },
              {
                type: "paragraph",
                text: "Python is a high-level, interpreted programming language known for simple, readable syntax. It was created by Guido van Rossum and released in 1991. It is used in web development, data science, automation and AI.",
              },
              { type: "heading", level: 2, id: "features", text: "Features of Python" },
              {
                type: "list",
                items: [
                  "Simple and easy to read (English-like syntax).",
                  "Interpreted, so no separate compilation step.",
                  "Dynamically typed (no need to declare types).",
                  "Large standard library and huge community.",
                  "Cross-platform and free/open source.",
                ],
              },
              {
                type: "code",
                block: {
                  language: "python",
                  code: "print('Hello, IPU!')\n# Output: Hello, IPU!",
                },
              },
              {
                type: "note",
                variant: "tip",
                text: "Run this example in the playground on this page. Python code runs top to bottom, one statement at a time.",
              },
            ],
            quiz: [
              {
                question: "Who created Python?",
                options: ["Dennis Ritchie", "Guido van Rossum", "James Gosling", "Linus Torvalds"],
                correct: 1,
                explain: "Python was created by Guido van Rossum, released in 1991.",
              },
              {
                question: "Python is a ___ language.",
                options: ["Compiled", "Interpreted", "Assembly", "Markup"],
                correct: 1,
                explain: "Python is interpreted; code runs line by line without a separate compile step.",
              },
              {
                question: "How are code blocks defined in Python?",
                options: ["Curly braces { }", "Indentation", "Semicolons", "The word 'begin'"],
                correct: 1,
                explain: "Python uses indentation to define blocks.",
              },
            ],
          },
          {
            slug: "python-data-types",
            title: "Variables and Data Types",
            description: "Numbers, strings, booleans and dynamic typing.",
            duration: 7,
            codeLanguage: "python",
            codeExample:
              "n = 10\npi = 3.14\nname = 'Riya'\nactive = True\nprint(type(n), type(pi), type(name), type(active))",
            body: [
              {
                type: "paragraph",
                text: "In Python you do not declare a type; it is inferred from the value assigned. This is called dynamic typing.",
              },
              {
                type: "table",
                headers: ["Type", "Example", "Description"],
                rows: [
                  ["int", "10", "Whole numbers"],
                  ["float", "3.14", "Decimal numbers"],
                  ["str", "'Riya'", "Text"],
                  ["bool", "True / False", "Boolean values"],
                ],
              },
              {
                type: "code",
                block: {
                  language: "python",
                  code: "n = 10          # int\npi = 3.14       # float\nname = 'Riya'   # str\nactive = True   # bool\nprint(type(name))  # <class 'str'>",
                },
              },
            ],
            quiz: [
              {
                question: "What is the type of the value 3.14?",
                options: ["int", "float", "str", "bool"],
                correct: 1,
                explain: "Numbers with a decimal point are of type float.",
              },
            ],
          },
          {
            slug: "python-control-flow",
            title: "Control Flow",
            description: "Make decisions with if, elif and else.",
            duration: 7,
            codeLanguage: "python",
            codeExample:
              "marks = 78\nif marks >= 75:\n    print('Distinction')\nelif marks >= 40:\n    print('Pass')\nelse:\n    print('Fail')",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "if runs a block when a condition is True.",
                  "elif adds more conditions; else is the fallback.",
                  "Indentation decides which lines belong to a block.",
                ],
              },
              {
                type: "code",
                block: {
                  language: "python",
                  code: "marks = 78\nif marks >= 75:\n    print('Distinction')\nelif marks >= 40:\n    print('Pass')\nelse:\n    print('Fail')\n# Output: Distinction",
                },
              },
            ],
            quiz: [
              {
                question: "What keyword means 'else if' in Python?",
                options: ["elseif", "elif", "elsif", "ei"],
                correct: 1,
                explain: "Python uses elif for additional conditions.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= DATA STRUCTURES
  {
    slug: "data-structures",
    title: "Data Structures",
    description: "A high-weightage exam subject for BCA and B.Tech.",
    longDescription:
      "Data Structures teaches how to organise data efficiently. This course covers arrays, linked lists, stacks, queues, trees, searching and sorting, with complexity analysis and exam-style questions.",
    icon: "🧩",
    color: "#7c3aed",
    difficulty: "intermediate",
    category: "Core CS",
    tags: ["dsa", "data structures", "algorithms", "bca", "btech"],
    chapters: [
      {
        title: "Foundations",
        lessons: [
          {
            slug: "intro-data-structures",
            title: "Introduction to Data Structures",
            description: "What data structures are and their classification.",
            duration: 7,
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "A data structure is a way to store and organise data.",
                  "Linear: array, stack, queue, linked list.",
                  "Non-linear: tree, graph.",
                ],
              },
              {
                type: "paragraph",
                text: "A data structure is a particular way of organising and storing data in a computer so that it can be accessed and modified efficiently. Choosing the right structure makes algorithms faster and code cleaner.",
              },
              { type: "heading", level: 2, id: "classification", text: "Classification" },
              {
                type: "table",
                headers: ["Type", "Examples"],
                rows: [
                  ["Linear", "Array, Stack, Queue, Linked List"],
                  ["Non-linear", "Tree, Graph"],
                  ["Static", "Array (fixed size)"],
                  ["Dynamic", "Linked List (grows at runtime)"],
                ],
              },
              {
                type: "note",
                variant: "tip",
                text: "Exam tip: 'linear' means elements are in a sequence; 'non-linear' means an element can connect to many others (like a tree or graph).",
              },
            ],
            quiz: [
              {
                question: "Which of these is a non-linear data structure?",
                options: ["Array", "Stack", "Queue", "Tree"],
                correct: 3,
                explain: "A tree is non-linear; the others are linear.",
              },
              {
                question: "A linked list is best described as a ___ structure.",
                options: ["Static", "Dynamic", "Fixed", "Sorted"],
                correct: 1,
                explain: "A linked list grows and shrinks at runtime, so it is dynamic.",
              },
            ],
          },
          {
            slug: "big-o",
            title: "Time Complexity and Big-O",
            description: "Measure how algorithms scale with input size.",
            duration: 8,
            codeLanguage: "c",
            codeExample:
              "// Linear search: O(n)\nfor (int i = 0; i < n; i++)\n    if (arr[i] == key) return i;",
            body: [
              {
                type: "paragraph",
                text: "Big-O notation describes how the running time of an algorithm grows as the input size n increases. We focus on the worst case as n gets large.",
              },
              {
                type: "table",
                headers: ["Big-O", "Name", "Example"],
                rows: [
                  ["O(1)", "Constant", "Access arr[i]"],
                  ["O(log n)", "Logarithmic", "Binary search"],
                  ["O(n)", "Linear", "Linear search"],
                  ["O(n log n)", "Linearithmic", "Merge sort"],
                  ["O(n^2)", "Quadratic", "Bubble sort"],
                ],
              },
            ],
            quiz: [
              {
                question: "What is the time complexity of binary search?",
                options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
                correct: 2,
                explain: "Binary search halves the search space each step, giving O(log n).",
              },
              {
                question: "Bubble sort has a worst-case complexity of:",
                options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
                correct: 2,
                explain: "Bubble sort uses nested loops, giving O(n^2).",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= DBMS & SQL
  {
    slug: "dbms-sql",
    title: "DBMS & SQL",
    description: "Database management concepts and SQL for the DBMS paper.",
    longDescription:
      "The DBMS course covers database concepts, the relational model, keys, normalization and SQL queries. It is a scoring theory-plus-practical subject in the IPU syllabus.",
    icon: "🗃️",
    color: "#0f766e",
    difficulty: "beginner",
    category: "Core CS",
    tags: ["dbms", "sql", "database", "bca", "mca"],
    chapters: [
      {
        title: "Database Concepts",
        lessons: [
          {
            slug: "intro-dbms",
            title: "Introduction to DBMS",
            description: "What a DBMS is and its advantages over file systems.",
            duration: 7,
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "A DBMS is software to store, manage and query data.",
                  "It removes redundancy and enforces consistency.",
                  "Examples: MySQL, Oracle, PostgreSQL.",
                ],
              },
              {
                type: "paragraph",
                text: "A Database Management System (DBMS) is software that lets users define, create, store and query databases. Compared to a traditional file system, it controls redundancy, keeps data consistent and provides security and concurrent access.",
              },
              { type: "heading", level: 2, id: "advantages", text: "Advantages of DBMS" },
              {
                type: "list",
                items: [
                  "Controls data redundancy (no repeated data).",
                  "Ensures data consistency and integrity.",
                  "Provides security through access control.",
                  "Allows many users to access data at once.",
                  "Supports backup and recovery.",
                ],
              },
              {
                type: "note",
                variant: "info",
                text: "Common exam question: 'DBMS vs File system'. Key point: a file system has high redundancy and no easy way to enforce relationships; a DBMS solves both.",
              },
            ],
            quiz: [
              {
                question: "Which is NOT an advantage of a DBMS?",
                options: [
                  "Controls redundancy",
                  "Ensures consistency",
                  "Increases data duplication",
                  "Provides security",
                ],
                correct: 2,
                explain: "A DBMS reduces duplication; increasing it is not an advantage.",
              },
              {
                question: "Which of these is a DBMS?",
                options: ["MySQL", "HTML", "Linux", "Photoshop"],
                correct: 0,
                explain: "MySQL is a relational database management system.",
              },
            ],
          },
          {
            slug: "sql-select",
            title: "SQL: SELECT and WHERE",
            description: "Read and filter data from tables.",
            duration: 8,
            codeLanguage: "sql",
            codeExample: "SELECT name, marks FROM students WHERE marks >= 40 ORDER BY marks DESC;",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "SELECT chooses columns to read.",
                  "WHERE filters rows by a condition.",
                  "ORDER BY sorts the result.",
                ],
              },
              {
                type: "paragraph",
                text: "SQL (Structured Query Language) is the standard language for relational databases. The SELECT statement retrieves data, WHERE filters it, and ORDER BY sorts it.",
              },
              {
                type: "code",
                block: {
                  language: "sql",
                  code: "SELECT name, marks\nFROM students\nWHERE marks >= 40\nORDER BY marks DESC;",
                },
              },
              {
                type: "table",
                headers: ["Clause", "Purpose"],
                rows: [
                  ["SELECT", "Choose which columns to return"],
                  ["FROM", "The table to read from"],
                  ["WHERE", "Filter rows by a condition"],
                  ["ORDER BY", "Sort the result set"],
                ],
              },
            ],
            quiz: [
              {
                question: "Which clause filters rows in a query?",
                options: ["SELECT", "FROM", "WHERE", "ORDER BY"],
                correct: 2,
                explain: "WHERE filters which rows are returned.",
              },
              {
                question: "What does SELECT * mean?",
                options: ["Select nothing", "Select all columns", "Delete rows", "Sort data"],
                correct: 1,
                explain: "The asterisk (*) selects all columns of the table.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= OOP WITH JAVA
  {
    slug: "oop-java",
    title: "OOP with Java (OOPJ)",
    description: "Object-oriented programming for the OOPJ paper.",
    longDescription:
      "Object-Oriented Programming with Java (OOPJ) is a core IPU subject. This course covers classes, objects, the four pillars of OOP, inheritance, polymorphism and exception handling with clear examples.",
    icon: "☕",
    color: "#e76f00",
    difficulty: "intermediate",
    category: "Programming",
    tags: ["java", "oop", "oopj", "bca", "btech"],
    chapters: [
      {
        title: "OOP Fundamentals",
        lessons: [
          {
            slug: "oop-concepts",
            title: "The Four Pillars of OOP",
            description: "Encapsulation, abstraction, inheritance and polymorphism.",
            duration: 8,
            codeLanguage: "java",
            codeExample:
              "class Student {\n    private int roll;      // encapsulation\n    public int getRoll() { return roll; }\n}",
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "Encapsulation: bind data and methods together, hide details.",
                  "Abstraction: show only essential features.",
                  "Inheritance: reuse a parent class in a child class.",
                  "Polymorphism: one name, many forms.",
                ],
              },
              {
                type: "paragraph",
                text: "Object-Oriented Programming (OOP) organises software around objects, which bundle data (fields) and behaviour (methods). Java is a pure OOP language built on four core principles.",
              },
              {
                type: "table",
                headers: ["Pillar", "Meaning"],
                rows: [
                  ["Encapsulation", "Wrapping data and code together, hiding internals"],
                  ["Abstraction", "Showing only what matters, hiding complexity"],
                  ["Inheritance", "A class acquiring properties of another class"],
                  ["Polymorphism", "The same method behaving differently by context"],
                ],
              },
              {
                type: "note",
                variant: "tip",
                text: "Memory aid: 'A PIE' = Abstraction, Polymorphism, Inheritance, Encapsulation. This is a very common OOPJ exam question.",
              },
            ],
            quiz: [
              {
                question: "Which pillar means 'hiding internal details'?",
                options: ["Inheritance", "Polymorphism", "Encapsulation", "Recursion"],
                correct: 2,
                explain: "Encapsulation binds data with methods and hides internal details.",
              },
              {
                question: "How many core pillars does OOP have?",
                options: ["2", "3", "4", "5"],
                correct: 2,
                explain: "The four pillars are abstraction, encapsulation, inheritance and polymorphism.",
              },
            ],
          },
          {
            slug: "classes-objects-java",
            title: "Classes and Objects",
            description: "Define a class and create objects from it.",
            duration: 8,
            codeLanguage: "java",
            codeExample:
              "class Car {\n    String brand;\n    void horn() { System.out.println(brand + \" beep!\"); }\n}\n\npublic class Main {\n    public static void main(String[] a) {\n        Car c = new Car();\n        c.brand = \"Tata\";\n        c.horn();\n    }\n}",
            body: [
              {
                type: "paragraph",
                text: "A class is a blueprint that defines the fields and methods of a type. An object is an instance of a class created with the new keyword.",
              },
              {
                type: "code",
                block: {
                  language: "java",
                  code: "class Car {\n    String brand;\n    void horn() {\n        System.out.println(brand + \" beep!\");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car c = new Car();   // object created\n        c.brand = \"Tata\";\n        c.horn();            // Tata beep!\n    }\n}",
                },
              },
            ],
            quiz: [
              {
                question: "Which keyword creates an object in Java?",
                options: ["object", "new", "create", "class"],
                correct: 1,
                explain: "The new keyword allocates and creates a new object.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= OPERATING SYSTEMS
  {
    slug: "operating-systems",
    title: "Operating Systems",
    description: "Processes, scheduling, memory and more for the OS paper.",
    longDescription:
      "The Operating Systems course covers what an OS does, process management, CPU scheduling, deadlocks and memory management. It is a theory-heavy IPU subject ideal for note-based revision.",
    icon: "🖥️",
    color: "#0284c7",
    difficulty: "intermediate",
    category: "Core CS",
    tags: ["operating systems", "os", "btech", "mca"],
    chapters: [
      {
        title: "OS Fundamentals",
        lessons: [
          {
            slug: "intro-os",
            title: "Introduction to Operating Systems",
            description: "What an OS is and the functions it performs.",
            duration: 7,
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "An OS manages hardware and software resources.",
                  "It sits between the user and the hardware.",
                  "Examples: Windows, Linux, macOS, Android.",
                ],
              },
              {
                type: "paragraph",
                text: "An Operating System (OS) is system software that manages computer hardware and software resources and provides common services for programs. It acts as an interface between the user and the hardware.",
              },
              { type: "heading", level: 2, id: "functions", text: "Functions of an OS" },
              {
                type: "list",
                items: [
                  "Process management (creating, scheduling, terminating processes).",
                  "Memory management (allocating and freeing memory).",
                  "File management (organising files and directories).",
                  "Device / I/O management.",
                  "Security and access control.",
                ],
              },
              {
                type: "note",
                variant: "info",
                text: "Exam point: the OS is a resource manager. Its main job is to allocate resources (CPU, memory, devices) efficiently and fairly.",
              },
            ],
            quiz: [
              {
                question: "The OS acts as an interface between:",
                options: [
                  "Two programs",
                  "The user and the hardware",
                  "Two users",
                  "The internet and files",
                ],
                correct: 1,
                explain: "The OS sits between the user/applications and the hardware.",
              },
              {
                question: "Which is NOT a function of an OS?",
                options: ["Process management", "Memory management", "Compiling C code", "File management"],
                correct: 2,
                explain: "Compiling source code is the compiler's job, not the OS's core function.",
              },
            ],
          },
          {
            slug: "cpu-scheduling",
            title: "CPU Scheduling",
            description: "FCFS, SJF, Round Robin and Priority scheduling.",
            duration: 9,
            body: [
              {
                type: "paragraph",
                text: "CPU scheduling decides which process in the ready queue gets the CPU next. A good algorithm improves throughput and reduces waiting time.",
              },
              {
                type: "table",
                headers: ["Algorithm", "Idea", "Note"],
                rows: [
                  ["FCFS", "First come, first served", "Simple but can cause long waits"],
                  ["SJF", "Shortest job first", "Optimal average waiting time"],
                  ["Round Robin", "Fixed time slice per process", "Good for time-sharing"],
                  ["Priority", "Highest priority first", "Can cause starvation"],
                ],
              },
              {
                type: "note",
                variant: "warning",
                text: "Priority scheduling can cause 'starvation' where low-priority processes wait forever. The solution is 'aging' (slowly raising priority over time).",
              },
            ],
            quiz: [
              {
                question: "Which scheduling algorithm gives the optimal average waiting time?",
                options: ["FCFS", "SJF", "Round Robin", "Priority"],
                correct: 1,
                explain: "Shortest Job First (SJF) gives the minimum average waiting time.",
              },
              {
                question: "Round Robin scheduling is based on:",
                options: ["Job length", "A fixed time quantum", "Priority", "Arrival only"],
                correct: 1,
                explain: "Round Robin gives each process a fixed time slice (quantum) in turn.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= COMPUTER NETWORKS
  {
    slug: "computer-networks",
    title: "Computer Networks",
    description: "OSI model, protocols and networking basics.",
    longDescription:
      "Computer Networks covers how computers communicate: network types, the OSI and TCP/IP models, and common protocols. A frequently examined IPU subject.",
    icon: "🌐",
    color: "#0d9488",
    difficulty: "intermediate",
    category: "Core CS",
    tags: ["computer networks", "osi", "tcp/ip", "btech"],
    chapters: [
      {
        title: "Networking Basics",
        lessons: [
          {
            slug: "intro-networks",
            title: "Introduction to Networks",
            description: "What a network is and its types (LAN, MAN, WAN).",
            duration: 7,
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "A network connects devices to share data and resources.",
                  "LAN is small (a lab), WAN is large (the internet).",
                  "Topologies: bus, star, ring, mesh.",
                ],
              },
              {
                type: "paragraph",
                text: "A computer network is a collection of interconnected devices that can share data and resources. Networks are classified by size and reach.",
              },
              {
                type: "table",
                headers: ["Type", "Full form", "Scope"],
                rows: [
                  ["LAN", "Local Area Network", "A room or building"],
                  ["MAN", "Metropolitan Area Network", "A city"],
                  ["WAN", "Wide Area Network", "Countries (e.g. the internet)"],
                ],
              },
            ],
            quiz: [
              {
                question: "The internet is an example of a:",
                options: ["LAN", "MAN", "WAN", "PAN"],
                correct: 2,
                explain: "The internet spans the globe, so it is a Wide Area Network (WAN).",
              },
              {
                question: "Which network covers the smallest area?",
                options: ["WAN", "MAN", "LAN", "Internet"],
                correct: 2,
                explain: "A LAN (Local Area Network) covers the smallest area, like a lab.",
              },
            ],
          },
          {
            slug: "osi-model",
            title: "The OSI Model",
            description: "The seven layers of network communication.",
            duration: 9,
            body: [
              {
                type: "paragraph",
                text: "The OSI (Open Systems Interconnection) model divides network communication into seven layers, each with a specific role. It is a reference model used to understand how data moves across a network.",
              },
              {
                type: "table",
                headers: ["Layer", "Name", "Role"],
                rows: [
                  ["7", "Application", "User-facing services (HTTP, FTP)"],
                  ["6", "Presentation", "Encryption, formatting"],
                  ["5", "Session", "Managing connections"],
                  ["4", "Transport", "Reliable delivery (TCP, UDP)"],
                  ["3", "Network", "Routing (IP)"],
                  ["2", "Data Link", "MAC addresses, frames"],
                  ["1", "Physical", "Cables, signals"],
                ],
              },
              {
                type: "note",
                variant: "tip",
                text: "Mnemonic (top to bottom): 'All People Seem To Need Data Processing'. This helps recall the seven layers in exams.",
              },
            ],
            quiz: [
              {
                question: "How many layers are in the OSI model?",
                options: ["4", "5", "7", "8"],
                correct: 2,
                explain: "The OSI model has seven layers.",
              },
              {
                question: "Which layer handles routing using IP addresses?",
                options: ["Transport", "Network", "Data Link", "Physical"],
                correct: 1,
                explain: "The Network layer (layer 3) handles logical addressing and routing (IP).",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= WEB TECHNOLOGY
  {
    slug: "web-technology",
    title: "Web Technology",
    description: "HTML, CSS and JavaScript for the web technology paper.",
    longDescription:
      "Web Technology introduces building web pages with HTML, styling with CSS and adding interactivity with JavaScript. Practical and scoring for IPU practical exams.",
    icon: "🕸️",
    color: "#d63384",
    difficulty: "beginner",
    category: "Web",
    tags: ["web", "html", "css", "javascript", "bca"],
    chapters: [
      {
        title: "HTML & CSS",
        lessons: [
          {
            slug: "html-basics",
            title: "HTML Basics",
            description: "Structure a web page with HTML tags.",
            duration: 7,
            codeLanguage: "html",
            codeExample:
              '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>My Page</h1>\n    <p>Hello, IPU!</p>\n  </body>\n</html>',
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "HTML structures a web page using tags.",
                  "Tags usually come in pairs: <p> ... </p>.",
                  "The <body> holds visible content.",
                ],
              },
              {
                type: "paragraph",
                text: "HTML (HyperText Markup Language) is the standard language for creating web pages. It uses tags to describe the structure of content such as headings, paragraphs, links and images.",
              },
              {
                type: "code",
                block: {
                  language: "html",
                  code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>My Page</h1>\n    <p>Hello, IPU!</p>\n  </body>\n</html>',
                },
              },
            ],
            quiz: [
              {
                question: "What does HTML stand for?",
                options: [
                  "HyperText Markup Language",
                  "HighText Machine Language",
                  "Hyper Transfer Markup Language",
                  "Home Tool Markup Language",
                ],
                correct: 0,
                explain: "HTML = HyperText Markup Language.",
              },
              {
                question: "Which tag holds the visible content?",
                options: ["<head>", "<title>", "<body>", "<meta>"],
                correct: 2,
                explain: "The <body> element contains everything visible on the page.",
              },
            ],
          },
          {
            slug: "css-basics-web",
            title: "Styling with CSS",
            description: "Add colours, fonts and layout with CSS.",
            duration: 7,
            codeLanguage: "css",
            codeExample: "h1 { color: #5468ff; text-align: center; }\np { font-size: 16px; }",
            body: [
              {
                type: "paragraph",
                text: "CSS (Cascading Style Sheets) controls the appearance of HTML: colours, fonts, spacing and layout. Rules target elements with selectors.",
              },
              {
                type: "code",
                block: {
                  language: "css",
                  code: "h1 {\n  color: #5468ff;\n  text-align: center;\n}\np {\n  font-size: 16px;\n  line-height: 1.6;\n}",
                },
              },
            ],
            quiz: [
              {
                question: "What does CSS stand for?",
                options: [
                  "Cascading Style Sheets",
                  "Computer Style System",
                  "Creative Styling Syntax",
                  "Colorful Style Sheets",
                ],
                correct: 0,
                explain: "CSS = Cascading Style Sheets.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================= SOFTWARE ENGINEERING
  {
    slug: "software-engineering",
    title: "Software Engineering",
    description: "SDLC, process models and testing for the SE paper.",
    longDescription:
      "Software Engineering teaches how software is built systematically: the software development life cycle, process models (waterfall, agile), requirements and testing. A theory-focused IPU subject.",
    icon: "🛠️",
    color: "#9333ea",
    difficulty: "beginner",
    category: "Core CS",
    tags: ["software engineering", "sdlc", "agile", "btech", "mca"],
    chapters: [
      {
        title: "Process & Models",
        lessons: [
          {
            slug: "sdlc",
            title: "Software Development Life Cycle",
            description: "The phases every software project goes through.",
            duration: 7,
            body: [
              {
                type: "keypoints",
                title: "Quick summary",
                items: [
                  "SDLC is a structured process to build quality software.",
                  "Phases: requirements, design, coding, testing, deployment, maintenance.",
                ],
              },
              {
                type: "paragraph",
                text: "The Software Development Life Cycle (SDLC) is a structured sequence of phases used to design, build, test and maintain software. Each phase produces deliverables that feed the next.",
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
              {
                type: "note",
                variant: "tip",
                text: "Exam tip: remember the order. Requirements come first, maintenance is last and is usually the longest and most expensive phase.",
              },
            ],
            quiz: [
              {
                question: "Which SDLC phase usually comes first?",
                options: ["Testing", "Coding", "Requirement analysis", "Deployment"],
                correct: 2,
                explain: "Requirement analysis is the first phase of the SDLC.",
              },
              {
                question: "Which phase is typically the longest and costliest?",
                options: ["Design", "Maintenance", "Coding", "Testing"],
                correct: 1,
                explain: "Maintenance runs for the software's whole life, making it the longest and costliest.",
              },
            ],
          },
          {
            slug: "process-models",
            title: "Process Models",
            description: "Waterfall vs Agile development.",
            duration: 8,
            body: [
              {
                type: "paragraph",
                text: "A process model defines how the SDLC phases are arranged. The two most examined models are the Waterfall model and the Agile model.",
              },
              {
                type: "table",
                headers: ["Aspect", "Waterfall", "Agile"],
                rows: [
                  ["Flow", "Sequential (one phase after another)", "Iterative (small cycles)"],
                  ["Changes", "Hard to change later", "Easily accommodates change"],
                  ["Delivery", "One final delivery", "Frequent working releases"],
                  ["Best for", "Fixed, clear requirements", "Evolving requirements"],
                ],
              },
            ],
            quiz: [
              {
                question: "The Waterfall model is:",
                options: ["Iterative", "Sequential", "Circular", "Random"],
                correct: 1,
                explain: "Waterfall moves sequentially through phases, one after another.",
              },
              {
                question: "Which model handles changing requirements best?",
                options: ["Waterfall", "Agile", "Neither", "Both equally"],
                correct: 1,
                explain: "Agile is iterative and welcomes changing requirements.",
              },
            ],
          },
        ],
      },
    ],
  },
];
