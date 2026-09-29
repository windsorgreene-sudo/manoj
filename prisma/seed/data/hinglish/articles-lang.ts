import type { HinglishArticle } from "./types";

export const langHinglish: Record<string, HinglishArticle> = {
  "javascript-variables-and-types": {
    excerpt: "let vs const vs var, primitive vs reference types, aur kyun lagbhag hamesha === use karna chahiye.",
    parts: {
      0: "## Variables declare karna\n",
      2: "\nDefault mein `const` use kijiye, aur `let` sirf tab jab value dobara deni ho.\n\n## Types\n\nJavaScript mein 7 **primitive** types hain, `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`, aur **objects** (arrays aur functions bhi).\n",
      4: "\n## Reference vs value\n",
      6: "\n## == vs ===\n\n`==` type coercion karta hai (`\"5\" == 5` `true` hai, `[] == false` bhi `true` hai!). `===` type **aur** value dono compare karta hai. Hamesha `===` ko tarjeeh dijiye.\n\n<Callout type=\"tip\">Missing data ko safely sambhalne ke liye optional chaining `user?.profile?.name` aur nullish coalescing `value ?? \"default\"` use kijiye.</Callout>",
    },
    quiz: [
      { q: "typeof null kya return karta hai?", options: ["'null'", "'undefined'", "'object'", "'number'"], explanation: "JavaScript ki ek purani ajeeb aadat." },
      { q: "Default mein kya use karna chahiye?", options: ["var", "let", "const", "global"], explanation: "const galti se dobara value dene se bachata hai." },
    ],
  },
  "javascript-functions-and-closures": {
    excerpt: "Arrow functions, lexical scope, closures aur `this` keyword, examples ke saath samjhaye gaye.",
    parts: {
      0: "## Function likhne ke teen tareeke\n",
      2: "\n## Closures\n\nClosure woh function hai jo **us scope ke variables yaad rakhta hai jahan woh bana tha**, chahe woh scope khatam ho chuka ho.\n",
      4: "\nData privacy, memoisation, debouncing aur React hooks sab closures pe chalte hain.\n",
      6: "\n## `this` keyword\n\nNormal functions mein `this` is baat pe nirbhar hai ki **function ko kaise call kiya gaya**. Arrow functions ka apna `this` nahi hota; woh use lexically pakad lete hain, jo methods ke andar callbacks ke liye ekdam sahi hai.\n\n<Callout type=\"warning\">Loop ka mashhoor bug: `var i` ke saath saare callbacks aakhri value dekhte hain. `let i` ke saath har iteration ko nayi binding milti hai.</Callout>",
    },
    quiz: [
      { q: "Closure kya pakadta hai?", options: ["Sirf globals", "Apne banne wale scope ke variables", "Sirf parameters", "Kuch nahi"], explanation: "Yahi lexical scoping hai." },
      { q: "Arrow functions ko `this` kahan se milta hai?", options: ["Call karne wale se", "Bahar wale scope se", "Hamesha window se", "new se"], explanation: "Yeh this ko lexically pakadte hain." },
    ],
  },
  "javascript-promises-async-await": {
    excerpt: "Promises, async/await, error handling aur parallel execution se async code ko saaf-suthra sambhaliye.",
    parts: {
      0: "## Async kyun?\n\nJavaScript **ek hi thread** pe chalti hai. Network calls, timers aur file reads async tareeke se sambhale jaate hain taaki UI kabhi atke nahi.\n\n## Promises\n\nPromise ek aisi value hai jo **baad mein** milegi. Pehle yeh *pending* hota hai, phir ya to *fulfilled* ya *rejected*.\n",
      2: "\n## async / await\n\n`await` ek `async` function ko tab tak rokta hai jab tak promise poora na ho, isse async code upar se neeche padhne mein aasaan ho jaata hai.\n",
      4: "\n## Parallel mein chalana\n",
      6: "\n<Callout type=\"tip\">`Promise.all` pehle rejection pe hi fail ho jaata hai; `Promise.allSettled` sabka intezaar karta hai; `Promise.race` sabse pehle poora hone wala deta hai; `Promise.any` sabse pehle fulfil hone wala.</Callout>",
    },
    quiz: [
      { q: "await kya karta hai?", options: ["Poora thread rok deta hai", "Promise poora hone tak async function ko rokta hai", "Thread banata hai", "Promise cancel karta hai"], explanation: "Tab tak baaki code chalta rehta hai." },
      { q: "Kaun fail hone ke bawajood saare promises ka intezaar karta hai?", options: ["Promise.all", "Promise.race", "Promise.allSettled", "Promise.any"], explanation: "allSettled kabhi reject nahi hota." },
    ],
  },
  "javascript-array-methods": {
    excerpt: "map, filter, reduce, find, some/every, sort aur toSorted jaise naye immutable helpers.",
    parts: {
      0: "## Arrays ko badalna\n",
      2: "\n## Dhoondhna\n",
      4: "\n## Sahi tareeke se sort karna\n\nDefault `sort()` **strings** compare karta hai: `[10, 9, 1].sort()` se `[1, 10, 9]` milta hai. Numbers ke liye hamesha comparator dijiye.\n",
      6: "\n## Immutable helpers (ES2023)\n\n`toSorted`, `toReversed`, `toSpliced` aur `with(index, value)` **naye arrays** dete hain, jo React state update ke liye ekdam sahi hain.\n\n| Badalne wale | Na badalne wale |\n|---|---|\n| `sort` | `toSorted` |\n| `reverse` | `toReversed` |\n| `splice` | `toSpliced` |\n| `a[i] = x` | `a.with(i, x)` |\n\n<Callout type=\"tip\">`Object.groupBy(items, fn)` array ko key ke hisaab se object mein group kar deta hai, grouping ke liye ab haath se reduce likhne ki zarurat nahi.</Callout>",
    },
    quiz: [
      { q: "[10, 9, 1].sort() kya return karta hai?", options: ["[1, 9, 10]", "[1, 10, 9]", "[10, 9, 1]", "Error"], explanation: "Default sort strings compare karta hai." },
      { q: "Kaunsa method ek jodi hui (accumulated) value deta hai?", options: ["map", "filter", "reduce", "find"], explanation: "reduce array ko ek value mein samet deta hai." },
    ],
  },
  "javascript-event-loop": {
    excerpt: "Call stack, Web APIs, task queue aur microtask queue, kisi bhi async code ka output pehle se bataiye.",
    parts: {
      0: "## Chalne wale hisse\n\n1. **Call stack**, jahan synchronous code ek-ek frame karke chalta hai.\n2. **Web APIs / runtime**, timers, network, DOM events stack ke bahar chalte hain.\n3. **Macrotask queue**, `setTimeout`, I/O aur UI events ke callbacks.\n4. **Microtask queue**, promise callbacks (`then`, `await` ke baad wala hissa) aur `queueMicrotask`.\n\n## Niyam\n\nHar macrotask ke baad engine rendering ya agla macrotask lene se pehle **poori microtask queue khaali karta hai**.\n",
      2: "\n0 ms delay ke saath bhi timeout saare microtasks ke **baad** chalta hai.\n\n## async/await microtasks ka aasaan roop hai\n",
      4: "\n## Yeh kyun zaroori hai\n\n- Lamba synchronous loop rendering aur input ko **rok deta hai**; bhaari kaam ko `setTimeout`, `requestIdleCallback` ya Web Worker se todiye.\n- Microtasks ki kabhi na khatam hone wali chain macrotask queue ko bhookha rakh sakti hai aur page atak sakta hai.\n\n<Callout type=\"info\">Node.js mein `process.nextTick` (baaki microtasks se pehle chalta hai) aur `setImmediate` (\"check\" phase ka macrotask) bhi hain.</Callout>",
    },
    quiz: [
      { q: "Synchronous code khatam hone ke baad sabse pehle kya chalta hai?", options: ["setTimeout callbacks", "Microtasks (promises)", "Rendering", "setInterval"], explanation: "Pehle microtask queue khaali hoti hai." },
      { q: "`await` ke baad ka code kis roop mein chalta hai?", options: ["Macrotask", "Microtask", "Web Worker", "Synchronous call"], explanation: "Baad wala hissa microtask ki tarah queue hota hai." },
    ],
  },
  "python-getting-started": {
    excerpt: "Apna pehla Python program likhiye, dynamic typing samjhiye, aur coding problems ke liye tez input padhna seekhiye.",
    parts: {
      0: "## Aapka pehla program\n\nPython mein `main` function ya semicolons ki zarurat nahi. Indentation se blocks bante hain.\n",
      2: "\n## Dynamic typing\n\nVariables **objects se jude naam** hain; type object ke paas hota hai, variable ke paas nahi.\n",
      4: "\nPython ke integers kabhi overflow nahi hote, `2 ** 100` seedha chal jaata hai, jo bahut bade answers wale problems mein kaam aata hai.\n\n## Main built-in types\n\n| Type | Example | Badal sakta hai? |\n|---|---|---|\n| `int`, `float` | `7`, `2.5` | Nahi |\n| `str` | `\"hi\"` | Nahi |\n| `list` | `[1, 2, 3]` | Haan |\n| `tuple` | `(1, 2)` | Nahi |\n| `dict` | `{\"a\": 1}` | Haan |\n| `set` | `{1, 2}` | Haan |\n\n## Coding problems ke liye tez input\n\nBade inputs ke liye `input()` dheema hai. Sab kuch ek saath padhiye:\n",
      6: "\n<Callout type=\"tip\">Integer division ke liye `//` aur modulo ke liye `%` use kijiye. Python mein `-7 // 2` `-4` hai (yeh neeche round karta hai), jabki C++ zero ki taraf kaatta hai.</Callout>",
    },
    quiz: [
      { q: "Python mein -7 // 2 ka result kya hai?", options: ["-3", "-4", "-3.5", "Error"], explanation: "Floor division negative infinity ki taraf round karta hai." },
      { q: "Kaunsa type badla ja sakta hai (mutable)?", options: ["tuple", "str", "list", "int"], explanation: "Lists ko wahin badla ja sakta hai." },
    ],
  },
  "python-lists-and-dictionaries": {
    excerpt: "Slicing, key ke saath sorting, dictionary ke patterns aur aam operations ki complexity.",
    parts: {
      0: "## Lists\n",
      2: "\n**Key ke saath sort karna** Python ki ek superpower hai:\n",
      4: "\n## Dictionaries\n\nDicts hash maps hain jo **daalne ka order yaad rakhte hain** (Python 3.7+).\n",
      6: "\n## Complexity cheat-sheet\n\n| Operation | list | dict / set |\n|---|---|---|\n| index / get | O(1) | O(1) avg |\n| append / add | O(1) | O(1) avg |\n| `x in c` | **O(n)** | **O(1)** avg |\n| aage insert | O(n) |, |\n\n<Callout type=\"warning\">Loop ke andar `x in my_list` ek chhupa hua O(n²) hai. Pehle `set` mein badal lijiye.</Callout>",
    },
    quiz: [
      { q: "Set ke liye membership test `x in s` hai…", options: ["O(1) average", "O(log n)", "O(n)", "O(n²)"], explanation: "Sets hash tables hain." },
      { q: "nums[::-1] kya return karta hai?", options: ["Aakhri element", "Ulti copy", "Error", "Sorted list"], explanation: "Step -1 peeche ki taraf chalta hai." },
    ],
  },
  "python-functions-and-lambdas": {
    excerpt: "Default aur keyword arguments, *args/**kwargs, closures, lambdas aur apne decorators likhna.",
    parts: {
      0: "## Functions banana\n",
      2: "\n`*` ke baad wale parameters **keyword-only** hote hain, isse call karte waqt code khud samajh aata hai.\n\n## *args aur **kwargs\n",
      4: "\n<Callout type=\"warning\">Kabhi `def f(x, acc=[])` jaisa mutable default na rakhein, wahi list har call mein share hoti hai. `acc=None` rakhiye aur andar banaiye.</Callout>\n\n## Lambdas aur higher-order functions\n",
      6: "\n## Closures aur decorators\n\n**Closure** apne bahar wale scope ke variables yaad rakhta hai. **Decorator** ek function hai jo function leta hai aur naya function lautata hai.\n",
      8: "\n`functools.lru_cache` ek built-in decorator hai jo function ko memoise karta hai, turant dynamic programming.",
    },
    quiz: [
      { q: "Akele * ke baad wale parameters hote hain…", options: ["Optional", "Keyword-only", "Positional-only", "Variadic"], explanation: "Inhe naam se hi pass karna padta hai." },
      { q: "Decorator kya return karta hai?", options: ["Ek class", "Naya function", "None", "Ek generator"], explanation: "Yeh ek callable ko lapet ke lautata hai." },
    ],
  },
  "python-oop-classes": {
    excerpt: "Classes, __init__, inheritance, dunder methods aur dataclasses, bank account ke practical example ke saath.",
    parts: {
      0: "## Classes aur objects\n",
      2: "\n## Inheritance aur polymorphism\n",
      4: "\n## Chaar stambh (pillars)\n\n1. **Encapsulation**, andar ki state ko methods ke peeche chhupana (`_balance`).\n2. **Abstraction**, object *kya* karta hai yeh dikhana, *kaise* nahi.\n3. **Inheritance**, parent class ka behaviour dobara use karna.\n4. **Polymorphism**, ek hi method ka naam har class mein alag kaam karta hai.\n\n## Dataclasses\n",
      6: "\n<Callout type=\"tip\">`__len__`, `__eq__` aur `__lt__` jaise dunder methods aapke objects ko `len()`, `==` aur `sorted()` ke saath chalne dete hain.</Callout>",
    },
    quiz: [
      { q: "Kaunsa method naya instance shuru karta hai?", options: ["Sirf __new__", "__init__", "__call__", "__repr__"], explanation: "__init__ instance ke attributes set karta hai." },
      { q: "Andar ki state ko methods ke peeche chhupana kehlata hai…", options: ["Inheritance", "Polymorphism", "Encapsulation", "Recursion"], explanation: "Encapsulation niyamon ko surakshit rakhta hai." },
    ],
  },
  "python-comprehensions-generators": {
    excerpt: "Chhote list/dict/set comprehensions aur yield ke saath memory bachane wale generators likhiye.",
    parts: {
      0: "## Comprehensions\n",
      2: "\n## Generators\n\nGenerator values **lazily** banata hai, ek-ek karke, jab maangi jaayein, isliye length chahe jitni ho, memory O(1) hi lagti hai.\n",
      4: "\n## Iterator protocol\n\nJis object ka `__iter__` aisa object lautaye jiske paas `__next__` ho, woh iterable hai. `for` loops `StopIteration` tak `next()` call karte hain.\n\n## Kaam ke itertools\n\n| Function | Kya karta hai |\n|---|---|\n| `permutations(a, r)` | Saari ordered r-arrangements |\n| `combinations(a, r)` | Saare r-subsets |\n| `product(a, repeat=k)` | Cartesian product |\n| `accumulate(a)` | Chalte totals (prefix sums!) |\n| `groupby(a)` | Lagataar groups |\n\n<Callout type=\"info\">Generator ko sirf **ek baar** use kar sakte hain. Kai baar chalana ho to list mein badal lijiye.</Callout>",
    },
    quiz: [
      { q: "Kaunsa keyword function ko generator bana deta hai?", options: ["return", "yield", "async", "lambda"], explanation: "yield chalna rokta aur phir shuru karta hai." },
      { q: "Generator expression mein kya use hota hai?", options: ["[ ]", "{ }", "( )", "< >"], explanation: "Parentheses se lazy generator banta hai." },
    ],
  },
};
