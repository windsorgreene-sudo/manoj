import type { Chapter } from "./types";

// Second batch of additional chapters, keyed by course slug. Merged into the
// base courses in index.ts (alongside extra.ts) so course files stay readable.
// All content is hand-written, exam-oriented and bilingual (English + Hinglish)
// for GGSIPU students. Use the { en, hi } form on every Localized field so the
// header language toggle switches the whole lesson.

export const extraChapters2: Record<string, Chapter[]> = {
  // =============================================================== C PROGRAMMING
  "c-programming": [
    {
      title: "Arrays & Strings",
      lessons: [
        {
          slug: "arrays-c",
          title: "Arrays in C",
          description: "Store many values of the same type in one variable.",
          duration: 8,
          codeLanguage: "c",
          codeExample:
            "int marks[5] = {90, 85, 70, 60, 95};\nfor (int i = 0; i < 5; i++)\n    printf(\"%d \", marks[i]);",
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                {
                  en: "An array stores multiple values of the same type together.",
                  hi: "Array ek hi type ki bahut si values ko ek saath store karta hai.",
                },
                {
                  en: "Indexing starts from 0, so arr[0] is the first element.",
                  hi: "Indexing 0 se shuru hoti hai, isliye arr[0] pehla element hai.",
                },
                {
                  en: "Array size is fixed once declared.",
                  hi: "Array ka size ek baar declare hone ke baad fix ho jaata hai.",
                },
              ],
            },
            {
              type: "paragraph",
              text: {
                en: "An array is a collection of elements of the same data type stored in contiguous memory locations. Instead of declaring many variables, you use one array and access each value by its index.",
                hi: "Array ek hi data type ke elements ka collection hai jo memory mein lagataar (contiguous) locations par store hote hain. Bahut se variables banane ke bajaye ek array use karo aur har value ko uske index se access karo.",
              },
            },
            {
              type: "heading",
              level: 2,
              id: "declare",
              text: { en: "Declaring an array", hi: "Array declare karna" },
            },
            {
              type: "code",
              block: {
                language: "c",
                code: "#include <stdio.h>\nint main() {\n    int marks[5] = {90, 85, 70, 60, 95};\n    int sum = 0;\n    for (int i = 0; i < 5; i++) {\n        sum += marks[i];\n    }\n    printf(\"Total = %d\\n\", sum);  // 400\n    return 0;\n}",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Concept", hi: "Concept" },
                { en: "Meaning", hi: "Matlab" },
              ],
              rows: [
                ["arr[0]", { en: "First element", hi: "Pehla element" }],
                ["arr[n-1]", { en: "Last element of size n", hi: "Size n ka aakhri element" }],
                [{ en: "Index", hi: "Index" }, { en: "Position number, starts at 0", hi: "Position number, 0 se shuru" }],
              ],
            },
            {
              type: "note",
              variant: "warning",
              text: {
                en: "Accessing an index outside the array (like arr[5] in a size-5 array) is a common exam mistake and causes undefined behaviour.",
                hi: "Array ke bahar ka index access karna (jaise size-5 array mein arr[5]) exam ki common galti hai aur undefined behaviour deta hai.",
              },
            },
          ],
          quiz: [
            {
              question: "In C, array indexing starts from:",
              options: ["1", "0", "-1", "Depends on the compiler"],
              correct: 1,
              explain: "C arrays are 0-indexed, so the first element is arr[0].",
            },
            {
              question: "For int a[5], which is the last valid index?",
              options: ["5", "4", "6", "0"],
              correct: 1,
              explain: "A size-5 array has valid indices 0 to 4.",
            },
          ],
        },
        {
          slug: "strings-c",
          title: "Strings in C",
          description: "Character arrays and common string functions.",
          duration: 8,
          codeLanguage: "c",
          codeExample:
            "#include <string.h>\nchar name[] = \"IPU\";\nprintf(\"%lu\", strlen(name));",
          body: [
            {
              type: "paragraph",
              text: {
                en: "In C a string is an array of characters terminated by a null character '\\0'. The <string.h> library provides functions to work with strings.",
                hi: "C mein string characters ka array hota hai jo null character '\\0' par khatam hota hai. <string.h> library strings ke liye functions deti hai.",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Function", hi: "Function" },
                { en: "Purpose", hi: "Kaam" },
              ],
              rows: [
                ["strlen(s)", { en: "Length of the string", hi: "String ki length" }],
                ["strcpy(a, b)", { en: "Copy b into a", hi: "b ko a mein copy karta hai" }],
                ["strcat(a, b)", { en: "Join b to the end of a", hi: "b ko a ke end mein jodta hai" }],
                ["strcmp(a, b)", { en: "Compare two strings", hi: "Do strings compare karta hai" }],
              ],
            },
            {
              type: "code",
              block: {
                language: "c",
                code: "#include <stdio.h>\n#include <string.h>\nint main() {\n    char a[20] = \"Code\";\n    char b[] = \"Vidya\";\n    strcat(a, b);           // a = \"CodeVidya\"\n    printf(\"%s (%lu)\\n\", a, strlen(a));\n    return 0;\n}",
              },
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "Remember the null terminator: a string \"IPU\" needs 4 bytes (I, P, U and '\\0').",
                hi: "Null terminator yaad rakho: string \"IPU\" ko 4 bytes chahiye (I, P, U aur '\\0').",
              },
            },
          ],
          quiz: [
            {
              question: "A C string is terminated by:",
              options: ["A space", "'\\0' (null character)", "'\\n'", "A full stop"],
              correct: 1,
              explain: "Every C string ends with the null character '\\0'.",
            },
            {
              question: "Which function returns the length of a string?",
              options: ["strcpy", "strcat", "strlen", "strcmp"],
              correct: 2,
              explain: "strlen() returns the number of characters before '\\0'.",
            },
          ],
        },
      ],
    },
  ],

  // =================================================================== PYTHON
  "python-programming": [
    {
      title: "Strings & Collections",
      lessons: [
        {
          slug: "strings-py",
          title: "Strings in Python",
          description: "Create, slice and format text in Python.",
          duration: 7,
          codeLanguage: "python",
          codeExample:
            "name = 'CodeVidya'\nprint(name.upper())\nprint(name[0:4])\nprint(len(name))",
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                { en: "Strings are sequences of characters.", hi: "Strings characters ka sequence hoti hain." },
                {
                  en: "Slicing s[a:b] takes characters from a up to (not including) b.",
                  hi: "Slicing s[a:b] a se b tak (b ko chhodkar) characters leta hai.",
                },
                { en: "Strings are immutable (cannot be changed in place).", hi: "Strings immutable hoti hain (jagah par badli nahi ja sakti)." },
              ],
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "name = 'CodeVidya'\nprint(name.upper())    # CODEVIDYA\nprint(name[0:4])       # Code\nprint(name[-5:])       # Vidya\nprint(len(name))       # 9",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Method", hi: "Method" },
                { en: "Does", hi: "Kaam" },
              ],
              rows: [
                ["upper()", { en: "Convert to uppercase", hi: "Uppercase mein badalna" }],
                ["lower()", { en: "Convert to lowercase", hi: "Lowercase mein badalna" }],
                ["strip()", { en: "Remove surrounding spaces", hi: "Aas-paas ke spaces hatana" }],
                ["split()", { en: "Break into a list", hi: "List mein todna" }],
              ],
            },
          ],
          quiz: [
            {
              question: "What does 'CodeVidya'[0:4] give?",
              options: ["Code", "CodeV", "odeV", "Vidya"],
              correct: 0,
              explain: "Slicing [0:4] takes indices 0,1,2,3 → 'Code'.",
            },
            {
              question: "Python strings are:",
              options: ["Mutable", "Immutable", "Always numbers", "Sorted"],
              correct: 1,
              explain: "Strings are immutable; methods return new strings.",
            },
          ],
        },
        {
          slug: "sets-tuples-py",
          title: "Tuples and Sets",
          description: "Two more built-in collections and when to use them.",
          duration: 7,
          codeLanguage: "python",
          codeExample:
            "point = (3, 4)\nunique = {1, 2, 2, 3}\nprint(point[0], unique)",
          body: [
            {
              type: "paragraph",
              text: {
                en: "A tuple is an ordered, immutable collection written with parentheses. A set is an unordered collection of unique elements written with curly braces.",
                hi: "Tuple ek ordered, immutable collection hai jo parentheses () mein likhi jaati hai. Set ek unordered collection hai jismein sirf unique elements hote hain aur curly braces {} mein likhi jaati hai.",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Type", hi: "Type" },
                { en: "Ordered?", hi: "Ordered?" },
                { en: "Duplicates?", hi: "Duplicates?" },
              ],
              rows: [
                ["list []", { en: "Yes", hi: "Haan" }, { en: "Allowed", hi: "Allowed" }],
                ["tuple ()", { en: "Yes", hi: "Haan" }, { en: "Allowed", hi: "Allowed" }],
                ["set {}", { en: "No", hi: "Nahi" }, { en: "Not allowed", hi: "Allowed nahi" }],
              ],
            },
            {
              type: "code",
              block: {
                language: "python",
                code: "point = (3, 4)        # tuple\nunique = {1, 2, 2, 3}  # set -> {1, 2, 3}\nprint(point[0])        # 3\nprint(unique)          # {1, 2, 3}",
              },
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "Use a set to quickly remove duplicates from a list: list(set(my_list)).",
                hi: "List se duplicates jaldi hataane ke liye set use karo: list(set(my_list)).",
              },
            },
          ],
          quiz: [
            {
              question: "Which collection removes duplicate values automatically?",
              options: ["list", "tuple", "set", "string"],
              correct: 2,
              explain: "A set only keeps unique elements.",
            },
            {
              question: "A tuple is:",
              options: ["Mutable", "Immutable", "Unordered", "Always empty"],
              correct: 1,
              explain: "Tuples are immutable and ordered.",
            },
          ],
        },
      ],
    },
  ],

  // =========================================================== DATA STRUCTURES
  "data-structures": [
    {
      title: "Trees & Hashing",
      lessons: [
        {
          slug: "binary-tree",
          title: "Binary Trees",
          description: "Hierarchical structure with at most two children per node.",
          duration: 9,
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                {
                  en: "A binary tree node has at most two children (left and right).",
                  hi: "Binary tree ke node ke zyada se zyada do children hote hain (left aur right).",
                },
                {
                  en: "The topmost node is the root; nodes with no children are leaves.",
                  hi: "Sabse upar wala node root hai; jinke children nahi wo leaf kehlate hain.",
                },
                {
                  en: "Traversals: inorder, preorder, postorder.",
                  hi: "Traversals: inorder, preorder, postorder.",
                },
              ],
            },
            {
              type: "paragraph",
              text: {
                en: "A binary tree is a non-linear data structure where each node has up to two children. It is widely used for searching (binary search trees), expression parsing and hierarchical data like file systems.",
                hi: "Binary tree ek non-linear data structure hai jismein har node ke zyada se zyada do children hote hain. Iska use searching (binary search trees), expression parsing aur file system jaise hierarchical data mein hota hai.",
              },
            },
            {
              type: "heading",
              level: 2,
              id: "traversals",
              text: { en: "Tree traversals", hi: "Tree traversals" },
            },
            {
              type: "table",
              headers: [
                { en: "Traversal", hi: "Traversal" },
                { en: "Order", hi: "Order" },
              ],
              rows: [
                ["Inorder", { en: "Left, Root, Right", hi: "Left, Root, Right" }],
                ["Preorder", { en: "Root, Left, Right", hi: "Root, Left, Right" }],
                ["Postorder", { en: "Left, Right, Root", hi: "Left, Right, Root" }],
              ],
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "Exam tip: inorder traversal of a Binary Search Tree gives values in sorted order.",
                hi: "Exam tip: Binary Search Tree ka inorder traversal values ko sorted order mein deta hai.",
              },
            },
          ],
          quiz: [
            {
              question: "How many children can a binary tree node have at most?",
              options: ["1", "2", "3", "Any number"],
              correct: 1,
              explain: "A binary tree node has at most two children.",
            },
            {
              question: "Inorder traversal of a BST gives values in:",
              options: ["Random order", "Reverse order", "Sorted order", "Level order"],
              correct: 2,
              explain: "Inorder of a BST yields sorted (ascending) values.",
            },
          ],
        },
        {
          slug: "hashing",
          title: "Hashing",
          description: "Map keys to array positions for near O(1) lookup.",
          duration: 8,
          body: [
            {
              type: "paragraph",
              text: {
                en: "Hashing uses a hash function to convert a key into an index in a hash table, allowing very fast insertion and search (average O(1)). When two keys map to the same index, a collision occurs.",
                hi: "Hashing ek hash function se key ko hash table ke index mein badalti hai, jisse insertion aur search bahut fast (average O(1)) ho jaata hai. Jab do keys ek hi index par aati hain to collision hota hai.",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Term", hi: "Term" },
                { en: "Meaning", hi: "Matlab" },
              ],
              rows: [
                [{ en: "Hash function", hi: "Hash function" }, { en: "Turns a key into an index", hi: "Key ko index mein badalta hai" }],
                [{ en: "Collision", hi: "Collision" }, { en: "Two keys map to the same index", hi: "Do keys ek hi index par aayein" }],
                [{ en: "Chaining", hi: "Chaining" }, { en: "Store collided keys in a linked list", hi: "Collide hui keys ko linked list mein rakhna" }],
              ],
            },
            {
              type: "note",
              variant: "warning",
              text: {
                en: "A poor hash function causes many collisions and degrades performance towards O(n).",
                hi: "Kharaab hash function bahut collisions deta hai aur performance ko O(n) tak gira deta hai.",
              },
            },
          ],
          quiz: [
            {
              question: "The average time complexity of search in a good hash table is:",
              options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
              correct: 2,
              explain: "With few collisions, hashing gives average O(1) lookup.",
            },
            {
              question: "When two keys map to the same index, it is called a:",
              options: ["Rehash", "Collision", "Overflow", "Probe"],
              correct: 1,
              explain: "That situation is a collision, handled by chaining or open addressing.",
            },
          ],
        },
      ],
    },
  ],

  // ================================================================= DBMS & SQL
  "dbms-sql": [
    {
      title: "Transactions & Advanced SQL",
      lessons: [
        {
          slug: "acid-transactions",
          title: "Transactions and ACID",
          description: "Keep a database correct even when things go wrong.",
          duration: 8,
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                {
                  en: "A transaction is a group of operations treated as one unit.",
                  hi: "Transaction operations ka ek group hai jise ek unit maana jaata hai.",
                },
                {
                  en: "ACID = Atomicity, Consistency, Isolation, Durability.",
                  hi: "ACID = Atomicity, Consistency, Isolation, Durability.",
                },
              ],
            },
            {
              type: "paragraph",
              text: {
                en: "A transaction is a sequence of database operations performed as a single logical unit of work. To stay reliable, transactions must satisfy the ACID properties.",
                hi: "Transaction database operations ka ek sequence hai jo ek single logical unit ki tarah chalta hai. Reliable rehne ke liye transactions ko ACID properties follow karni padti hain.",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Property", hi: "Property" },
                { en: "Meaning", hi: "Matlab" },
              ],
              rows: [
                [{ en: "Atomicity", hi: "Atomicity" }, { en: "All operations happen, or none do", hi: "Ya to saare operations honge, ya koi bhi nahi" }],
                [{ en: "Consistency", hi: "Consistency" }, { en: "DB moves from one valid state to another", hi: "DB ek valid state se doosri valid state mein jaata hai" }],
                [{ en: "Isolation", hi: "Isolation" }, { en: "Concurrent transactions don't interfere", hi: "Ek saath chalte transactions ek doosre ko disturb nahi karte" }],
                [{ en: "Durability", hi: "Durability" }, { en: "Committed changes survive crashes", hi: "Commit ho chuke changes crash ke baad bhi rehte hain" }],
              ],
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "Common exam question: expand and explain ACID with one example each.",
                hi: "Common exam question: ACID ka full form aur har ek ko ek example ke saath samjhao.",
              },
            },
          ],
          quiz: [
            {
              question: "What does the 'A' in ACID stand for?",
              options: ["Availability", "Atomicity", "Access", "Aggregation"],
              correct: 1,
              explain: "A = Atomicity: all-or-nothing execution of a transaction.",
            },
            {
              question: "Which property ensures committed data survives a crash?",
              options: ["Isolation", "Consistency", "Durability", "Atomicity"],
              correct: 2,
              explain: "Durability guarantees committed changes are permanent.",
            },
          ],
        },
        {
          slug: "group-by-having",
          title: "GROUP BY and HAVING",
          description: "Summarise rows into groups and filter those groups.",
          duration: 7,
          codeLanguage: "sql",
          codeExample:
            "SELECT dept, COUNT(*)\nFROM students\nGROUP BY dept\nHAVING COUNT(*) > 5;",
          body: [
            {
              type: "paragraph",
              text: {
                en: "GROUP BY collapses rows that share a value into a single group, so aggregate functions like COUNT, SUM and AVG can be applied per group. HAVING filters groups after aggregation (WHERE filters rows before it).",
                hi: "GROUP BY un rows ko ek group mein jod deta hai jinki value same hoti hai, taaki COUNT, SUM, AVG jaise aggregate functions har group par lag sakein. HAVING aggregation ke baad groups ko filter karta hai (WHERE usse pehle rows ko filter karta hai).",
              },
            },
            {
              type: "code",
              block: {
                language: "sql",
                code: "SELECT dept, COUNT(*) AS total\nFROM students\nGROUP BY dept\nHAVING COUNT(*) > 5;",
              },
            },
            {
              type: "note",
              variant: "warning",
              text: {
                en: "Use WHERE to filter rows before grouping and HAVING to filter after grouping. Mixing them up is a frequent mistake.",
                hi: "Grouping se pehle rows filter karne ke liye WHERE aur grouping ke baad filter karne ke liye HAVING use karo. Inhe ulta karna common galti hai.",
              },
            },
          ],
          quiz: [
            {
              question: "Which clause filters groups after aggregation?",
              options: ["WHERE", "HAVING", "ORDER BY", "GROUP"],
              correct: 1,
              explain: "HAVING filters aggregated groups; WHERE filters individual rows.",
            },
            {
              question: "COUNT, SUM and AVG are examples of:",
              options: ["Joins", "Aggregate functions", "Keys", "Indexes"],
              correct: 1,
              explain: "They are aggregate functions used with GROUP BY.",
            },
          ],
        },
      ],
    },
  ],

  // ================================================================= OOP JAVA
  "oop-java": [
    {
      title: "Core OOP Pillars",
      lessons: [
        {
          slug: "inheritance-java",
          title: "Inheritance",
          description: "Reuse code by deriving one class from another.",
          duration: 8,
          codeLanguage: "java",
          codeExample:
            "class Animal { void eat() { System.out.println(\"eating\"); } }\nclass Dog extends Animal { void bark() { System.out.println(\"bark\"); } }",
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                {
                  en: "Inheritance lets a subclass reuse a superclass's members.",
                  hi: "Inheritance se subclass, superclass ke members dobara use kar sakti hai.",
                },
                {
                  en: "The 'extends' keyword creates the relationship.",
                  hi: "'extends' keyword ye relationship banata hai.",
                },
                {
                  en: "It models an 'is-a' relationship (a Dog is an Animal).",
                  hi: "Ye 'is-a' relationship dikhata hai (Dog ek Animal hai).",
                },
              ],
            },
            {
              type: "paragraph",
              text: {
                en: "Inheritance is a pillar of OOP where a new class (subclass) acquires the properties and methods of an existing class (superclass). It promotes code reuse and a clear hierarchy.",
                hi: "Inheritance OOP ka ek pillar hai jismein ek nayi class (subclass) kisi existing class (superclass) ki properties aur methods le leti hai. Isse code reuse hota hai aur ek clear hierarchy banti hai.",
              },
            },
            {
              type: "code",
              block: {
                language: "java",
                code: "class Animal {\n    void eat() { System.out.println(\"eating\"); }\n}\nclass Dog extends Animal {\n    void bark() { System.out.println(\"barking\"); }\n}\n// Dog d = new Dog(); d.eat(); d.bark();",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Type", hi: "Type" },
                { en: "Meaning", hi: "Matlab" },
              ],
              rows: [
                [{ en: "Single", hi: "Single" }, { en: "One subclass, one superclass", hi: "Ek subclass, ek superclass" }],
                [{ en: "Multilevel", hi: "Multilevel" }, { en: "A chain: A -> B -> C", hi: "Ek chain: A -> B -> C" }],
                [{ en: "Hierarchical", hi: "Hierarchical" }, { en: "Many subclasses of one superclass", hi: "Ek superclass ki kai subclasses" }],
              ],
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "Java does not support multiple inheritance with classes (to avoid the diamond problem); use interfaces instead.",
                hi: "Java classes ke saath multiple inheritance support nahi karta (diamond problem se bachne ke liye); iske bajaye interfaces use karo.",
              },
            },
          ],
          quiz: [
            {
              question: "Which keyword is used for inheritance in Java?",
              options: ["implements", "extends", "inherits", "super"],
              correct: 1,
              explain: "A subclass uses 'extends' to inherit from a superclass.",
            },
            {
              question: "Inheritance models which relationship?",
              options: ["has-a", "is-a", "uses-a", "part-of"],
              correct: 1,
              explain: "Inheritance represents an 'is-a' relationship.",
            },
          ],
        },
        {
          slug: "polymorphism-java",
          title: "Polymorphism",
          description: "One name, many forms: overloading and overriding.",
          duration: 8,
          codeLanguage: "java",
          codeExample:
            "int add(int a, int b){return a+b;}\ndouble add(double a, double b){return a+b;}",
          body: [
            {
              type: "paragraph",
              text: {
                en: "Polymorphism means 'many forms'. Compile-time polymorphism is achieved by method overloading (same name, different parameters). Run-time polymorphism is achieved by method overriding (a subclass redefines a superclass method).",
                hi: "Polymorphism ka matlab hai 'kai roop'. Compile-time polymorphism method overloading se hota hai (same naam, alag parameters). Run-time polymorphism method overriding se hota hai (subclass superclass ke method ko dobara define karti hai).",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Kind", hi: "Kism" },
                { en: "How", hi: "Kaise" },
                { en: "When decided", hi: "Kab decide hota hai" },
              ],
              rows: [
                [{ en: "Overloading", hi: "Overloading" }, { en: "Same name, different params", hi: "Same naam, alag params" }, { en: "Compile time", hi: "Compile time" }],
                [{ en: "Overriding", hi: "Overriding" }, { en: "Subclass redefines method", hi: "Subclass method redefine karti hai" }, { en: "Run time", hi: "Run time" }],
              ],
            },
            {
              type: "note",
              variant: "warning",
              text: {
                en: "Overloading changes the parameter list; overriding keeps the same signature. Don't confuse the two in exams.",
                hi: "Overloading parameter list badalta hai; overriding wahi signature rakhta hai. Exam mein in dono ko confuse mat karo.",
              },
            },
          ],
          quiz: [
            {
              question: "Method overloading is an example of:",
              options: ["Run-time polymorphism", "Compile-time polymorphism", "Inheritance", "Encapsulation"],
              correct: 1,
              explain: "Overloading is resolved at compile time.",
            },
            {
              question: "Overriding requires the subclass method to have:",
              options: ["A different name", "The same signature", "More parameters", "A different return type only"],
              correct: 1,
              explain: "Overriding keeps the same method signature as the superclass.",
            },
          ],
        },
      ],
    },
  ],

  // =========================================================== OPERATING SYSTEMS
  "operating-systems": [
    {
      title: "Memory & Deadlocks",
      lessons: [
        {
          slug: "paging-os",
          title: "Paging and Virtual Memory",
          description: "How the OS gives each process a large, uniform memory view.",
          duration: 9,
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                {
                  en: "Paging splits memory into fixed-size pages and frames.",
                  hi: "Paging memory ko fixed-size pages aur frames mein baant deta hai.",
                },
                {
                  en: "Virtual memory lets programs use more memory than physically available.",
                  hi: "Virtual memory programs ko physical se zyada memory use karne deti hai.",
                },
                {
                  en: "A page table maps virtual pages to physical frames.",
                  hi: "Page table virtual pages ko physical frames se map karti hai.",
                },
              ],
            },
            {
              type: "paragraph",
              text: {
                en: "Paging is a memory management scheme that removes the need for contiguous allocation. Physical memory is divided into frames and logical memory into pages of the same size; a page table maps pages to frames.",
                hi: "Paging ek memory management scheme hai jo contiguous allocation ki zaroorat khatam kar deti hai. Physical memory frames mein aur logical memory usi size ke pages mein bant jaati hai; page table pages ko frames se map karti hai.",
              },
            },
            {
              type: "note",
              variant: "info",
              text: {
                en: "A page fault occurs when a needed page is not in physical memory and must be loaded from disk.",
                hi: "Page fault tab hota hai jab zaroori page physical memory mein nahi hota aur use disk se load karna padta hai.",
              },
            },
          ],
          quiz: [
            {
              question: "Paging divides memory into fixed-size units called:",
              options: ["Segments", "Pages and frames", "Sectors", "Blocks only"],
              correct: 1,
              explain: "Logical memory is split into pages, physical memory into frames of equal size.",
            },
            {
              question: "A page fault means the required page is:",
              options: ["Corrupted", "Not in physical memory", "Read-only", "Too large"],
              correct: 1,
              explain: "A page fault occurs when the page must be fetched from disk.",
            },
          ],
        },
        {
          slug: "deadlock-os",
          title: "Deadlocks",
          description: "When processes wait forever for each other's resources.",
          duration: 8,
          body: [
            {
              type: "paragraph",
              text: {
                en: "A deadlock is a situation where a set of processes are blocked because each holds a resource and waits for another held by a different process. Four conditions must hold simultaneously for a deadlock.",
                hi: "Deadlock wo situation hai jismein kuch processes block ho jaate hain kyunki har ek koi resource pakde hue hai aur doosre process ke pakde resource ka wait kar raha hai. Deadlock ke liye chaar conditions ek saath honi chahiye.",
              },
            },
            {
              type: "list",
              items: [
                { en: "Mutual exclusion: a resource is held by only one process.", hi: "Mutual exclusion: ek resource sirf ek process ke paas hota hai." },
                { en: "Hold and wait: a process holds one resource and waits for more.", hi: "Hold and wait: process ek resource pakde hue aur aur ka wait karta hai." },
                { en: "No preemption: resources can't be forcibly taken.", hi: "No preemption: resources zabardasti nahi liye ja sakte." },
                { en: "Circular wait: a closed chain of processes each waiting for the next.", hi: "Circular wait: processes ki ek closed chain jismein har ek agle ka wait karta hai." },
              ],
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "Breaking any one of the four conditions prevents deadlock, a classic exam answer.",
                hi: "Chaar mein se koi ek condition tod do to deadlock ruk jaata hai, ye classic exam answer hai.",
              },
            },
          ],
          quiz: [
            {
              question: "How many conditions must hold at once for a deadlock?",
              options: ["2", "3", "4", "5"],
              correct: 2,
              explain: "All four: mutual exclusion, hold and wait, no preemption, circular wait.",
            },
            {
              question: "Which is NOT a deadlock condition?",
              options: ["Mutual exclusion", "Circular wait", "Preemption allowed", "Hold and wait"],
              correct: 2,
              explain: "Deadlock needs 'no preemption'; allowing preemption breaks it.",
            },
          ],
        },
      ],
    },
  ],

  // ============================================================ COMPUTER NETWORKS
  "computer-networks": [
    {
      title: "Protocols & Addressing",
      lessons: [
        {
          slug: "tcp-vs-udp",
          title: "TCP vs UDP",
          description: "The two main transport-layer protocols compared.",
          duration: 8,
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                {
                  en: "TCP is connection-oriented and reliable.",
                  hi: "TCP connection-oriented aur reliable hai.",
                },
                {
                  en: "UDP is connectionless and fast but unreliable.",
                  hi: "UDP connectionless aur fast hai par reliable nahi.",
                },
              ],
            },
            {
              type: "paragraph",
              text: {
                en: "TCP and UDP are transport-layer protocols. TCP guarantees ordered, error-checked delivery using acknowledgements, while UDP sends datagrams without setup or guarantees, which makes it faster.",
                hi: "TCP aur UDP transport-layer protocols hain. TCP acknowledgements ke through ordered aur error-checked delivery guarantee karta hai, jabki UDP bina setup ya guarantee ke datagrams bhejta hai, jisse wo fast hota hai.",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Feature", hi: "Feature" },
                { en: "TCP", hi: "TCP" },
                { en: "UDP", hi: "UDP" },
              ],
              rows: [
                [{ en: "Connection", hi: "Connection" }, { en: "Connection-oriented", hi: "Connection-oriented" }, { en: "Connectionless", hi: "Connectionless" }],
                [{ en: "Reliability", hi: "Reliability" }, { en: "Reliable", hi: "Reliable" }, { en: "Unreliable", hi: "Unreliable" }],
                [{ en: "Speed", hi: "Speed" }, { en: "Slower", hi: "Dheema" }, { en: "Faster", hi: "Tez" }],
                [{ en: "Use", hi: "Use" }, { en: "Web, email", hi: "Web, email" }, { en: "Video, games", hi: "Video, games" }],
              ],
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "Exam mnemonic: TCP = Trustworthy, UDP = Ultra-fast (but Unreliable).",
                hi: "Exam mnemonic: TCP = Trustworthy, UDP = Ultra-fast (par Unreliable).",
              },
            },
          ],
          quiz: [
            {
              question: "Which protocol is connection-oriented and reliable?",
              options: ["UDP", "TCP", "IP", "ICMP"],
              correct: 1,
              explain: "TCP is connection-oriented and provides reliable delivery.",
            },
            {
              question: "Which is preferred for live video streaming?",
              options: ["TCP", "UDP", "FTP", "SMTP"],
              correct: 1,
              explain: "UDP's low overhead suits real-time media.",
            },
          ],
        },
        {
          slug: "ip-addressing",
          title: "IP Addressing",
          description: "How devices are identified on a network.",
          duration: 8,
          body: [
            {
              type: "paragraph",
              text: {
                en: "An IP address is a unique identifier for a device on a network. IPv4 uses 32 bits written as four numbers (0-255), while IPv6 uses 128 bits to provide vastly more addresses.",
                hi: "IP address network par kisi device ki unique pehchaan hai. IPv4 32 bits use karta hai jo chaar numbers (0-255) mein likhe jaate hain, jabki IPv6 128 bits use karke bahut zyada addresses deta hai.",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Version", hi: "Version" },
                { en: "Bits", hi: "Bits" },
                { en: "Example", hi: "Example" },
              ],
              rows: [
                ["IPv4", "32", "192.168.1.1"],
                ["IPv6", "128", "2001:db8::1"],
              ],
            },
            {
              type: "note",
              variant: "info",
              text: {
                en: "IPv4 has about 4.3 billion addresses; IPv6 was created because we ran out.",
                hi: "IPv4 mein lagbhag 4.3 billion addresses hain; IPv6 isliye banaya gaya kyunki wo khatam ho gaye.",
              },
            },
          ],
          quiz: [
            {
              question: "How many bits are in an IPv4 address?",
              options: ["16", "32", "64", "128"],
              correct: 1,
              explain: "IPv4 addresses are 32 bits long.",
            },
            {
              question: "IPv6 was introduced mainly to solve:",
              options: ["Slow speeds", "Address exhaustion", "Weak passwords", "Cable limits"],
              correct: 1,
              explain: "IPv6's 128-bit space solves IPv4 address exhaustion.",
            },
          ],
        },
      ],
    },
  ],

  // ============================================================== WEB TECHNOLOGY
  "web-technology": [
    {
      title: "JavaScript & the DOM",
      lessons: [
        {
          slug: "js-basics-web",
          title: "JavaScript Basics",
          description: "Add behaviour to web pages with variables and functions.",
          duration: 8,
          codeLanguage: "javascript",
          codeExample:
            "let name = 'IPU';\nfunction greet(n) { return 'Hi ' + n; }\nconsole.log(greet(name));",
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                {
                  en: "JavaScript makes web pages interactive.",
                  hi: "JavaScript web pages ko interactive banati hai.",
                },
                {
                  en: "Declare variables with let and const.",
                  hi: "Variables ko let aur const se declare karo.",
                },
                {
                  en: "Functions group reusable logic.",
                  hi: "Functions dobara-use hone wali logic ko group karte hain.",
                },
              ],
            },
            {
              type: "code",
              block: {
                language: "javascript",
                code: "let name = 'IPU';\nconst greet = (n) => 'Hi ' + n;\nconsole.log(greet(name));  // Hi IPU",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Keyword", hi: "Keyword" },
                { en: "Use", hi: "Use" },
              ],
              rows: [
                ["let", { en: "Variable that can change", hi: "Variable jo badal sakta hai" }],
                ["const", { en: "Constant that cannot be reassigned", hi: "Constant jo dobara assign nahi hota" }],
                ["var", { en: "Old-style variable (avoid)", hi: "Purana variable (avoid karo)" }],
              ],
            },
          ],
          quiz: [
            {
              question: "Which keyword declares a value that cannot be reassigned?",
              options: ["let", "var", "const", "static"],
              correct: 2,
              explain: "const creates a binding that cannot be reassigned.",
            },
            {
              question: "JavaScript mainly runs in the:",
              options: ["Database", "Browser", "Kernel", "Compiler"],
              correct: 1,
              explain: "JavaScript runs in the browser (and also in Node.js).",
            },
          ],
        },
        {
          slug: "dom-web",
          title: "The DOM",
          description: "How JavaScript reads and changes page elements.",
          duration: 7,
          codeLanguage: "javascript",
          codeExample:
            "document.getElementById('title').textContent = 'Hello IPU';",
          body: [
            {
              type: "paragraph",
              text: {
                en: "The DOM (Document Object Model) is a tree representation of an HTML page. JavaScript uses it to select elements, change text and styles, and respond to events like clicks.",
                hi: "DOM (Document Object Model) HTML page ka ek tree representation hai. JavaScript ise use karke elements select karti hai, text aur styles badalti hai, aur click jaise events ka jawaab deti hai.",
              },
            },
            {
              type: "code",
              block: {
                language: "javascript",
                code: "const title = document.getElementById('title');\ntitle.textContent = 'Hello IPU';\ntitle.addEventListener('click', () => alert('clicked'));",
              },
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "getElementById selects one element; querySelectorAll selects many using CSS selectors.",
                hi: "getElementById ek element select karta hai; querySelectorAll CSS selectors se kai elements select karta hai.",
              },
            },
          ],
          quiz: [
            {
              question: "The DOM represents an HTML page as a:",
              options: ["List", "Tree", "Table", "Queue"],
              correct: 1,
              explain: "The DOM is a tree of nodes representing the page.",
            },
            {
              question: "Which method selects a single element by its id?",
              options: ["querySelectorAll", "getElementById", "getElementsByTagName", "createElement"],
              correct: 1,
              explain: "getElementById returns the one element with that id.",
            },
          ],
        },
      ],
    },
  ],

  // ========================================================= SOFTWARE ENGINEERING
  "software-engineering": [
    {
      title: "Requirements & Testing",
      lessons: [
        {
          slug: "requirements-se",
          title: "Requirement Analysis",
          description: "Understand what to build before building it.",
          duration: 7,
          body: [
            {
              type: "keypoints",
              title: { en: "Quick summary", hi: "Ek line mein" },
              items: [
                {
                  en: "Requirements describe what the system should do.",
                  hi: "Requirements batati hain ki system ko kya karna chahiye.",
                },
                {
                  en: "Functional = features; non-functional = qualities like speed.",
                  hi: "Functional = features; non-functional = qualities jaise speed.",
                },
              ],
            },
            {
              type: "paragraph",
              text: {
                en: "Requirement analysis is the process of gathering, analysing and documenting what stakeholders need from a software system. The output is usually a Software Requirements Specification (SRS).",
                hi: "Requirement analysis wo process hai jismein stakeholders ki software system se zarooraton ko gather, analyse aur document kiya jaata hai. Iska output aam taur par ek Software Requirements Specification (SRS) hota hai.",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Type", hi: "Type" },
                { en: "Example", hi: "Example" },
              ],
              rows: [
                [{ en: "Functional", hi: "Functional" }, { en: "User can log in", hi: "User log in kar sakta hai" }],
                [{ en: "Non-functional", hi: "Non-functional" }, { en: "Page loads in under 2s", hi: "Page 2s se kam mein load ho" }],
              ],
            },
            {
              type: "note",
              variant: "warning",
              text: {
                en: "Unclear or changing requirements are a leading cause of project failure.",
                hi: "Unclear ya badalti requirements project fail hone ki badi vajah hoti hain.",
              },
            },
          ],
          quiz: [
            {
              question: "'The page must load in under 2 seconds' is a:",
              options: ["Functional requirement", "Non-functional requirement", "Test case", "Bug"],
              correct: 1,
              explain: "Performance is a quality attribute, so it is non-functional.",
            },
            {
              question: "The document produced by requirement analysis is the:",
              options: ["SRS", "DFD", "ERD", "UML"],
              correct: 0,
              explain: "It is the Software Requirements Specification (SRS).",
            },
          ],
        },
        {
          slug: "testing-se",
          title: "Software Testing",
          description: "Find defects and build confidence in the software.",
          duration: 8,
          body: [
            {
              type: "paragraph",
              text: {
                en: "Software testing checks whether the software behaves as expected. Black-box testing looks only at inputs and outputs; white-box testing examines the internal code and logic paths.",
                hi: "Software testing check karti hai ki software expected tarah se chalta hai ya nahi. Black-box testing sirf inputs aur outputs dekhti hai; white-box testing andar ke code aur logic paths ko dekhti hai.",
              },
            },
            {
              type: "table",
              headers: [
                { en: "Level", hi: "Level" },
                { en: "Tests", hi: "Kya test karta hai" },
              ],
              rows: [
                [{ en: "Unit", hi: "Unit" }, { en: "A single function/module", hi: "Ek function/module" }],
                [{ en: "Integration", hi: "Integration" }, { en: "Modules working together", hi: "Modules ka saath kaam karna" }],
                [{ en: "System", hi: "System" }, { en: "The whole application", hi: "Poori application" }],
              ],
            },
            {
              type: "note",
              variant: "tip",
              text: {
                en: "Black-box = test behaviour without seeing code; white-box = test with knowledge of code. A common exam distinction.",
                hi: "Black-box = code dekhe bina behaviour test karna; white-box = code ki jaankari ke saath test karna. Ye common exam distinction hai.",
              },
            },
          ],
          quiz: [
            {
              question: "Testing without knowledge of internal code is called:",
              options: ["White-box", "Black-box", "Grey-box", "Unit"],
              correct: 1,
              explain: "Black-box testing focuses on inputs and outputs only.",
            },
            {
              question: "Which level tests a single module in isolation?",
              options: ["System testing", "Integration testing", "Unit testing", "Acceptance testing"],
              correct: 2,
              explain: "Unit testing checks one module/function on its own.",
            },
          ],
        },
      ],
    },
  ],
};
