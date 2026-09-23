import type { Category, NavGroup } from "./types";

// Navigation groups map to the horizontal category bar in the header.
export const NAV_GROUPS: { group: NavGroup; label: string; href: string }[] = [
  { group: "tutorials", label: "Tutorials", href: "/tutorials" },
  { group: "programming", label: "Programming", href: "/programming" },
  { group: "web-development", label: "Web Development", href: "/web-development" },
  { group: "computer-science", label: "Computer Science", href: "/computer-science" },
  { group: "cyber-security", label: "Cyber Security", href: "/cyber-security" },
  { group: "software-engineering", label: "Software Engineering", href: "/software-engineering" },
  { group: "assignments", label: "Assignments", href: "/type/assignment" },
  { group: "lab-work", label: "Lab Work", href: "/type/lab" },
  { group: "exam-preparation", label: "Exam Preparation", href: "/exam-preparation" },
  { group: "notes", label: "Notes", href: "/type/notes" },
  // Note: computer-science, cyber-security and software-engineering resolve to
  // their same-named category landing pages (handled by /[category]).
];

export const categories: Category[] = [
  {
    slug: "python",
    name: "Python Programming",
    shortName: "Python",
    description:
      "Python from the ground up for GGSIPU BCA and B.Tech students: syntax, data types, functions, OOP, file handling and libraries. Includes semester notes, lab programs, assignments and practice questions.",
    group: "programming",
    order: 1,
    subcategories: [
      { slug: "basics", name: "Python Basics" },
      { slug: "functions", name: "Functions" },
      { slug: "oop", name: "Object-Oriented Python" },
      { slug: "data-structures", name: "Data Structures" },
    ],
    popularTopics: [
      "map() Function",
      "List Comprehension",
      "Dictionaries",
      "Exception Handling",
      "File Handling",
      "Lambda Functions",
    ],
  },
  {
    slug: "java",
    name: "Core Java",
    shortName: "Java",
    description:
      "Core Java for IPU coursework: language fundamentals, object-oriented programming, exception handling, collections and multithreading. Aligned to BCA and B.Tech syllabus with notes, labs and exam questions.",
    group: "programming",
    order: 2,
    subcategories: [
      { slug: "basics", name: "Java Basics" },
      { slug: "oop", name: "OOP in Java" },
      { slug: "collections", name: "Collections" },
      { slug: "exceptions", name: "Exception Handling" },
    ],
    popularTopics: [
      "Inheritance",
      "Interfaces",
      "Exception Handling",
      "ArrayList vs LinkedList",
      "Method Overloading",
      "Static Keyword",
    ],
  },
  {
    slug: "cpp",
    name: "C++",
    shortName: "C++",
    description:
      "C++ programming covering procedural and object-oriented concepts, pointers, classes, inheritance, templates and the standard template library.",
    group: "programming",
    order: 3,
    subcategories: [
      { slug: "basics", name: "C++ Basics" },
      { slug: "oop", name: "OOP in C++" },
      { slug: "pointers", name: "Pointers & Memory" },
    ],
    popularTopics: [
      "Pointers",
      "Classes and Objects",
      "Operator Overloading",
      "Inheritance",
      "Virtual Functions",
      "STL Vectors",
    ],
  },
  {
    slug: "csharp",
    name: "C#",
    shortName: "C#",
    description:
      "C# programming for the .NET platform covering language basics, object-oriented design, properties, delegates, LINQ and exception handling.",
    group: "programming",
    order: 4,
    subcategories: [
      { slug: "basics", name: "C# Basics" },
      { slug: "oop", name: "OOP in C#" },
    ],
    popularTopics: [
      "Properties",
      "Delegates",
      "LINQ",
      "Exception Handling",
      "Interfaces",
      "Collections",
    ],
  },
  {
    slug: "sql",
    name: "SQL & Databases",
    shortName: "SQL",
    description:
      "Structured Query Language and relational database concepts, queries, joins, aggregate functions, normalization, indexes and transactions.",
    group: "computer-science",
    order: 5,
    subcategories: [
      { slug: "queries", name: "Queries" },
      { slug: "joins", name: "Joins" },
      { slug: "design", name: "Database Design" },
    ],
    popularTopics: [
      "SELECT Statement",
      "Joins",
      "GROUP BY",
      "Normalization",
      "Subqueries",
      "Indexes",
    ],
  },
  {
    slug: "data-structures",
    name: "Data Structures & Algorithms",
    shortName: "Data Structures",
    description:
      "Data Structures for IPU BCA and B.Tech: arrays, linked lists, stacks, queues, trees, graphs, sorting and searching, with complexity analysis. A high-weightage exam subject with labs and PYQs.",
    group: "computer-science",
    order: 6,
    subcategories: [
      { slug: "linear", name: "Linear Structures" },
      { slug: "trees", name: "Trees & Graphs" },
      { slug: "algorithms", name: "Algorithms" },
    ],
    popularTopics: [
      "Linked Lists",
      "Stacks and Queues",
      "Binary Search Tree",
      "Sorting Algorithms",
      "Big-O Notation",
      "Graph Traversal",
    ],
  },
  {
    slug: "computer-science",
    name: "Computer Science",
    shortName: "Computer Science",
    description:
      "Foundational computer science topics, operating systems, computer networks, number systems, and core theory needed across the curriculum.",
    group: "computer-science",
    order: 7,
    subcategories: [
      { slug: "os", name: "Operating Systems" },
      { slug: "networks", name: "Computer Networks" },
    ],
    popularTopics: [
      "Process Scheduling",
      "Deadlocks",
      "OSI Model",
      "Number Systems",
      "Memory Management",
    ],
  },
  {
    slug: "cyber-security",
    name: "Cyber Security",
    shortName: "Cyber Security",
    description:
      "Cyber security fundamentals and cyber law, threats, cryptography basics, network security, secure practices and the legal framework governing them.",
    group: "cyber-security",
    order: 8,
    subcategories: [
      { slug: "fundamentals", name: "Fundamentals" },
      { slug: "cyber-law", name: "Cyber Law" },
    ],
    popularTopics: [
      "Types of Attacks",
      "Cryptography Basics",
      "Firewalls",
      "IT Act 2000",
      "Malware Types",
      "Authentication",
    ],
  },
  {
    slug: "software-engineering",
    name: "Software Engineering",
    shortName: "Software Engineering",
    description:
      "Software Engineering for IPU students: the software development life cycle, process models, requirements engineering, design, testing and project management. Theory-heavy paper, ideal for note-based revision.",
    group: "software-engineering",
    order: 9,
    subcategories: [
      { slug: "process", name: "Process Models" },
      { slug: "design", name: "Design" },
      { slug: "testing", name: "Testing" },
    ],
    popularTopics: [
      "SDLC",
      "Waterfall Model",
      "Agile Model",
      "Requirement Analysis",
      "Software Testing",
      "UML Diagrams",
    ],
  },
  {
    slug: "oose",
    name: "Object-Oriented Software Engineering",
    shortName: "OOSE",
    description:
      "Object-Oriented Software Engineering, analysis and design using UML, use cases, design patterns and object-oriented methodologies.",
    group: "software-engineering",
    order: 10,
    subcategories: [
      { slug: "analysis", name: "OO Analysis" },
      { slug: "design", name: "OO Design" },
    ],
    popularTopics: [
      "Use Case Diagrams",
      "Class Diagrams",
      "Sequence Diagrams",
      "Design Patterns",
      "UML Basics",
    ],
  },
  {
    slug: "oopj",
    name: "Object-Oriented Programming with Java",
    shortName: "OOPJ",
    description:
      "Object-Oriented Programming with Java (OOPJ), the university course covering classes, inheritance, polymorphism, abstraction, interfaces and packages with lab work and assignments.",
    group: "programming",
    order: 11,
    subcategories: [
      { slug: "concepts", name: "OOP Concepts" },
      { slug: "lab", name: "Lab Programs" },
    ],
    popularTopics: [
      "Inheritance",
      "Polymorphism",
      "Abstraction",
      "Encapsulation",
      "Packages",
      "Interfaces",
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoriesByGroup(group: NavGroup): Category[] {
  return categories.filter((c) => c.group === group).sort((a, b) => a.order - b.order);
}
