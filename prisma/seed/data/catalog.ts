export type SeedLesson = { title: string; article?: string; problem?: string; quiz?: string; preview?: boolean; mins?: number; video?: string };
export type SeedCourse = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  topic: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  color: string;
  featured: boolean;
  outcomes: string[];
  modules: { title: string; lessons: SeedLesson[] }[];
};

export const courses: SeedCourse[] = [
  {
    slug: "data-structures-and-algorithms",
    title: "Data Structures & Algorithms",
    subtitle: "From Big-O to Dijkstra, the complete interview-ready DSA course.",
    description:
      "Master the patterns top companies test. Each lesson pairs an in-depth tutorial with hand-picked problems you solve in the browser IDE, so theory turns into muscle memory. Finish with graph algorithms and dynamic programming.",
    topic: "DSA",
    level: "INTERMEDIATE",
    color: "#7C3AED",
    featured: true,
    outcomes: ["Analyse time & space complexity", "Apply two pointers, sliding window and binary search", "Implement trees, graphs and shortest paths", "Solve DP problems with a repeatable recipe"],
    modules: [
      {
        title: "Foundations",
        lessons: [
          { title: "Time and Space Complexity", article: "time-and-space-complexity", preview: true },
          { title: "Arrays", article: "arrays-introduction", preview: true },
          { title: "Practice: Two Sum", problem: "two-sum" },
          { title: "Hashing and Hash Maps", article: "hashing-and-hash-maps" },
        ],
      },
      {
        title: "Core Patterns",
        lessons: [
          { title: "Two Pointers", article: "two-pointers-technique" },
          { title: "Practice: Move Zeroes", problem: "move-zeroes" },
          { title: "Sliding Window", article: "sliding-window-technique" },
          { title: "Binary Search", article: "binary-search-guide" },
          { title: "Practice: Binary Search", problem: "binary-search" },
          { title: "Recursion and Backtracking", article: "recursion-and-backtracking" },
          { title: "Sorting Algorithms", article: "sorting-algorithms" },
        ],
      },
      {
        title: "Linear & Hierarchical Structures",
        lessons: [
          { title: "Linked Lists", article: "linked-list-basics" },
          { title: "Stacks and Queues", article: "stacks-and-queues" },
          { title: "Practice: Valid Parentheses", problem: "valid-parentheses" },
          { title: "Trees and BSTs", article: "binary-search-trees" },
        ],
      },
      {
        title: "Graphs & Dynamic Programming",
        lessons: [
          { title: "BFS and DFS", article: "graph-traversal-bfs-dfs" },
          { title: "Practice: Number of Islands", problem: "number-of-islands" },
          { title: "Dijkstra's Algorithm", article: "dijkstra-shortest-path" },
          { title: "Intro to Dynamic Programming", article: "dynamic-programming-introduction" },
          { title: "Practice: Coin Change", problem: "coin-change" },
          { title: "DSA Fundamentals Mock Test", quiz: "dsa-fundamentals-mock-test" },
        ],
      },
    ],
  },
  {
    slug: "python-programming",
    title: "Python Programming Masterclass",
    subtitle: "Write clean, idiomatic Python, from basics to generators and OOP.",
    description:
      "Start from zero and become productive in Python. Learn the built-in data structures, functions and decorators, object-oriented design and lazy evaluation, all with runnable examples.",
    topic: "Python",
    level: "BEGINNER",
    color: "#06B6D4",
    featured: true,
    outcomes: ["Write idiomatic Python", "Use lists, dicts and sets efficiently", "Build classes and dataclasses", "Process data lazily with generators"],
    modules: [
      {
        title: "Python Essentials",
        lessons: [
          { title: "Variables, Types and I/O", article: "python-getting-started", preview: true },
          { title: "Lists, Tuples and Dictionaries", article: "python-lists-and-dictionaries", preview: true },
          { title: "Practice: FizzBuzz", problem: "fizz-buzz" },
        ],
      },
      {
        title: "Going Deeper",
        lessons: [
          { title: "Functions, Lambdas and Decorators", article: "python-functions-and-lambdas" },
          { title: "Object-Oriented Programming", article: "python-oop-classes" },
          { title: "Comprehensions and Generators", article: "python-comprehensions-generators" },
          { title: "Practice: Valid Anagram", problem: "valid-anagram" },
          { title: "Python Quiz", quiz: "python-essentials-quiz" },
        ],
      },
    ],
  },
  {
    slug: "modern-javascript",
    title: "Modern JavaScript",
    subtitle: "Closures, promises and the event loop, understand JS for real.",
    description:
      "Go beyond syntax. Understand how JavaScript actually executes, write asynchronous code with confidence and use the modern array toolkit that every React and Node developer relies on.",
    topic: "JavaScript",
    level: "INTERMEDIATE",
    color: "#F59E0B",
    featured: true,
    outcomes: ["Master scope and closures", "Write async code with async/await", "Predict event-loop ordering", "Use functional array methods"],
    modules: [
      {
        title: "Language Core",
        lessons: [
          { title: "Variables, Types and Equality", article: "javascript-variables-and-types", preview: true },
          { title: "Functions and Closures", article: "javascript-functions-and-closures" },
          { title: "Array Methods", article: "javascript-array-methods" },
        ],
      },
      {
        title: "Asynchronous JavaScript",
        lessons: [
          { title: "Promises and Async/Await", article: "javascript-promises-async-await" },
          { title: "The Event Loop", article: "javascript-event-loop" },
          { title: "JavaScript Quiz", quiz: "javascript-quiz" },
        ],
      },
    ],
  },
  {
    slug: "full-stack-web-development",
    title: "Full-Stack Web Development",
    subtitle: "HTML, CSS, HTTP and REST APIs, build and ship real web apps.",
    description:
      "Learn how the web works end to end: accessible semantic markup, responsive layouts with Flexbox and Grid, the HTTP protocol and designing REST APIs. Includes capstone projects to build your portfolio.",
    topic: "Web Development",
    level: "BEGINNER",
    color: "#84CC16",
    featured: true,
    outcomes: ["Write accessible, semantic HTML", "Build responsive layouts", "Understand HTTP deeply", "Design and consume REST APIs"],
    modules: [
      {
        title: "Frontend Foundations",
        lessons: [
          { title: "Semantic HTML and Accessibility", article: "semantic-html", preview: true },
          { title: "Flexbox and Grid", article: "css-flexbox-and-grid" },
        ],
      },
      {
        title: "The Backend Side",
        lessons: [
          { title: "How HTTP Works", article: "how-http-works" },
          { title: "REST APIs with fetch", article: "rest-apis-with-fetch" },
        ],
      },
    ],
  },
  {
    slug: "database-management-systems",
    title: "Database Management Systems",
    subtitle: "SQL, normalization, transactions and indexing for interviews and real systems.",
    description:
      "Everything about relational databases that interviews and production systems demand: the relational model, SQL joins, normal forms, ACID transactions and B+ tree indexes.",
    topic: "DBMS",
    level: "INTERMEDIATE",
    color: "#EF4444",
    featured: false,
    outcomes: ["Design normalised schemas", "Write complex SQL joins", "Reason about isolation levels", "Speed up queries with indexes"],
    modules: [
      {
        title: "Relational Fundamentals",
        lessons: [
          { title: "Introduction to DBMS", article: "introduction-to-dbms", preview: true },
          { title: "SQL Joins", article: "sql-joins" },
          { title: "Normalization", article: "database-normalization" },
        ],
      },
      {
        title: "Internals",
        lessons: [
          { title: "Transactions and ACID", article: "transactions-and-acid" },
          { title: "Indexing and B+ Trees", article: "database-indexing" },
          { title: "DBMS Mock Test", quiz: "dbms-mock-test" },
        ],
      },
    ],
  },
  {
    slug: "operating-systems",
    title: "Operating Systems",
    subtitle: "Processes, scheduling, deadlocks and memory, the OS concepts every engineer needs.",
    description:
      "A practical tour of operating-system internals with simulations you can run: processes vs threads, CPU scheduling, deadlock handling and virtual memory with paging.",
    topic: "Operating Systems",
    level: "ADVANCED",
    color: "#A78BFA",
    featured: false,
    outcomes: ["Explain processes and threads", "Compute scheduling metrics", "Prevent and detect deadlocks", "Understand paging and page replacement"],
    modules: [
      {
        title: "Processes & Scheduling",
        lessons: [
          { title: "Processes vs Threads", article: "processes-and-threads", preview: true },
          { title: "CPU Scheduling", article: "cpu-scheduling-algorithms" },
        ],
      },
      {
        title: "Concurrency & Memory",
        lessons: [
          { title: "Deadlocks", article: "deadlocks" },
          { title: "Paging and Virtual Memory", article: "memory-management-paging" },
          { title: "Operating Systems Quiz", quiz: "operating-systems-quiz" },
        ],
      },
    ],
  },
];

