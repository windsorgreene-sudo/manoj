import type { SeedArticle } from "./types";

const fence = "```";

export const pythonArticles: SeedArticle[] = [
  {
    slug: "python-getting-started",
    title: "Python Basics: Variables, Types and I/O",
    category: "python",
    difficulty: "EASY",
    excerpt: "Write your first Python program, understand dynamic typing, and read input the fast way for coding problems.",
    tags: ["python", "basics"],
    content: `## Your first program

Python needs no \`main\` function or semicolons. Indentation defines blocks.

${fence}python
name = input("What's your name? ")
print(f"Hello, {name}! Welcome to Kodshala.")
${fence}

## Dynamic typing

Variables are **names bound to objects**; the object carries the type, not the variable.

${fence}python
x = 42          # int (arbitrary precision!)
pi = 3.14159    # float
ok = True       # bool
s = "code"      # str (immutable)
print(type(x), 2 ** 100)
${fence}

Python integers never overflow, \`2 ** 100\` just works, which is handy for problems with huge answers.

## Core built-in types

| Type | Example | Mutable? |
|---|---|---|
| \`int\`, \`float\` | \`7\`, \`2.5\` | No |
| \`str\` | \`"hi"\` | No |
| \`list\` | \`[1, 2, 3]\` | Yes |
| \`tuple\` | \`(1, 2)\` | No |
| \`dict\` | \`{"a": 1}\` | Yes |
| \`set\` | \`{1, 2}\` | Yes |

## Fast input for coding problems

\`input()\` is slow for large inputs. Read everything at once:

${fence}python
import sys
data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))
print(sum(nums))
${fence}

<Callout type="tip">Use \`//\` for integer division and \`%\` for modulo. \`-7 // 2\` is \`-4\` in Python (it floors), unlike C++ which truncates toward zero.</Callout>`,
    quiz: [
      { q: "What does -7 // 2 evaluate to in Python?", options: ["-3", "-4", "-3.5", "Error"], answer: 1, explanation: "Floor division rounds toward negative infinity." },
      { q: "Which type is mutable?", options: ["tuple", "str", "list", "int"], answer: 2, explanation: "Lists can be modified in place." },
    ],
  },
  {
    slug: "python-lists-and-dictionaries",
    title: "Python Lists, Tuples and Dictionaries",
    category: "python",
    difficulty: "EASY",
    excerpt: "Slicing, sorting with keys, dictionary patterns and the complexity of common operations.",
    tags: ["python", "lists", "dict"],
    content: `## Lists

${fence}python
nums = [5, 2, 9, 1]
nums.append(7)          # O(1) amortised
nums.sort()             # in place, Timsort, O(n log n)
print(nums[1:3])        # slicing → [2, 5]
print(nums[::-1])       # reversed copy
${fence}

**Sorting with a key** is one of Python's superpowers:

${fence}python
students = [("Aarav", 88), ("Diya", 95), ("Kabir", 88)]
students.sort(key=lambda s: (-s[1], s[0]))
print(students)  # Diya first, then Aarav and Kabir alphabetically
${fence}

## Dictionaries

Dicts are hash maps that **preserve insertion order** (Python 3.7+).

${fence}python
from collections import defaultdict

marks = {"math": 90, "physics": 82}
marks["chemistry"] = 77
for subject, score in marks.items():
    print(subject, score)

groups = defaultdict(list)
for word in ["eat", "tea", "tan", "ate", "nat"]:
    groups["".join(sorted(word))].append(word)
print(list(groups.values()))  # anagram groups
${fence}

## Complexity cheat-sheet

| Operation | list | dict / set |
|---|---|---|
| index / get | O(1) | O(1) avg |
| append / add | O(1) | O(1) avg |
| \`x in c\` | **O(n)** | **O(1)** avg |
| insert at front | O(n) |, |

<Callout type="warning">\`x in my_list\` inside a loop is a hidden O(n²). Convert to a \`set\` first.</Callout>`,
    quiz: [
      { q: "Membership test `x in s` for a set is…", options: ["O(1) average", "O(log n)", "O(n)", "O(n²)"], answer: 0, explanation: "Sets are hash tables." },
      { q: "nums[::-1] returns…", options: ["The last element", "A reversed copy", "An error", "The list sorted"], answer: 1, explanation: "Step -1 walks backward." },
    ],
  },
  {
    slug: "python-functions-and-lambdas",
    title: "Functions, Lambdas and Decorators in Python",
    category: "python",
    difficulty: "MEDIUM",
    excerpt: "Default and keyword arguments, *args/**kwargs, closures, lambdas and writing your own decorators.",
    tags: ["python", "functions", "decorators"],
    content: `## Defining functions

${fence}python
def greet(name, greeting="Hello", *, punctuation="!"):
    return f"{greeting}, {name}{punctuation}"

print(greet("Riya"))
print(greet("Riya", "Namaste", punctuation="🙏"))
${fence}

Parameters after \`*\` are **keyword-only**, which makes call sites self-documenting.

## *args and **kwargs

${fence}python
def total(*args, **kwargs):
    print("positional:", args, "keyword:", kwargs)
    return sum(args)

total(1, 2, 3, unit="ms")
${fence}

<Callout type="warning">Never use a mutable default like \`def f(x, acc=[])\`, the same list is shared across calls. Use \`acc=None\` and create it inside.</Callout>

## Lambdas and higher-order functions

${fence}python
nums = [3, 1, 4, 1, 5, 9]
squares = list(map(lambda x: x * x, nums))
evens = list(filter(lambda x: x % 2 == 0, nums))
print(squares, evens, sorted(nums, key=lambda x: -x))
${fence}

## Closures and decorators

A **closure** remembers variables from its enclosing scope. A **decorator** is a function that takes a function and returns a new one.

${fence}python
import time
from functools import wraps

def timed(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        print(f"{fn.__name__} took {(time.perf_counter() - start) * 1000:.2f} ms")
        return result
    return wrapper

@timed
def slow_sum(n):
    return sum(range(n))

slow_sum(1_000_000)
${fence}

\`functools.lru_cache\` is a built-in decorator that memoises a function, instant dynamic programming.`,
    quiz: [
      { q: "Parameters after a bare * are…", options: ["Optional", "Keyword-only", "Positional-only", "Variadic"], answer: 1, explanation: "They must be passed by name." },
      { q: "What does a decorator return?", options: ["A class", "A new function", "None", "A generator"], answer: 1, explanation: "It wraps and returns a callable." },
    ],
  },
  {
    slug: "python-oop-classes",
    title: "Object-Oriented Programming in Python",
    category: "python",
    difficulty: "MEDIUM",
    excerpt: "Classes, __init__, inheritance, dunder methods and dataclasses, with a practical bank-account example.",
    tags: ["python", "oop", "classes"],
    content: `## Classes and objects

${fence}python
class BankAccount:
    interest_rate = 0.035           # class attribute (shared)

    def __init__(self, owner, balance=0):
        self.owner = owner          # instance attributes
        self._balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    @property
    def balance(self):
        return self._balance

    def __repr__(self):
        return f"BankAccount({self.owner!r}, ₹{self._balance})"

acc = BankAccount("Meera", 1000)
acc.deposit(500)
print(acc, acc.balance)
${fence}

## Inheritance and polymorphism

${fence}python
class SavingsAccount(BankAccount):
    def add_interest(self):
        self.deposit(self.balance * self.interest_rate)

s = SavingsAccount("Arjun", 10_000)
s.add_interest()
print(s.balance)  # 10350.0
${fence}

## The four pillars

1. **Encapsulation**, hide internal state behind methods (\`_balance\`).
2. **Abstraction**, expose *what* an object does, not *how*.
3. **Inheritance**, reuse behaviour from a parent class.
4. **Polymorphism**, the same method name behaves differently per class.

## Dataclasses

${fence}python
from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Point:
    x: int
    y: int

print(sorted([Point(2, 1), Point(1, 5)]))
${fence}

<Callout type="tip">Dunder methods like \`__len__\`, \`__eq__\` and \`__lt__\` let your objects work with \`len()\`, \`==\` and \`sorted()\`.</Callout>`,
    quiz: [
      { q: "Which method initialises a new instance?", options: ["__new__ only", "__init__", "__call__", "__repr__"], answer: 1, explanation: "__init__ sets up instance attributes." },
      { q: "Hiding internal state behind methods is…", options: ["Inheritance", "Polymorphism", "Encapsulation", "Recursion"], answer: 2, explanation: "Encapsulation protects invariants." },
    ],
  },
  {
    slug: "python-comprehensions-generators",
    title: "Comprehensions, Iterators and Generators",
    category: "python",
    difficulty: "MEDIUM",
    excerpt: "Write concise list/dict/set comprehensions and memory-efficient generators with yield.",
    tags: ["python", "generators", "comprehensions"],
    content: `## Comprehensions

${fence}python
squares = [x * x for x in range(10)]
even_sq = [x * x for x in range(10) if x % 2 == 0]
lengths = {w: len(w) for w in ["dsa", "python", "graphs"]}
unique_mod = {x % 3 for x in range(10)}
matrix_t = [[row[i] for row in [[1, 2], [3, 4]]] for i in range(2)]
print(even_sq, lengths, unique_mod, matrix_t)
${fence}

## Generators

A generator produces values **lazily**, one at a time, on demand, so it uses O(1) memory regardless of length.

${fence}python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 10)))

total = sum(x * x for x in range(10_000_000))  # generator expression: no giant list
print(total)
${fence}

## Iterator protocol

Any object with \`__iter__\` returning an object with \`__next__\` is iterable. \`for\` loops call \`next()\` until \`StopIteration\`.

## Handy itertools

| Function | What it does |
|---|---|
| \`permutations(a, r)\` | All ordered r-arrangements |
| \`combinations(a, r)\` | All r-subsets |
| \`product(a, repeat=k)\` | Cartesian product |
| \`accumulate(a)\` | Running totals (prefix sums!) |
| \`groupby(a)\` | Consecutive groups |

<Callout type="info">Generators can only be consumed **once**. Convert to a list if you need to iterate multiple times.</Callout>`,
    quiz: [
      { q: "Which keyword turns a function into a generator?", options: ["return", "yield", "async", "lambda"], answer: 1, explanation: "yield suspends and resumes execution." },
      { q: "A generator expression uses…", options: ["[ ]", "{ }", "( )", "< >"], answer: 2, explanation: "Parentheses create a lazy generator." },
    ],
  },
];

