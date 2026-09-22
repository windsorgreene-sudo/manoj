import type { Article } from "./types";

// Seed content. Text fields accept either a plain English string or a
// { en, hi } object where `hi` is a Hinglish (Roman Hindi) version shown when
// the reader selects Hinglish. Missing Hinglish falls back to English.
// No em-dashes are used anywhere in the content.

export const articles: Article[] = [
  // ---------------------------------------------------------------- PYTHON
  {
    slug: "map-function",
    title: "map() Function in Python",
    titleHi: "Python mein map() Function",
    description:
      "Python ka built-in map() function samjho: syntax, parameters aur real examples jisse aap ek function ko iterable ke har item par laga sakein.",
    descriptionHi:
      "Python ka built-in map() function samjho: syntax, parameters aur real examples jisse aap ek function ko iterable ke har item par laga sakein.",
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
    seoTitle: "map() Function in Python: Syntax, Parameters and Examples",
    seoDescription:
      "A clear guide to Python's map() function with syntax, parameters, worked examples and common mistakes.",
    body: [
      {
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "map() applies one function to every item of an iterable and returns an iterator.",
            hi: "map() ek function ko iterable ke har element par lagata hai aur ek iterator return karta hai.",
          },
          {
            en: "It does not change the original list. It produces new values.",
            hi: "Ye original list ko change nahi karta. Ye naye values banata hai.",
          },
          {
            en: "Wrap the result in list() to see the values.",
            hi: "Result dekhne ke liye use list() mein daalo.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "The map() function is one of Python's built-in higher-order functions. It applies a given function to every item of an iterable such as a list or tuple, and returns a map object, which is an iterator that yields the transformed values.",
          hi: "map() Python ke built-in higher-order functions mein se ek hai. Ye ek diye gaye function ko kisi iterable (jaise list ya tuple) ke har item par apply karta hai, aur ek map object return karta hai. Ye map object ek iterator hota hai jo transform kiye hue values deta hai.",
        },
      },
      { type: "heading", level: 2, id: "syntax", text: { en: "Syntax", hi: "Syntax" } },
      {
        type: "code",
        block: { language: "python", code: "map(function, iterable, *iterables)" },
      },
      {
        type: "heading",
        level: 2,
        id: "parameters",
        text: { en: "Parameters", hi: "Parameters" },
      },
      {
        type: "list",
        items: [
          {
            en: "function: the function that is applied to each element of the iterable.",
            hi: "function: wo function jo iterable ke har element par lagta hai.",
          },
          {
            en: "iterable: one or more iterables whose items are passed to the function.",
            hi: "iterable: ek ya zyada iterables jinke items function ko pass hote hain.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "map() returns an iterator. To see the values you usually convert it to a list or loop over it.",
          hi: "map() ek iterator return karta hai. Values dekhne ke liye aksar ise list mein convert karte hain ya loop chalate hain.",
        },
      },
      { type: "heading", level: 2, id: "examples", text: { en: "Examples", hi: "Examples" } },
      {
        type: "paragraph",
        text: {
          en: "Squaring every number in a list using a named function:",
          hi: "Ek named function se list ke har number ka square nikalna:",
        },
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
        text: {
          en: "The same thing written more compactly with a lambda expression:",
          hi: "Yahi cheez lambda expression se chhote form mein:",
        },
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
        text: { en: "Using multiple iterables", hi: "Ek se zyada iterables" },
      },
      {
        type: "paragraph",
        text: {
          en: "When you pass more than one iterable, the function must take that many arguments. map() stops when the shortest iterable is exhausted.",
          hi: "Jab aap ek se zyada iterable pass karte ho, to function ko utne hi arguments lene padte hain. map() tab ruk jaata hai jab sabse chhoti iterable khatam ho jaati hai.",
        },
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
        text: { en: "Common mistakes", hi: "Common galtiyan" },
      },
      {
        type: "note",
        variant: "warning",
        text: {
          en: "map() returns an iterator, not a list. Printing the map object directly shows something like <map object at 0x...>. Wrap it in list() to view the results.",
          hi: "map() list nahi, iterator return karta hai. Seedha print karne par <map object at 0x...> jaisa dikhta hai. Result dekhne ke liye list() mein daalo.",
        },
      },
      {
        type: "list",
        items: [
          {
            en: "An iterator can only be consumed once. After you convert it to a list, iterating again yields nothing.",
            hi: "Iterator ek hi baar use hota hai. Ek baar list mein convert karne ke baad dobara loop chalane par kuch nahi milta.",
          },
          {
            en: "The function is not called immediately. map() is lazy and evaluates items only when they are requested.",
            hi: "Function turant call nahi hota. map() lazy hota hai aur items ko tabhi evaluate karta hai jab zaroorat padti hai.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "related-concepts",
        text: { en: "Related concepts", hi: "Judte hue concepts" },
      },
      {
        type: "paragraph",
        text: {
          en: "map() is often used together with filter() and reduce(). In modern Python, a list comprehension is frequently preferred for readability, for example [n * n for n in numbers].",
          hi: "map() ko aksar filter() aur reduce() ke saath use kiya jaata hai. Aaj kal Python mein readability ke liye list comprehension zyada use hoti hai, jaise [n * n for n in numbers].",
        },
      },
      {
        type: "note",
        variant: "tip",
        text: {
          en: "Use map() when you already have a named function to apply. Use a list comprehension when the transformation is simple and inline.",
          hi: "map() tab use karo jab pehle se ek named function ho. Simple aur inline transformation ke liye list comprehension use karo.",
        },
      },
    ],
  },
  {
    slug: "list-comprehension",
    title: "List Comprehension in Python",
    titleHi: "Python mein List Comprehension",
    description:
      "Python mein list banane ka short aur readable tareeka. Syntax, conditional aur nested comprehension examples ke saath samjho.",
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
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "A list comprehension builds a new list in one readable line.",
            hi: "List comprehension ek readable line mein nayi list banati hai.",
          },
          {
            en: "You can filter with an if condition and transform with an expression.",
            hi: "if condition se filter kar sakte ho aur expression se transform.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "A list comprehension provides a short syntax to create a new list from an existing iterable, optionally filtering or transforming items in a single expression.",
          hi: "List comprehension ek chhota syntax deti hai jisse existing iterable se nayi list banti hai, aur ek hi expression mein items ko filter ya transform kiya jaa sakta hai.",
        },
      },
      { type: "heading", level: 2, id: "syntax", text: { en: "Syntax", hi: "Syntax" } },
      {
        type: "code",
        block: { language: "python", code: "[expression for item in iterable if condition]" },
      },
      { type: "heading", level: 2, id: "examples", text: { en: "Examples", hi: "Examples" } },
      {
        type: "code",
        block: {
          language: "python",
          code: "# Squares of even numbers from 0 to 9\nsquares = [n * n for n in range(10) if n % 2 == 0]\nprint(squares)\n# Output: [0, 4, 16, 36, 64]",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Comprehensions can also build lists from strings or other lists.",
          hi: "Comprehension strings ya doosri lists se bhi nayi list bana sakti hai.",
        },
      },
      {
        type: "code",
        block: {
          language: "python",
          code: "names = ['amit', 'neha', 'raj']\nupper = [name.title() for name in names]\nprint(upper)\n# Output: ['Amit', 'Neha', 'Raj']",
        },
      },
      {
        type: "note",
        variant: "tip",
        text: {
          en: "Keep comprehensions to a single, readable line. If the logic grows complex, a regular for-loop is clearer.",
          hi: "Comprehension ko ek readable line tak rakho. Agar logic complex ho jaaye to normal for-loop zyada saaf lagta hai.",
        },
      },
    ],
  },
  {
    slug: "exception-handling",
    title: "Exception Handling in Python",
    titleHi: "Python mein Exception Handling",
    description:
      "try, except, else aur finally se runtime errors ko safely handle karo taaki program crash na ho. Common exceptions ke examples ke saath.",
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
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "Exception handling stops your program from crashing on runtime errors.",
            hi: "Exception handling program ko runtime error par crash hone se bachati hai.",
          },
          {
            en: "try holds risky code, except handles the error, finally always runs.",
            hi: "try mein risky code, except mein error handle, aur finally hamesha chalta hai.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "Exception handling lets a program respond to runtime errors instead of crashing. Python uses try and except blocks to catch and handle exceptions.",
          hi: "Exception handling program ko runtime errors par crash hone ke bajaye sambhalne deti hai. Python try aur except blocks se exceptions ko catch aur handle karta hai.",
        },
      },
      {
        type: "heading",
        level: 2,
        id: "syntax",
        text: { en: "Basic structure", hi: "Basic structure" },
      },
      {
        type: "code",
        block: {
          language: "python",
          code: "try:\n    value = int(input('Enter a number: '))\n    print(10 / value)\nexcept ValueError:\n    print('That was not a valid number.')\nexcept ZeroDivisionError:\n    print('Cannot divide by zero.')\nelse:\n    print('No errors occurred.')\nfinally:\n    print('This always runs.')",
        },
      },
      {
        type: "table",
        headers: [
          { en: "Block", hi: "Block" },
          { en: "When it runs", hi: "Kab chalta hai" },
        ],
        rows: [
          [
            "try",
            {
              en: "Contains code that might raise an exception.",
              hi: "Isme wo code hota hai jo error de sakta hai.",
            },
          ],
          [
            "except",
            {
              en: "Runs when a matching exception is raised.",
              hi: "Jab matching exception aaye tab chalta hai.",
            },
          ],
          [
            "else",
            {
              en: "Runs only if no exception was raised.",
              hi: "Sirf tab chalta hai jab koi error na aaye.",
            },
          ],
          [
            "finally",
            {
              en: "Always runs, whether or not an exception occurred.",
              hi: "Hamesha chalta hai, error aaye ya na aaye.",
            },
          ],
        ],
      },
      {
        type: "note",
        variant: "tip",
        text: {
          en: "Catch specific exceptions like ValueError instead of a bare except. This avoids hiding bugs you did not expect.",
          hi: "Bare except ke bajaye ValueError jaisi specific exception catch karo. Isse aise bugs chhupte nahi jinki aapko ummeed nahi thi.",
        },
      },
    ],
  },
  {
    slug: "python-lab-assignment-1",
    title: "Python Lab Assignment 1: Basic Programs",
    titleHi: "Python Lab Assignment 1: Basic Programs",
    description:
      "Pehle practical ke liye introductory Python lab programs: arithmetic, even/odd check aur simple patterns.",
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
        text: {
          en: "This lab sheet contains introductory Python programs commonly given in the first practical session.",
          hi: "Is lab sheet mein wo shuruaati Python programs hain jo aksar pehle practical mein diye jaate hain.",
        },
      },
      {
        type: "heading",
        level: 2,
        id: "program-1",
        text: { en: "Program 1: Check even or odd", hi: "Program 1: Even ya odd check karo" },
      },
      {
        type: "code",
        block: {
          language: "python",
          code: "n = int(input('Enter a number: '))\nif n % 2 == 0:\n    print(n, 'is even')\nelse:\n    print(n, 'is odd')",
        },
      },
      {
        type: "heading",
        level: 2,
        id: "program-2",
        text: { en: "Program 2: Sum of first N numbers", hi: "Program 2: Pehle N numbers ka sum" },
      },
      {
        type: "code",
        block: {
          language: "python",
          code: "n = int(input('Enter N: '))\ntotal = sum(range(1, n + 1))\nprint('Sum =', total)",
        },
      },
    ],
  },
  {
    slug: "python-mcq-set-1",
    title: "Python MCQ Set 1: Basics",
    titleHi: "Python MCQ Set 1: Basics",
    description:
      "Python ke basics par practice multiple-choice questions: data types, operators aur control flow.",
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
        text: {
          en: "Practice questions to test your understanding of Python basics. Try to answer before checking.",
          hi: "Python basics ki samajh test karne ke liye practice questions. Answer dekhne se pehle khud try karo.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            en: "What is the output of type([])? (a) list (b) tuple (c) dict (d) set",
            hi: "type([]) ka output kya hoga? (a) list (b) tuple (c) dict (d) set",
          },
          {
            en: "Which keyword defines a function in Python? (a) func (b) def (c) function (d) lambda",
            hi: "Python mein function define karne wala keyword? (a) func (b) def (c) function (d) lambda",
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ JAVA
  {
    slug: "inheritance",
    title: "Inheritance in Java",
    titleHi: "Java mein Inheritance",
    description:
      "Java mein ek class doosri class ke properties aur methods kaise leti hai, types of inheritance aur super keyword ke saath.",
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
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "Inheritance lets a subclass reuse the fields and methods of a superclass.",
            hi: "Inheritance se subclass, superclass ke fields aur methods reuse kar leti hai.",
          },
          {
            en: "Use the extends keyword. Java does not allow extending more than one class.",
            hi: "extends keyword use hota hai. Java mein ek se zyada class extend nahi kar sakte.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "Inheritance is a core object-oriented programming concept in which a new class, called the subclass, is derived from an existing class, called the superclass. The subclass inherits the fields and methods of the superclass, which promotes code reuse.",
          hi: "Inheritance object-oriented programming ka ek core concept hai jisme ek nayi class (subclass) kisi purani class (superclass) se banti hai. Subclass, superclass ke fields aur methods inherit kar leti hai, jisse code reuse hota hai.",
        },
      },
      { type: "heading", level: 2, id: "syntax", text: { en: "Syntax", hi: "Syntax" } },
      {
        type: "code",
        block: {
          language: "java",
          code: "class Superclass {\n    // fields and methods\n}\n\nclass Subclass extends Superclass {\n    // additional fields and methods\n}",
        },
      },
      { type: "heading", level: 2, id: "example", text: { en: "Example", hi: "Example" } },
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
        text: { en: "Types of inheritance", hi: "Inheritance ke types" },
      },
      {
        type: "list",
        items: [
          {
            en: "Single inheritance: one subclass extends one superclass.",
            hi: "Single inheritance: ek subclass ek superclass ko extend karti hai.",
          },
          {
            en: "Multilevel inheritance: a class extends a subclass, forming a chain.",
            hi: "Multilevel inheritance: ek class kisi subclass ko extend karti hai, chain ban jaati hai.",
          },
          {
            en: "Hierarchical inheritance: multiple subclasses extend the same superclass.",
            hi: "Hierarchical inheritance: kai subclasses ek hi superclass ko extend karti hain.",
          },
        ],
      },
      {
        type: "note",
        variant: "info",
        text: {
          en: "Java does not support multiple inheritance with classes, so a class cannot extend more than one class. Interfaces are used to achieve a similar effect.",
          hi: "Java classes ke saath multiple inheritance support nahi karta, isliye ek class ek se zyada class extend nahi kar sakti. Similar kaam ke liye interfaces use hote hain.",
        },
      },
    ],
  },
  {
    slug: "exception-handling-java",
    title: "Exception Handling in Java",
    titleHi: "Java mein Exception Handling",
    description:
      "Java mein checked aur unchecked exceptions samjho aur unhe try, catch, finally aur throw se handle karo.",
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
        text: {
          en: "An exception is an event that disrupts the normal flow of a program. Java provides a robust mechanism to handle exceptions using try, catch, finally, throw and throws.",
          hi: "Exception ek aisa event hai jo program ke normal flow ko rok deta hai. Java exceptions ko handle karne ke liye try, catch, finally, throw aur throws deta hai.",
        },
      },
      {
        type: "code",
        block: {
          language: "java",
          code: "try {\n    int[] a = new int[3];\n    a[5] = 10; // throws ArrayIndexOutOfBoundsException\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println(\"Index out of bounds: \" + e.getMessage());\n} finally {\n    System.out.println(\"Cleanup runs here.\");\n}",
        },
      },
      {
        type: "note",
        variant: "tip",
        text: {
          en: "Checked exceptions must be handled or declared with throws. Unchecked exceptions (like NullPointerException) happen at runtime.",
          hi: "Checked exceptions ko handle karna ya throws se declare karna zaroori hai. Unchecked exceptions (jaise NullPointerException) runtime par aate hain.",
        },
      },
    ],
  },
  {
    slug: "oopj-inheritance-assignment",
    title: "Inheritance Assignment (OOPJ)",
    titleHi: "Inheritance Assignment (OOPJ)",
    description:
      "OOPJ course ke liye inheritance par programming assignment, problem statements aur expected output ke saath.",
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
        text: {
          en: "Solve the following problems demonstrating single, multilevel and hierarchical inheritance in Java.",
          hi: "Neeche diye problems solve karo jo Java mein single, multilevel aur hierarchical inheritance dikhate hain.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            en: "Create a class Employee with fields name and salary. Derive a class Manager that adds a department field.",
            hi: "Ek class Employee banao jisme name aur salary fields hon. Usse Manager class derive karo jo department field add kare.",
          },
          {
            en: "Demonstrate multilevel inheritance with classes Vehicle, Car and SportsCar.",
            hi: "Vehicle, Car aur SportsCar classes se multilevel inheritance dikhao.",
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------- C++
  {
    slug: "pointers",
    title: "Pointers in C++",
    titleHi: "C++ mein Pointers",
    description:
      "C++ mein pointers samjho: declaration, dereferencing, pointer arithmetic aur arrays ke saath sambandh.",
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
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "A pointer stores the memory address of another variable.",
            hi: "Pointer kisi doosre variable ka memory address store karta hai.",
          },
          {
            en: "& gives the address, * gives the value at that address.",
            hi: "& address deta hai, * us address ki value deta hai.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "A pointer is a variable that stores the memory address of another variable. Pointers are fundamental to C++ and enable dynamic memory, efficient array handling and pass-by-reference.",
          hi: "Pointer ek variable hai jo kisi doosre variable ka memory address store karta hai. Pointers C++ ka base hain aur dynamic memory, efficient array handling aur pass-by-reference possible banate hain.",
        },
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
        text: {
          en: "Always initialise pointers. A pointer that does not point to valid memory (a dangling or wild pointer) leads to undefined behaviour.",
          hi: "Pointers ko hamesha initialise karo. Jo pointer valid memory par point nahi karta (dangling ya wild pointer) wo undefined behaviour deta hai.",
        },
      },
    ],
  },
  {
    slug: "operator-overloading",
    title: "Operator Overloading in C++",
    titleHi: "C++ mein Operator Overloading",
    description:
      "C++ mein user-defined types ke liye operators ko naya matlab dena, operator overloading ke through.",
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
        text: {
          en: "Operator overloading lets you redefine the behaviour of operators such as + and == for objects of a user-defined class.",
          hi: "Operator overloading se aap + aur == jaise operators ka behaviour apni class ke objects ke liye redefine kar sakte ho.",
        },
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
    titleHi: "SQL Joins Aasaan Bhasha Mein",
    description:
      "SQL mein INNER, LEFT, RIGHT aur FULL join samjho, saaf examples aur result tables ke saath.",
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
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "A JOIN combines rows from two tables using a related column.",
            hi: "JOIN do tables ke rows ko ek related column ke through jodta hai.",
          },
          {
            en: "The join type decides which unmatched rows are kept.",
            hi: "Join ka type decide karta hai ki bina match wale rows rakhe jayenge ya nahi.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "A JOIN combines rows from two or more tables based on a related column. Choosing the right join type controls which rows appear in the result.",
          hi: "JOIN do ya zyada tables ke rows ko ek related column ke aadhar par jodta hai. Sahi join type chunne se decide hota hai ki result mein kaunse rows aayenge.",
        },
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
        headers: [
          { en: "Join type", hi: "Join type" },
          { en: "Rows returned", hi: "Kaunse rows aate hain" },
        ],
        rows: [
          [
            "INNER JOIN",
            {
              en: "Only rows with a match in both tables.",
              hi: "Sirf wahi rows jinka match dono tables mein ho.",
            },
          ],
          [
            "LEFT JOIN",
            {
              en: "All rows from the left table, matched rows from the right.",
              hi: "Left table ke saare rows, right ke sirf matched rows.",
            },
          ],
          [
            "RIGHT JOIN",
            {
              en: "All rows from the right table, matched rows from the left.",
              hi: "Right table ke saare rows, left ke sirf matched rows.",
            },
          ],
          [
            "FULL JOIN",
            {
              en: "All rows from both tables, matched where possible.",
              hi: "Dono tables ke saare rows, jahan match ho wahan jud jate hain.",
            },
          ],
        ],
      },
    ],
  },
  {
    slug: "normalization",
    title: "Database Normalization (1NF, 2NF, 3NF)",
    titleHi: "Database Normalization (1NF, 2NF, 3NF)",
    description:
      "Database normalization aur pehle teen normal forms examples ke saath, taaki redundancy aur anomalies kam hon.",
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
        text: {
          en: "Normalization organises the columns and tables of a database to minimise data redundancy and avoid update anomalies.",
          hi: "Normalization database ke columns aur tables ko is tarah organise karta hai ki data redundancy kam ho aur update anomalies na aayein.",
        },
      },
      {
        type: "list",
        items: [
          {
            en: "1NF: atomic values, no repeating groups.",
            hi: "1NF: atomic values, koi repeating group nahi.",
          },
          {
            en: "2NF: 1NF plus no partial dependency on a composite key.",
            hi: "2NF: 1NF ke saath composite key par koi partial dependency nahi.",
          },
          {
            en: "3NF: 2NF plus no transitive dependency.",
            hi: "3NF: 2NF ke saath koi transitive dependency nahi.",
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------- DATA STRUCTURES
  {
    slug: "linked-list",
    title: "Linked List: Introduction and Operations",
    titleHi: "Linked List: Introduction aur Operations",
    description:
      "Singly linked list data structure samjho, node representation aur insertion/deletion operations ke saath.",
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
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "A linked list stores elements as nodes connected by pointers.",
            hi: "Linked list elements ko nodes ke roop mein rakhti hai jo pointers se jude hote hain.",
          },
          {
            en: "Insertion and deletion are easy, but random access is slow.",
            hi: "Insert aur delete aasaan hai, par random access slow hoti hai.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "A linked list is a linear data structure where elements, called nodes, are linked using pointers. Each node stores data and a reference to the next node.",
          hi: "Linked list ek linear data structure hai jisme elements (nodes) pointers se jude hote hain. Har node data aur agle node ka reference rakhti hai.",
        },
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
    titleHi: "Sorting Algorithms Overview",
    description:
      "Common sorting algorithms (bubble, selection, insertion, merge, quick) unki time complexity ke saath compare karo.",
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
        headers: [
          { en: "Algorithm", hi: "Algorithm" },
          { en: "Best", hi: "Best" },
          { en: "Average", hi: "Average" },
          { en: "Worst", hi: "Worst" },
        ],
        rows: [
          ["Bubble Sort", "O(n)", "O(n^2)", "O(n^2)"],
          ["Merge Sort", "O(n log n)", "O(n log n)", "O(n log n)"],
          ["Quick Sort", "O(n log n)", "O(n log n)", "O(n^2)"],
        ],
      },
    ],
  },

  // ---------------------------------------------------- SOFTWARE ENGINEERING
  {
    slug: "sdlc",
    title: "Software Development Life Cycle (SDLC)",
    titleHi: "Software Development Life Cycle (SDLC)",
    description:
      "SDLC ke phases samjho, requirement analysis se lekar maintenance tak, saaf steps ke saath.",
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
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "SDLC is a step-by-step process to build good quality software.",
            hi: "SDLC achhi quality ka software banane ka step-by-step process hai.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "The Software Development Life Cycle (SDLC) is a structured process used to design, develop and test high-quality software. It defines a sequence of phases, each producing deliverables.",
          hi: "Software Development Life Cycle (SDLC) ek structured process hai jisse high-quality software design, develop aur test kiya jaata hai. Isme phases ka ek order hota hai, aur har phase kuch deliverables deta hai.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          { en: "Requirement analysis", hi: "Requirement analysis" },
          { en: "System design", hi: "System design" },
          { en: "Implementation (coding)", hi: "Implementation (coding)" },
          { en: "Testing", hi: "Testing" },
          { en: "Deployment", hi: "Deployment" },
          { en: "Maintenance", hi: "Maintenance" },
        ],
      },
    ],
  },
  {
    slug: "agile-model",
    title: "Agile Software Development Model",
    titleHi: "Agile Software Development Model",
    description:
      "Agile model of software development, uske principles, iterations aur waterfall se comparison.",
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
        text: {
          en: "Agile is an iterative approach to software delivery that builds software incrementally from the start of the project, rather than delivering it all at the end.",
          hi: "Agile software delivery ka ek iterative tareeka hai jo software ko project ki shuruaat se hi thoda-thoda karke banata hai, na ki sab kuch end mein deta hai.",
        },
      },
    ],
  },

  // ------------------------------------------------------------------- OOSE
  {
    slug: "use-case-diagram",
    title: "Use Case Diagrams in UML",
    titleHi: "UML mein Use Case Diagrams",
    description:
      "UML use case diagram banana seekho: actors, use cases aur relationships, object-oriented analysis ke liye.",
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
        text: {
          en: "A use case diagram is a UML behavioural diagram that shows the interactions between actors, which are users or external systems, and use cases, which are functions the system performs.",
          hi: "Use case diagram ek UML behavioural diagram hai jo actors (users ya external systems) aur use cases (system ke functions) ke beech interaction dikhata hai.",
        },
      },
    ],
  },

  // ---------------------------------------------------------- CYBER SECURITY
  {
    slug: "types-of-cyber-attacks",
    title: "Types of Cyber Attacks",
    titleHi: "Cyber Attacks ke Types",
    description:
      "Common cyber attacks ka overview: malware, phishing, denial of service, man-in-the-middle aur SQL injection.",
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
        type: "keypoints",
        title: { en: "Quick summary", hi: "Ek line mein" },
        items: [
          {
            en: "A cyber attack tries to access or damage a system without permission.",
            hi: "Cyber attack bina permission ke system tak pahunchne ya nuksan karne ki koshish hai.",
          },
        ],
      },
      {
        type: "paragraph",
        text: {
          en: "A cyber attack is an attempt to gain unauthorised access to a computer system to cause damage or steal data. Understanding the common categories is the first step in defending against them.",
          hi: "Cyber attack computer system tak bina permission pahunchne ki koshish hai jisse nuksan ho ya data churaya jaaye. Common categories samajhna hi inse bachne ka pehla kadam hai.",
        },
      },
      {
        type: "list",
        items: [
          {
            en: "Malware: malicious software such as viruses, worms and ransomware.",
            hi: "Malware: harmful software jaise virus, worm aur ransomware.",
          },
          {
            en: "Phishing: fake messages that trick users into revealing credentials.",
            hi: "Phishing: nakli messages jo users ko unke passwords bata dene ke liye fansaate hain.",
          },
          {
            en: "Denial of Service (DoS): overwhelming a system so it becomes unavailable.",
            hi: "Denial of Service (DoS): system par itna load daalna ki wo band ho jaaye.",
          },
          {
            en: "Man-in-the-middle: intercepting communication between two parties.",
            hi: "Man-in-the-middle: do parties ke beech ki communication beech mein pakadna.",
          },
          {
            en: "SQL injection: inserting malicious SQL into an input field.",
            hi: "SQL injection: input field mein harmful SQL daal dena.",
          },
        ],
      },
    ],
  },
  {
    slug: "it-act-2000",
    title: "Information Technology Act, 2000 Overview",
    titleHi: "Information Technology Act, 2000 ka Overview",
    description:
      "Indian IT Act, 2000 ka summary, uske objectives aur cyber law aur electronic records se jude key provisions.",
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
        text: {
          en: "The Information Technology Act, 2000 is the primary law in India dealing with cybercrime and electronic commerce. It provides legal recognition to electronic records and digital signatures.",
          hi: "Information Technology Act, 2000 India ka mukhya kanoon hai jo cybercrime aur electronic commerce se judta hai. Ye electronic records aur digital signatures ko legal maanyata deta hai.",
        },
      },
    ],
  },

  // ------------------------------------------------------- COMPUTER SCIENCE
  {
    slug: "process-scheduling",
    title: "CPU Process Scheduling Algorithms",
    titleHi: "CPU Process Scheduling Algorithms",
    description:
      "CPU scheduling algorithms samjho: FCFS, SJF, Round Robin aur Priority scheduling, examples ke saath.",
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
        text: {
          en: "CPU scheduling decides which process in the ready queue is given the CPU. The choice of algorithm affects throughput, turnaround time and waiting time.",
          hi: "CPU scheduling decide karta hai ki ready queue mein se kaunse process ko CPU milega. Algorithm ka chunav throughput, turnaround time aur waiting time ko affect karta hai.",
        },
      },
    ],
  },

  // --------------------------------------------------------------- SYLLABUS
  {
    slug: "python-syllabus",
    title: "Python Programming Course Syllabus",
    titleHi: "Python Programming Course Syllabus",
    description:
      "Python Programming course ka poora unit-wise syllabus, topics aur recommended references ke saath.",
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
        text: {
          en: "A unit-wise breakdown of the Python Programming course used across the semester.",
          hi: "Semester bhar use hone wale Python Programming course ka unit-wise breakdown.",
        },
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