export const badges = [
  { slug: "first-blood", name: "First Blood", description: "Solve your first problem.", icon: "Sword", tier: "BRONZE", color: "#84CC16", criteria: { type: "solved", count: 1 }, xpReward: 20 },
  { slug: "problem-solver-10", name: "Problem Solver", description: "Solve 10 problems.", icon: "Puzzle", tier: "SILVER", color: "#06B6D4", criteria: { type: "solved", count: 10 }, xpReward: 50 },
  { slug: "problem-crusher-25", name: "Problem Crusher", description: "Solve 25 problems.", icon: "Hammer", tier: "GOLD", color: "#F59E0B", criteria: { type: "solved", count: 25 }, xpReward: 150 },
  { slug: "hard-hitter", name: "Hard Hitter", description: "Solve 3 Hard problems.", icon: "Mountain", tier: "GOLD", color: "#EF4444", criteria: { type: "solvedHard", count: 3 }, xpReward: 120 },
  { slug: "streak-7", name: "On Fire", description: "Keep a 7-day streak.", icon: "Flame", tier: "BRONZE", color: "#F59E0B", criteria: { type: "streak", count: 7 }, xpReward: 50 },
  { slug: "streak-30", name: "Unstoppable", description: "Keep a 30-day streak.", icon: "Zap", tier: "PLATINUM", color: "#7C3AED", criteria: { type: "streak", count: 30 }, xpReward: 300 },
  { slug: "bookworm", name: "Bookworm", description: "Read 10 articles.", icon: "BookOpen", tier: "BRONZE", color: "#A78BFA", criteria: { type: "articles", count: 10 }, xpReward: 40 },
  { slug: "scholar", name: "Scholar", description: "Read 30 articles.", icon: "GraduationCap", tier: "GOLD", color: "#06B6D4", criteria: { type: "articles", count: 30 }, xpReward: 150 },
  { slug: "course-finisher", name: "Course Finisher", description: "Complete your first course.", icon: "Award", tier: "SILVER", color: "#84CC16", criteria: { type: "courses", count: 1 }, xpReward: 100 },
  { slug: "quiz-ace", name: "Quiz Ace", description: "Score 100% on a quiz.", icon: "Target", tier: "SILVER", color: "#F59E0B", criteria: { type: "perfectQuiz", count: 1 }, xpReward: 60 },
  { slug: "contestant", name: "Contestant", description: "Participate in a contest.", icon: "Trophy", tier: "BRONZE", color: "#06B6D4", criteria: { type: "contests", count: 1 }, xpReward: 40 },
  { slug: "podium", name: "Podium Finish", description: "Finish in the top 3 of a contest.", icon: "Medal", tier: "PLATINUM", color: "#F59E0B", criteria: { type: "podium", count: 1 }, xpReward: 250 },
  { slug: "polyglot", name: "Polyglot", description: "Get Accepted in 3 different languages.", icon: "Languages", tier: "SILVER", color: "#A78BFA", criteria: { type: "languages", count: 3 }, xpReward: 80 },
  { slug: "helping-hand", name: "Helping Hand", description: "Have an answer accepted in the Doubts forum.", icon: "HeartHandshake", tier: "SILVER", color: "#EF4444", criteria: { type: "acceptedAnswers", count: 1 }, xpReward: 70 },
  { slug: "night-owl", name: "Night Owl", description: "Get an Accepted verdict between midnight and 4 AM.", icon: "Moon", tier: "BRONZE", color: "#7C3AED", criteria: { type: "nightOwl", count: 1 }, xpReward: 30 },
] as const;