export const jsArticles: SeedArticle[] = [
  {
    slug: "javascript-variables-and-types",
    title: "JavaScript Variables, Types and Equality",
    category: "javascript",
    difficulty: "EASY",
    excerpt: "let vs const vs var, primitive vs reference types, and why you should almost always use ===.",
    tags: ["javascript", "basics"],
    content: `## Declaring variables

${fence}javascript
const PI = 3.14159;   // cannot be reassigned
let count = 0;        // block-scoped, reassignable
count += 1;
// var is function-scoped and hoisted, avoid it in modern code
console.log(PI, count);
${fence}

Use \`const\` by default and \`let\` only when you need to reassign.

## Types

JavaScript has 7 **primitive** types, \`string\`, \`number\`, \`bigint\`, \`boolean\`, \`undefined\`, \`null\`, \`symbol\`, and **objects** (including arrays and functions).

${fence}javascript
console.log(typeof 42, typeof "hi", typeof null, typeof [], typeof (() => {}));
// number string object object function
console.log(0.1 + 0.2);                 // 0.30000000000000004
console.log(Number.MAX_SAFE_INTEGER);   // 9007199254740991
console.log(2n ** 64n);                 // BigInt for huge integers
${fence}

## Reference vs value

${fence}javascript
const a = { score: 10 };
const b = a;          // same object
b.score = 99;
console.log(a.score); // 99

const c = { ...a };   // shallow copy
c.score = 1;
console.log(a.score); // still 99
${fence}

## == vs ===

\`==\` performs type coercion (\`"5" == 5\` is \`true\`, \`[] == false\` is \`true\`!). \`===\` compares type **and** value. Always prefer \`===\`.

<Callout type="tip">Use optional chaining \`user?.profile?.name\` and nullish coalescing \`value ?? "default"\` to handle missing data safely.</Callout>`,
    quiz: [
      { q: "typeof null returns…", options: ["'null'", "'undefined'", "'object'", "'number'"], answer: 2, explanation: "A historical quirk of JavaScript." },
      { q: "Which should you use by default?", options: ["var", "let", "const", "global"], answer: 2, explanation: "const prevents accidental reassignment." },
    ],
  },
  {
    slug: "javascript-functions-and-closures",
    title: "Functions, Scope and Closures in JavaScript",
    category: "javascript",
    difficulty: "MEDIUM",
    excerpt: "Arrow functions, lexical scope, closures and the `this` keyword explained with examples.",
    tags: ["javascript", "closures", "functions"],
    content: `## Three ways to write a function

${fence}javascript
function add(a, b) { return a + b; }          // declaration (hoisted)
const mul = function (a, b) { return a * b; }; // expression
const sub = (a, b) => a - b;                   // arrow function
console.log(add(2, 3), mul(2, 3), sub(2, 3));
${fence}

## Closures

A closure is a function that **remembers the variables of the scope where it was created**, even after that scope has finished executing.

${fence}javascript
function makeCounter() {
  let count = 0;                 // private state
  return {
    increment: () => ++count,
    reset: () => (count = 0),
  };
}
const counter = makeCounter();
counter.increment();
console.log(counter.increment()); // 2
${fence}

Closures power data privacy, memoisation, debouncing and React hooks.

${fence}javascript
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
const search = debounce((q) => console.log("searching", q), 300);
search("gr"); search("gra"); search("graph"); // only "graph" runs
${fence}

## The \`this\` keyword

For regular functions, \`this\` depends on **how the function is called**. Arrow functions don't have their own \`this\`; they capture it lexically, perfect for callbacks inside methods.

<Callout type="warning">The classic loop bug: with \`var i\` all callbacks see the final value. With \`let i\` each iteration gets a fresh binding.</Callout>`,
    quiz: [
      { q: "A closure captures…", options: ["Only globals", "Variables of its creation scope", "Only parameters", "Nothing"], answer: 1, explanation: "That's lexical scoping." },
      { q: "Arrow functions get `this` from…", options: ["The caller", "The enclosing scope", "window always", "new"], answer: 1, explanation: "They capture this lexically." },
    ],
  },
  {
    slug: "javascript-promises-async-await",
    title: "Promises and Async/Await",
    category: "javascript",
    difficulty: "MEDIUM",
    excerpt: "Handle asynchronous code cleanly with Promises, async/await, error handling and parallel execution.",
    tags: ["javascript", "async", "promises"],
    content: `## Why async?

JavaScript runs on a **single thread**. Network calls, timers and file reads are handled asynchronously so the UI never freezes.

## Promises

A Promise represents a value that will be available **later**. It is *pending*, then either *fulfilled* or *rejected*.

${fence}javascript
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(500)
  .then(() => "done waiting")
  .then((msg) => console.log(msg))
  .catch((err) => console.error(err));
${fence}

## async / await

\`await\` pauses an \`async\` function until the promise settles, asynchronous code that reads top-to-bottom.

${fence}javascript
async function loadProfile(username) {
  try {
    const res = await fetch(\`https://api.github.com/users/\${username}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const user = await res.json();
    return user.public_repos;
  } catch (err) {
    console.error("Failed:", err.message);
    return 0;
  }
}
loadProfile("torvalds").then(console.log);
${fence}

## Running in parallel

${fence}javascript
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

async function main() {
  console.time("parallel");
  const [a, b, c] = await Promise.all([wait(300, "a"), wait(300, "b"), wait(300, "c")]);
  console.timeEnd("parallel"); // ~300ms, not 900ms
  console.log(a, b, c);

  const results = await Promise.allSettled([Promise.reject(new Error("x")), wait(10, "ok")]);
  console.log(results.map((r) => r.status)); // ['rejected', 'fulfilled']
}
main();
${fence}

<Callout type="tip">\`Promise.all\` fails fast on the first rejection; \`Promise.allSettled\` waits for all; \`Promise.race\` returns the first to settle; \`Promise.any\` the first to fulfil.</Callout>`,
    quiz: [
      { q: "What does await do?", options: ["Blocks the whole thread", "Pauses the async function until the promise settles", "Creates a thread", "Cancels the promise"], answer: 1, explanation: "Other code keeps running meanwhile." },
      { q: "Which waits for all promises regardless of failure?", options: ["Promise.all", "Promise.race", "Promise.allSettled", "Promise.any"], answer: 2, explanation: "allSettled never rejects." },
    ],
  },
  {
    slug: "javascript-array-methods",
    title: "Mastering JavaScript Array Methods",
    category: "javascript",
    difficulty: "EASY",
    excerpt: "map, filter, reduce, find, some/every, sort and the new immutable helpers like toSorted.",
    tags: ["javascript", "arrays", "functional"],
    content: `## Transforming arrays

${fence}javascript
const products = [
  { name: "Keyboard", price: 2499, inStock: true },
  { name: "Mouse", price: 799, inStock: false },
  { name: "Monitor", price: 12999, inStock: true },
];

const names = products.map((p) => p.name);
const available = products.filter((p) => p.inStock);
const total = available.reduce((sum, p) => sum + p.price, 0);
console.log(names, available.length, total); // [...] 2 15498
${fence}

## Searching

${fence}javascript
const nums = [4, 8, 15, 16, 23, 42];
console.log(nums.find((n) => n > 10));      // 15
console.log(nums.findIndex((n) => n > 10)); // 2
console.log(nums.some((n) => n % 2));       // true
console.log(nums.every((n) => n > 0));      // true
console.log(nums.includes(23));             // true
${fence}

## Sorting correctly

The default \`sort()\` compares **strings**: \`[10, 9, 1].sort()\` gives \`[1, 10, 9]\`. Always pass a comparator for numbers.

${fence}javascript
const scores = [10, 9, 1, 100];
console.log(scores.toSorted((a, b) => a - b)); // [1, 9, 10, 100], original untouched
console.log(scores);                           // [10, 9, 1, 100]
${fence}

## Immutable helpers (ES2023)

\`toSorted\`, \`toReversed\`, \`toSpliced\` and \`with(index, value)\` return **new arrays**, ideal for React state updates.

| Mutating | Non-mutating |
|---|---|
| \`sort\` | \`toSorted\` |
| \`reverse\` | \`toReversed\` |
| \`splice\` | \`toSpliced\` |
| \`a[i] = x\` | \`a.with(i, x)\` |

<Callout type="tip">\`Object.groupBy(items, fn)\` groups an array into an object by key, no more hand-written reduce for grouping.</Callout>`,
    quiz: [
      { q: "[10, 9, 1].sort() returns…", options: ["[1, 9, 10]", "[1, 10, 9]", "[10, 9, 1]", "Error"], answer: 1, explanation: "Default sort compares strings." },
      { q: "Which method returns a single accumulated value?", options: ["map", "filter", "reduce", "find"], answer: 2, explanation: "reduce folds the array." },
    ],
  },
  {
    slug: "javascript-event-loop",
    title: "The JavaScript Event Loop Explained",
    category: "javascript",
    difficulty: "HARD",
    excerpt: "Call stack, Web APIs, the task queue and the microtask queue, predict the output of any async snippet.",
    tags: ["javascript", "event-loop", "async"],
    content: `## The moving parts

1. **Call stack**, where synchronous code runs, one frame at a time.
2. **Web APIs / runtime**, timers, network, DOM events run outside the stack.
3. **Macrotask queue**, callbacks from \`setTimeout\`, I/O, UI events.
4. **Microtask queue**, promise callbacks (\`then\`, \`await\` continuations) and \`queueMicrotask\`.

## The rule

After each macrotask, the engine **drains the entire microtask queue** before rendering or taking the next macrotask.

${fence}javascript
console.log("1: script start");

setTimeout(() => console.log("5: timeout"), 0);

Promise.resolve()
  .then(() => console.log("3: microtask 1"))
  .then(() => console.log("4: microtask 2"));

console.log("2: script end");
// Output order: 1, 2, 3, 4, 5
${fence}

Even with a 0 ms delay, the timeout runs **after** all microtasks.

## async/await is sugar for microtasks

${fence}javascript
async function run() {
  console.log("A");
  await null;               // everything below becomes a microtask
  console.log("C");
}
run();
console.log("B");
// A, B, C
${fence}

## Why it matters

- A long synchronous loop **blocks** rendering and input, split heavy work with \`setTimeout\`, \`requestIdleCallback\` or a Web Worker.
- An infinite chain of microtasks can starve the macrotask queue and freeze the page.

<Callout type="info">Node.js adds \`process.nextTick\` (runs before other microtasks) and \`setImmediate\` (a macrotask in the "check" phase).</Callout>`,
    quiz: [
      { q: "Which runs first after synchronous code finishes?", options: ["setTimeout callbacks", "Microtasks (promises)", "Rendering", "setInterval"], answer: 1, explanation: "The microtask queue is drained first." },
      { q: "Code after `await` runs as a…", options: ["Macrotask", "Microtask", "Web Worker", "Synchronous call"], answer: 1, explanation: "The continuation is queued as a microtask." },
    ],
  },
];
