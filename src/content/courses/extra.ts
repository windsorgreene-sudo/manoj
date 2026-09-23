import type { Chapter } from "./types";

// Additional chapters, keyed by course slug. Merged into the base courses in
// data.ts so course files stay readable. All content is hand-written and
// exam-oriented for GGSIPU students.

export const extraChapters: Record<string, Chapter[]> = {
  // --------------------------------------------------------------- C
  "c-programming": [
    {
      title: "Control Flow & Loops",
      lessons: [
        {
          slug: "if-else-c",
          title: "Decision Making (if-else)",
          description: "Branch your program with if, else if and else.",
          duration: 7,
          codeLanguage: "c",
          codeExample:
            "int n = 7;\nif (n % 2 == 0) printf(\"Even\");\nelse printf(\"Odd\");",
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "if runs a block when a condition is true.",
                "else if adds more conditions; else is the fallback.",
                "Conditions use relational and logical operators.",
              ],
            },
            {
              type: "code",
              block: {
                language: "c",
                code: "#include <stdio.h>\nint main() {\n    int marks = 82;\n    if (marks >= 75) printf(\"Distinction\\n\");\n    else if (marks >= 40) printf(\"Pass\\n\");\n    else printf(\"Fail\\n\");\n    return 0;\n}",
              },
            },
          ],
          quiz: [
            {
              question: "What prints for marks = 82 in the example?",
              options: ["Distinction", "Pass", "Fail", "Nothing"],
              correct: 0,
              explain: "82 >= 75, so the first branch runs: Distinction.",
            },
          ],
        },
        {
          slug: "loops-c",
          title: "Loops (for, while)",
          description: "Repeat statements with for and while loops.",
          duration: 8,
          codeLanguage: "c",
          codeExample: "for (int i = 1; i <= 5; i++)\n    printf(\"%d \", i);",
          body: [
            {
              type: "paragraph",
              text: "Loops repeat a block of statements. Use a for loop when you know how many times to repeat, and a while loop when repetition depends on a condition.",
            },
            {
              type: "code",
              block: {
                language: "c",
                code: "// Print 1 to 5\nfor (int i = 1; i <= 5; i++) {\n    printf(\"%d \", i);\n}\n// Output: 1 2 3 4 5",
              },
            },
            {
              type: "table",
              headers: ["Loop", "Use when"],
              rows: [
                ["for", "Count of iterations is known"],
                ["while", "Repeat while a condition is true"],
                ["do-while", "Run at least once, then check"],
              ],
            },
          ],
          quiz: [
            {
              question: "Which loop always runs at least once?",
              options: ["for", "while", "do-while", "none"],
              correct: 2,
              explain: "do-while checks the condition after the body, so it runs at least once.",
            },
          ],
        },
      ],
    },
    {
      title: "Functions & Pointers",
      lessons: [
        {
          slug: "functions-c",
          title: "Functions in C",
          description: "Break programs into reusable functions.",
          duration: 8,
          codeLanguage: "c",
          codeExample:
            "int add(int a, int b) { return a + b; }\nprintf(\"%d\", add(2, 3));",
          body: [
            {
              type: "paragraph",
              text: "A function is a self-contained block of code that performs a task. Functions improve reusability and make large programs easier to manage.",
            },
            {
              type: "code",
              block: {
                language: "c",
                code: "#include <stdio.h>\nint add(int a, int b) {   // function definition\n    return a + b;\n}\nint main() {\n    printf(\"%d\\n\", add(2, 3));  // 5\n    return 0;\n}",
              },
            },
          ],
          quiz: [
            {
              question: "What does a function's return type specify?",
              options: [
                "The type of value it gives back",
                "Its name",
                "The number of parameters",
                "Where it is called",
              ],
              correct: 0,
              explain: "The return type declares what kind of value the function returns.",
            },
          ],
        },
        {
          slug: "pointers-c",
          title: "Pointers",
          description: "Variables that store memory addresses.",
          duration: 9,
          codeLanguage: "c",
          codeExample:
            "int x = 10;\nint *p = &x;\nprintf(\"%d %d\", x, *p);",
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "A pointer stores the address of another variable.",
                "& gives an address; * gives the value at an address.",
                "Pointers enable dynamic memory and pass-by-reference.",
              ],
            },
            {
              type: "code",
              block: {
                language: "c",
                code: "#include <stdio.h>\nint main() {\n    int x = 10;\n    int *p = &x;       // p holds address of x\n    printf(\"%d\\n\", *p); // 10 (value at address)\n    return 0;\n}",
              },
            },
            {
              type: "note",
              variant: "warning",
              text: "Always initialise pointers. Using an uninitialised (wild) pointer causes undefined behaviour, a favourite exam trap.",
            },
          ],
          quiz: [
            {
              question: "The & operator returns the ___ of a variable.",
              options: ["value", "address", "type", "size"],
              correct: 1,
              explain: "& is the address-of operator; it returns the memory address.",
            },
            {
              question: "The * operator (on a pointer) gives the:",
              options: ["Address", "Value stored at that address", "Type", "Name"],
              correct: 1,
              explain: "Dereferencing with * gives the value stored at the pointer's address.",
            },
          ],
        },
      ],
    },
  ],

  // --------------------------------------------------------------- PYTHON
  "python-programming": [
    {
      title: "Loops and Functions",
      lessons: [
        {
          slug: "loops-py",
          title: "Loops in Python",
          description: "Repeat with for and while.",
          duration: 7,
          codeLanguage: "python",
          codeExample: "for i in range(1, 6):\n    print(i, end=' ')",
          body: [
            {
              type: "paragraph",
              text: "Python for loops iterate over a sequence such as a range or a list. while loops repeat as long as a condition is true.",
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "for i in range(1, 6):\n    print(i, end=' ')\n# 1 2 3 4 5\n\nn = 3\nwhile n > 0:\n    print(n)\n    n -= 1",
              },
            },
          ],
          quiz: [
            {
              question: "range(1, 6) produces:",
              options: ["1 2 3 4 5", "1 2 3 4 5 6", "0 1 2 3 4 5", "1 to 6 inclusive"],
              correct: 0,
              explain: "range(1, 6) yields 1, 2, 3, 4, 5 (stops before 6).",
            },
          ],
        },
        {
          slug: "functions-py",
          title: "Functions",
          description: "Define reusable logic with def.",
          duration: 7,
          codeLanguage: "python",
          codeExample: "def square(n):\n    return n * n\nprint(square(5))",
          body: [
            {
              type: "paragraph",
              text: "Functions in Python are defined with the def keyword. They can take parameters and return a value.",
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "def square(n):\n    return n * n\n\nprint(square(5))  # 25",
              },
            },
          ],
          quiz: [
            {
              question: "Which keyword defines a function in Python?",
              options: ["func", "def", "function", "define"],
              correct: 1,
              explain: "Python uses def to define a function.",
            },
          ],
        },
      ],
    },
    {
      title: "Data Structures in Python",
      lessons: [
        {
          slug: "lists-py",
          title: "Lists",
          description: "Ordered, changeable collections.",
          duration: 7,
          codeLanguage: "python",
          codeExample: "nums = [3, 1, 2]\nnums.append(4)\nnums.sort()\nprint(nums)",
          body: [
            {
              type: "paragraph",
              text: "A list is an ordered, mutable collection. You can add, remove, sort and index items.",
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "nums = [3, 1, 2]\nnums.append(4)   # [3, 1, 2, 4]\nnums.sort()      # [1, 2, 3, 4]\nprint(nums[0])   # 1",
              },
            },
          ],
          quiz: [
            {
              question: "Which method adds an item to the end of a list?",
              options: ["add()", "push()", "append()", "insert()"],
              correct: 2,
              explain: "append() adds to the end of a Python list.",
            },
          ],
        },
        {
          slug: "dict-py",
          title: "Dictionaries",
          description: "Store data as key-value pairs.",
          duration: 6,
          codeLanguage: "python",
          codeExample: "s = {'name': 'Riya', 'roll': 12}\nprint(s['name'])",
          body: [
            {
              type: "paragraph",
              text: "A dictionary stores data as key-value pairs. You look up a value by its key, not by position.",
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "student = {'name': 'Riya', 'roll': 12}\nprint(student['name'])   # Riya\nstudent['branch'] = 'BCA'  # add a key",
              },
            },
          ],
          quiz: [
            {
              question: "Dictionary values are accessed by their:",
              options: ["Index", "Key", "Position", "Type"],
              correct: 1,
              explain: "Dictionary values are looked up by their key.",
            },
          ],
        },
      ],
    },
  ],

  // --------------------------------------------------------- DATA STRUCTURES
  "data-structures": [
    {
      title: "Linear Structures",
      lessons: [
        {
          slug: "stack",
          title: "Stack (LIFO)",
          description: "A last-in, first-out data structure.",
          duration: 8,
          codeLanguage: "c",
          codeExample: "// push, pop, peek work at the 'top' only",
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "A stack follows Last In, First Out (LIFO).",
                "Main operations: push, pop, peek.",
                "Used in function calls, undo, expression evaluation.",
              ],
            },
            {
              type: "paragraph",
              text: "A stack is a linear data structure that follows the LIFO principle: the last element added is the first one removed. Think of a stack of plates.",
            },
            {
              type: "table",
              headers: ["Operation", "Meaning"],
              rows: [
                ["push", "Add an element to the top"],
                ["pop", "Remove the top element"],
                ["peek / top", "View the top without removing"],
                ["isEmpty", "Check if the stack is empty"],
              ],
            },
            {
              type: "note",
              variant: "info",
              text: "Real uses: the function call stack, browser back button, and undo in editors all use a stack.",
            },
          ],
          quiz: [
            {
              question: "A stack follows which principle?",
              options: ["FIFO", "LIFO", "Random", "Sorted"],
              correct: 1,
              explain: "A stack is Last In, First Out (LIFO).",
            },
            {
              question: "Which operation removes the top element?",
              options: ["push", "pop", "peek", "enqueue"],
              correct: 1,
              explain: "pop removes and returns the top element.",
            },
          ],
        },
        {
          slug: "queue",
          title: "Queue (FIFO)",
          description: "A first-in, first-out data structure.",
          duration: 7,
          body: [
            {
              type: "paragraph",
              text: "A queue is a linear structure that follows FIFO: First In, First Out. The first element added is the first removed, like a line at a counter.",
            },
            {
              type: "table",
              headers: ["Operation", "Meaning"],
              rows: [
                ["enqueue", "Add to the rear"],
                ["dequeue", "Remove from the front"],
                ["front", "View the front element"],
              ],
            },
          ],
          quiz: [
            {
              question: "A queue follows which principle?",
              options: ["LIFO", "FIFO", "Random", "Priority"],
              correct: 1,
              explain: "A queue is First In, First Out (FIFO).",
            },
          ],
        },
        {
          slug: "linked-list",
          title: "Linked List",
          description: "Nodes connected by pointers.",
          duration: 9,
          codeLanguage: "c",
          codeExample: "struct Node {\n    int data;\n    struct Node *next;\n};",
          body: [
            {
              type: "paragraph",
              text: "A linked list is a linear structure where each element (node) stores data and a pointer to the next node. Unlike arrays, it grows dynamically and does not need contiguous memory.",
            },
            {
              type: "code",
              block: {
                language: "c",
                code: "struct Node {\n    int data;\n    struct Node *next;\n};",
              },
            },
            {
              type: "table",
              headers: ["Array", "Linked List"],
              rows: [
                ["Fixed size", "Grows dynamically"],
                ["Fast random access O(1)", "Sequential access O(n)"],
                ["Contiguous memory", "Scattered nodes with pointers"],
              ],
            },
          ],
          quiz: [
            {
              question: "Each node in a singly linked list stores data and:",
              options: [
                "A pointer to the previous node",
                "A pointer to the next node",
                "The whole list",
                "An index",
              ],
              correct: 1,
              explain: "A singly linked list node stores data and a pointer to the next node.",
            },
          ],
        },
      ],
    },
    {
      title: "Searching & Sorting",
      lessons: [
        {
          slug: "searching",
          title: "Linear and Binary Search",
          description: "Two ways to find an element.",
          duration: 8,
          codeLanguage: "c",
          codeExample: "// Binary search needs a sorted array",
          body: [
            {
              type: "paragraph",
              text: "Searching finds the position of an element. Linear search checks each element in turn; binary search repeatedly halves a sorted array.",
            },
            {
              type: "table",
              headers: ["Search", "Requires sorted?", "Time complexity"],
              rows: [
                ["Linear", "No", "O(n)"],
                ["Binary", "Yes", "O(log n)"],
              ],
            },
          ],
          quiz: [
            {
              question: "Binary search requires the array to be:",
              options: ["Empty", "Sorted", "Reversed", "Large"],
              correct: 1,
              explain: "Binary search only works on a sorted array.",
            },
            {
              question: "Time complexity of linear search is:",
              options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
              correct: 2,
              explain: "Linear search may check every element, so it is O(n).",
            },
          ],
        },
        {
          slug: "sorting",
          title: "Sorting Algorithms",
          description: "Bubble, selection, insertion, merge and quick sort.",
          duration: 9,
          body: [
            {
              type: "paragraph",
              text: "Sorting arranges data in order. Simple sorts (bubble, selection, insertion) are O(n^2); efficient sorts (merge, quick) are O(n log n).",
            },
            {
              type: "table",
              headers: ["Algorithm", "Average", "Worst"],
              rows: [
                ["Bubble Sort", "O(n^2)", "O(n^2)"],
                ["Selection Sort", "O(n^2)", "O(n^2)"],
                ["Merge Sort", "O(n log n)", "O(n log n)"],
                ["Quick Sort", "O(n log n)", "O(n^2)"],
              ],
            },
          ],
          quiz: [
            {
              question: "Which sort has O(n log n) in the worst case?",
              options: ["Bubble", "Quick", "Merge", "Selection"],
              correct: 2,
              explain: "Merge sort is O(n log n) even in the worst case.",
            },
          ],
        },
      ],
    },
  ],

  // --------------------------------------------------------------- DBMS
  "dbms-sql": [
    {
      title: "Keys & Normalization",
      lessons: [
        {
          slug: "keys",
          title: "Keys in DBMS",
          description: "Primary, candidate, foreign and super keys.",
          duration: 7,
          body: [
            {
              type: "keypoints",
              title: "Quick summary",
              items: [
                "A primary key uniquely identifies each row.",
                "A foreign key links one table to another.",
                "A candidate key is a minimal super key.",
              ],
            },
            {
              type: "table",
              headers: ["Key", "Meaning"],
              rows: [
                ["Super key", "Any set of columns that uniquely identify a row"],
                ["Candidate key", "A minimal super key"],
                ["Primary key", "The chosen candidate key (unique, not null)"],
                ["Foreign key", "A column referring to a primary key in another table"],
              ],
            },
          ],
          quiz: [
            {
              question: "A primary key must be:",
              options: ["Unique and not null", "Always numeric", "A foreign key", "Nullable"],
              correct: 0,
              explain: "A primary key uniquely identifies a row and cannot be null.",
            },
            {
              question: "A foreign key is used to:",
              options: [
                "Sort a table",
                "Link two tables",
                "Delete data",
                "Speed up queries only",
              ],
              correct: 1,
              explain: "A foreign key references a primary key in another table, creating a relationship.",
            },
          ],
        },
        {
          slug: "normalization",
          title: "Normalization (1NF, 2NF, 3NF)",
          description: "Reduce redundancy and anomalies.",
          duration: 8,
          body: [
            {
              type: "paragraph",
              text: "Normalization organises tables to reduce data redundancy and avoid update, insert and delete anomalies. It proceeds through normal forms.",
            },
            {
              type: "list",
              items: [
                "1NF: atomic values, no repeating groups.",
                "2NF: 1NF and no partial dependency on part of a composite key.",
                "3NF: 2NF and no transitive dependency.",
              ],
            },
            {
              type: "note",
              variant: "tip",
              text: "Common exam line: '1NF removes repeating groups, 2NF removes partial dependency, 3NF removes transitive dependency.'",
            },
          ],
          quiz: [
            {
              question: "Which normal form removes transitive dependency?",
              options: ["1NF", "2NF", "3NF", "BCNF"],
              correct: 2,
              explain: "3NF removes transitive dependencies.",
            },
          ],
        },
      ],
    },
    {
      title: "More SQL",
      lessons: [
        {
          slug: "sql-joins",
          title: "SQL Joins",
          description: "Combine rows from two tables.",
          duration: 8,
          codeLanguage: "sql",
          codeExample: "SELECT s.name, c.title\nFROM students s\nINNER JOIN courses c ON s.cid = c.id;",
          body: [
            {
              type: "paragraph",
              text: "A JOIN combines rows from two or more tables based on a related column. The join type decides which unmatched rows are kept.",
            },
            {
              type: "table",
              headers: ["Join", "Returns"],
              rows: [
                ["INNER JOIN", "Only matching rows in both tables"],
                ["LEFT JOIN", "All left rows + matched right rows"],
                ["RIGHT JOIN", "All right rows + matched left rows"],
                ["FULL JOIN", "All rows from both tables"],
              ],
            },
          ],
          quiz: [
            {
              question: "INNER JOIN returns:",
              options: [
                "All rows from both tables",
                "Only rows with a match in both tables",
                "Only left table rows",
                "No rows",
              ],
              correct: 1,
              explain: "INNER JOIN returns only rows that match in both tables.",
            },
          ],
        },
        {
          slug: "aggregate-functions",
          title: "Aggregate Functions & GROUP BY",
          description: "Summarise data with COUNT, SUM, AVG.",
          duration: 7,
          codeLanguage: "sql",
          codeExample: "SELECT branch, AVG(marks)\nFROM students\nGROUP BY branch;",
          body: [
            {
              type: "paragraph",
              text: "Aggregate functions compute a single value from many rows. GROUP BY splits rows into groups so aggregates are calculated per group.",
            },
            {
              type: "table",
              headers: ["Function", "Returns"],
              rows: [
                ["COUNT()", "Number of rows"],
                ["SUM()", "Total of a column"],
                ["AVG()", "Average of a column"],
                ["MAX() / MIN()", "Largest / smallest value"],
              ],
            },
          ],
          quiz: [
            {
              question: "Which function counts rows?",
              options: ["SUM()", "COUNT()", "AVG()", "MAX()"],
              correct: 1,
              explain: "COUNT() returns the number of rows.",
            },
          ],
        },
      ],
    },
  ],
};