export const students = [
  { name: "Aarav Sharma", email: "student@kodshala.com", college: "IIT Delhi", country: "IN", bio: "Final-year CSE. Graphs > everything." },
  { name: "Diya Patel", email: "diya.patel@kodshala.com", college: "NIT Trichy", country: "IN", bio: "Competitive programmer and chai enthusiast." },
  { name: "Kabir Singh", email: "kabir.singh@kodshala.com", college: "IIT Delhi", country: "IN", bio: "Backend dev in the making." },
  { name: "Ananya Iyer", email: "ananya.iyer@kodshala.com", college: "BITS Pilani", country: "IN", bio: "SDE intern · DP lover." },
  { name: "Rohan Mehta", email: "rohan.mehta@kodshala.com", college: "VIT Vellore", country: "IN", bio: "Learning web dev one div at a time." },
  { name: "Ishita Rao", email: "ishita.rao@kodshala.com", college: "IIIT Hyderabad", country: "IN", bio: "ML + DSA." },
  { name: "Vihaan Gupta", email: "vihaan.gupta@kodshala.com", college: "NIT Trichy", country: "IN", bio: "Codeforces Expert." },
  { name: "Saanvi Nair", email: "saanvi.nair@kodshala.com", college: "BITS Pilani", country: "IN", bio: "Python is my first language." },
  { name: "Arjun Reddy", email: "arjun.reddy@kodshala.com", college: "IIT Bombay", country: "IN", bio: "Systems & OS nerd." },
  { name: "Meera Joshi", email: "meera.joshi@kodshala.com", college: "IIT Bombay", country: "IN", bio: "Frontend + accessibility advocate." },
] as const;

export const roadmaps = [
  {
    slug: "dsa",
    title: "DSA Roadmap",
    description: "The order we recommend to go from zero to interview-ready in data structures and algorithms.",
    nodes: [
      { id: "complexity", label: "Big-O & Complexity", x: 0, y: 0, href: "/tutorials/time-and-space-complexity", kind: "core" },
      { id: "arrays", label: "Arrays & Strings", x: 0, y: 1, href: "/tutorials/arrays-introduction", kind: "core" },
      { id: "hashing", label: "Hashing", x: -1, y: 2, href: "/tutorials/hashing-and-hash-maps", kind: "core" },
      { id: "two-pointers", label: "Two Pointers", x: 1, y: 2, href: "/tutorials/two-pointers-technique", kind: "core" },
      { id: "sliding", label: "Sliding Window", x: 1, y: 3, href: "/tutorials/sliding-window-technique", kind: "core" },
      { id: "binary-search", label: "Binary Search", x: -1, y: 3, href: "/tutorials/binary-search-guide", kind: "core" },
      { id: "recursion", label: "Recursion & Backtracking", x: 0, y: 4, href: "/tutorials/recursion-and-backtracking", kind: "core" },
      { id: "sorting", label: "Sorting", x: -1, y: 5, href: "/tutorials/sorting-algorithms", kind: "optional" },
      { id: "linked-list", label: "Linked Lists", x: 1, y: 5, href: "/tutorials/linked-list-basics", kind: "core" },
      { id: "stack-queue", label: "Stacks & Queues", x: 1, y: 6, href: "/tutorials/stacks-and-queues", kind: "core" },
      { id: "trees", label: "Trees & BST", x: 0, y: 7, href: "/tutorials/binary-search-trees", kind: "core" },
      { id: "graphs", label: "Graphs: BFS/DFS", x: -1, y: 8, href: "/tutorials/graph-traversal-bfs-dfs", kind: "core" },
      { id: "dijkstra", label: "Shortest Paths", x: -1, y: 9, href: "/tutorials/dijkstra-shortest-path", kind: "advanced" },
      { id: "dp", label: "Dynamic Programming", x: 1, y: 8, href: "/tutorials/dynamic-programming-introduction", kind: "advanced" },
      { id: "sheet", label: "Top Interview Sheet", x: 0, y: 10, href: "/sheets/top-interview-30", kind: "practice" },
    ],
    edges: [
      ["complexity", "arrays"], ["arrays", "hashing"], ["arrays", "two-pointers"], ["two-pointers", "sliding"], ["hashing", "binary-search"],
      ["binary-search", "recursion"], ["sliding", "recursion"], ["recursion", "sorting"], ["recursion", "linked-list"], ["linked-list", "stack-queue"],
      ["stack-queue", "trees"], ["sorting", "trees"], ["trees", "graphs"], ["trees", "dp"], ["graphs", "dijkstra"], ["dp", "sheet"], ["dijkstra", "sheet"],
    ],
  },
  {
    slug: "web-development",
    title: "Web Development Roadmap",
    description: "From your first HTML page to deploying a full-stack app.",
    nodes: [
      { id: "html", label: "Semantic HTML", x: 0, y: 0, href: "/tutorials/semantic-html", kind: "core" },
      { id: "css", label: "CSS Flexbox & Grid", x: 0, y: 1, href: "/tutorials/css-flexbox-and-grid", kind: "core" },
      { id: "js", label: "JavaScript Basics", x: 0, y: 2, href: "/tutorials/javascript-variables-and-types", kind: "core" },
      { id: "closures", label: "Functions & Closures", x: -1, y: 3, href: "/tutorials/javascript-functions-and-closures", kind: "core" },
      { id: "arrays", label: "Array Methods", x: 1, y: 3, href: "/tutorials/javascript-array-methods", kind: "core" },
      { id: "async", label: "Async / Await", x: 0, y: 4, href: "/tutorials/javascript-promises-async-await", kind: "core" },
      { id: "event-loop", label: "Event Loop", x: 1, y: 5, href: "/tutorials/javascript-event-loop", kind: "advanced" },
      { id: "http", label: "How HTTP Works", x: -1, y: 5, href: "/tutorials/how-http-works", kind: "core" },
      { id: "rest", label: "REST APIs", x: 0, y: 6, href: "/tutorials/rest-apis-with-fetch", kind: "core" },
      { id: "sql", label: "SQL & Databases", x: 0, y: 7, href: "/tutorials/sql-joins", kind: "core" },
      { id: "course", label: "Full-Stack Course", x: 0, y: 8, href: "/courses/full-stack-web-development", kind: "practice" },
    ],
    edges: [["html", "css"], ["css", "js"], ["js", "closures"], ["js", "arrays"], ["closures", "async"], ["arrays", "async"], ["async", "event-loop"], ["async", "http"], ["http", "rest"], ["event-loop", "rest"], ["rest", "sql"], ["sql", "course"]],
  },
  {
    slug: "ai-ml",
    title: "AI / ML Roadmap",
    description: "The programming and math foundations to start a machine-learning journey.",
    nodes: [
      { id: "python", label: "Python Basics", x: 0, y: 0, href: "/tutorials/python-getting-started", kind: "core" },
      { id: "collections", label: "Lists & Dicts", x: 0, y: 1, href: "/tutorials/python-lists-and-dictionaries", kind: "core" },
      { id: "functions", label: "Functions", x: -1, y: 2, href: "/tutorials/python-functions-and-lambdas", kind: "core" },
      { id: "oop", label: "OOP in Python", x: 1, y: 2, href: "/tutorials/python-oop-classes", kind: "core" },
      { id: "generators", label: "Generators", x: 0, y: 3, href: "/tutorials/python-comprehensions-generators", kind: "optional" },
      { id: "complexity", label: "Complexity", x: -1, y: 4, href: "/tutorials/time-and-space-complexity", kind: "core" },
      { id: "sql", label: "SQL for Data", x: 1, y: 4, href: "/tutorials/sql-joins", kind: "core" },
      { id: "dp", label: "Optimisation Thinking (DP)", x: 0, y: 5, href: "/tutorials/dynamic-programming-introduction", kind: "advanced" },
      { id: "graphs", label: "Graphs", x: 0, y: 6, href: "/tutorials/graph-traversal-bfs-dfs", kind: "advanced" },
      { id: "course", label: "Python Masterclass", x: 0, y: 7, href: "/courses/python-programming", kind: "practice" },
    ],
    edges: [["python", "collections"], ["collections", "functions"], ["collections", "oop"], ["functions", "generators"], ["oop", "generators"], ["generators", "complexity"], ["generators", "sql"], ["complexity", "dp"], ["sql", "dp"], ["dp", "graphs"], ["graphs", "course"]],
  },
];
