import type { HinglishArticle } from "./types";

export const dsaHinglish2: Record<string, HinglishArticle> = {
  "linked-list-basics": {
    excerpt: "Shuru se linked list banaiye, use in-place ulta kijiye aur Floyd's algorithm se cycle pakadiye.",
    parts: {
      0: `## Structure

Linked list **nodes** ki ek chain hai; har node ek value aur agle node ka pointer rakhta hai. Arrays ke ulat, nodes memory mein bikhre hote hain, isliye index se access O(n) hai, par kisi jaane-pehchaane node pe insert/delete O(1) hai.

## List ko in-place ulta karna

List pe chaliye aur har \`next\` pointer ko peeche ki taraf mod dijiye.

<CodeTabs>`,
      8: `</CodeTabs>

## Floyd's cycle detection

\`slow\` ko ek step aur \`fast\` ko do step chalaiye. Agar cycle hai to dono zaroor milenge; agar \`fast\` \`null\` tak pahunch gaya, to cycle nahi hai. O(n) time, O(1) space.

## Doubly linked lists

Har node ek \`prev\` pointer bhi rakhta hai, isliye sirf node diya ho to bhi O(1) mein delete ho jaata hai. **LRU cache** bilkul aise hi banta hai: O(1) lookup ke liye hash map, aur O(1) mein aage laane ke liye doubly linked list.`,
    },
    quiz: [
      { q: "Linked list ka k-va node access karne mein lagta hai…", options: ["O(1)", "O(log n)", "O(k)", "O(k²)"], explanation: "Aapko k pointers chalne padte hain." },
      { q: "Floyd's algorithm use karta hai…", options: ["Hash set", "Slow aur fast pointers", "Recursion", "Sorting"], explanation: "Kachhua aur khargosh." },
    ],
  },
  "stacks-and-queues": {
    excerpt: "LIFO vs FIFO, dono ko arrays aur linked lists se banana, aur bracket matching aur BFS jaise classic istemaal.",
    parts: {
      0: `## Stack: Last In, First Out

Plates ka dher sochiye: aap upar \`push\` karte hain aur upar se hi \`pop\`. Dono O(1) hain. Function calls, undo, expression evaluation aur bracket matching sab stack pe chalte hain.

## Queue: First In, First Out

Ticket counter ki line: peeche \`enqueue\`, aage se \`dequeue\`, dono O(1). BFS, task scheduling aur buffering queue pe chalte hain.

## Stack se bracket matching

<CodeTabs>`,
      8: `</CodeTabs>

## Deque aur monotonic structures

**Deque** dono siron pe O(1) push/pop deta hai. Ise *monotonic* (hamesha badhta ya ghatta) rakhne se "next greater element" aur "sliding window maximum" O(n) mein solve ho jaate hain.

<Callout type="warning">Python mein \`list.pop(0)\` ko kabhi queue ki tarah use na karein, yeh O(n) hai. \`collections.deque\` use kijiye.</Callout>`,
    },
    quiz: [
      { q: "BFS kaunsa structure use karta hai?", options: ["Stack", "Queue", "Heap", "Tree"], explanation: "FIFO order level by level explore karta hai." },
      { q: "Undo feature ko sabse natural tareeke se kaun dikhata hai?", options: ["Queue", "Stack", "Graph", "Hash map"], explanation: "Sabse haal ka kaam sabse pehle undo hota hai: LIFO." },
    ],
  },
  "hashing-and-hash-maps": {
    excerpt: "Hash tables O(1) lookup kaise dete hain, collisions, load factor, aur frequency-count pattern.",
    parts: {
      0: `## Hash table kaise kaam karti hai

**Hash function** key ko ek integer mein badalta hai; table size se modulo lene pe bucket ka index milta hai. Lookup, insert aur delete **average mein O(1)** hain.

Jab do keys ek hi bucket mein aa jaayein to use **collision** kehte hain. Ise *chaining* (har bucket ek chhoti list) ya *open addressing* (agli khaali jagah dhoondhna) se sulajhaya jaata hai. Jab **load factor** (items ÷ buckets) 0.75 jaisi had paar karta hai, table bada kar di jaati hai.

## Frequency-count pattern

<CodeTabs>`,
      8: `</CodeTabs>

## Classic istemaal

- **Two Sum** O(n) mein: \`value → index\` rakhiye aur \`target - x\` dhoondhiye.
- **Anagram grouping**: key = sorted word.
- **Subarray sum equals K**: prefix sums ki ginti rakhiye.

<Callout type="info">Agar har key collide kare to worst case mein har operation O(n) hai. Competitive programmers kabhi-kabhi hash mein random salt jodte hain taaki jaan-boojh ke banaye gaye inputs se bacha ja sake.</Callout>`,
    },
    quiz: [
      { q: "Hash map mein average lookup time hai…", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], explanation: "Achhe hash function aur resizing ke saath." },
      { q: "Load factor kya hai?", options: ["Buckets / items", "Items / buckets", "Collisions / items", "Hash / size"], explanation: "Yeh batata hai table kitni bhari hai." },
    ],
  },
  "binary-search-trees": {
    excerpt: "Tree ke terms, chaar traversals, aur kaise BST property balanced tree mein O(log n) search deti hai.",
    parts: {
      0: `## Terms

**Binary tree** ek hierarchy hai jahan har node ke zyada se zyada do children hote hain. Sabse upar wala node *root* hai, bina children wale nodes *leaves* hain, aur **height** root se leaf tak ka sabse lamba raasta hai.

## Traversals

- **Preorder** (root, left, right), tree ki copy banane ke liye.
- **Inorder** (left, root, right), BST ko sorted order mein deta hai.
- **Postorder** (left, right, root), tree delete karne / expressions nikalne ke liye.
- **Level order** (BFS), queue se level by level.

## BST property

Har node ke liye, left subtree ki saari keys **chhoti** aur right subtree ki saari keys **badi** hoti hain. Search, insert aur delete ek hi raasta chalte hain: **O(h)**. Balanced tree ke liye O(log n), aur "linked list" jaise bigde tree ke liye O(n).

<CodeTabs>`,
      8: `</CodeTabs>

<Callout type="tip">Self-balancing BSTs (AVL, Red-Black) height ko O(log n) rakhte hain. C++ ka \`std::map\` aur Java ka \`TreeMap\` Red-Black trees hain.</Callout>`,
    },
    quiz: [
      { q: "BST ka inorder traversal deta hai…", options: ["Random order", "Sorted order", "Ulta insertion order", "Level order"], explanation: "Har node pe left < root < right." },
      { q: "Unbalanced BST mein search bigad ke ho sakta hai…", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], explanation: "Sorted keys daalne se ek chain ban jaati hai." },
    ],
  },
  "graph-traversal-bfs-dfs": {
    excerpt: "Graphs ko adjacency lists se dikhaiye aur breadth-first aur depth-first search se explore kijiye.",
    parts: {
      0: `## Graph ko dikhana

Graph mein **vertices** aur **edges** hote hain. Adjacency **list** (\`adj[u]\` = \`u\` ke padosi) O(V + E) memory leti hai aur yahi default choice hai. Adjacency **matrix** O(V²) leti hai, par "kya u-v ke beech edge hai?" ka jawab O(1) mein deti hai.

## Breadth-first search

BFS queue ki madad se **badhti doori ke gholon (rings)** mein explore karta hai. Unweighted graph mein yeh shortest path dhoondh leta hai.

<CodeTabs>`,
      8: `</CodeTabs>

## Depth-first search

DFS peeche lautne se pehle **jitna ho sake utna gehra** jaata hai (recursion ya apne stack se). Connected components, cycle detection, topological sort aur bridges dhoondhne ke liye yahi tool hai.

BFS aur DFS dono **O(V + E)** mein chalte hain.

<Callout type="tip">Grid problems chhupe hue graphs hain: har cell ek vertex hai jo apne 4 padosiyon se juda hai. **Number of Islands** bas connected components ginna hai.</Callout>`,
    },
    quiz: [
      { q: "BFS shortest path dhoondhta hai…", options: ["Weighted graphs mein", "Unweighted graphs mein", "Sirf trees mein", "Negative-weight graphs mein"], explanation: "Har edge 1 step gina jaata hai." },
      { q: "Adjacency lists ke saath BFS/DFS ki time complexity?", options: ["O(V)", "O(E)", "O(V + E)", "O(V²)"], explanation: "Har vertex aur edge ek baar process hota hai." },
    ],
  },
  "dynamic-programming-introduction": {
    excerpt: "Overlapping subproblems aur optimal substructure pehchaaniye, phir memoisation ya tabulation se solve kijiye.",
    parts: {
      0: `## DP kab lagta hai?

1. **Optimal substructure**, sabse achha answer subproblems ke sabse achhe answers se banta hai.
2. **Overlapping subproblems**, wahi subproblems baar-baar solve hote hain.

Seedha-saada Fibonacci \`fib(n-2)\` ko exponential baar dobara nikalta hai. Results ko store karne se O(2ⁿ) O(n) ban jaata hai.

## Top-down vs bottom-up

<CodeTabs>`,
      8: `</CodeTabs>

## DP problems ka tareeka

1. **State define kijiye**, \`dp[i]\` (ya \`dp[i][j]\`) ka shabdon mein kya matlab hai?
2. **Transition likhiye**, ek state chhote states pe kaise nirbhar hai?
3. **Base cases tay kijiye.**
4. **Order chuniye** ki pehle kya nikalna hai, taaki zaroori values taiyaar hon.
5. **Answer nikaliye**, aur agar sirf aakhri row chahiye to space bachaiye.

## Solved example: Coin Change

State: \`dp[x]\` = amount \`x\` banane ke liye sabse kam coins. Transition: \`dp[x] = 1 + min(dp[x - c])\`, saare coins \`c ≤ x\` pe. Base: \`dp[0] = 0\`. Complexity O(amount × coins).

<Callout type="tip">DP ke classic parivaar: knapsack, LIS, LCS/edit distance, interval DP, trees pe DP, bitmask DP.</Callout>`,
    },
    quiz: [
      { q: "Memoisation kya hai?", options: ["Bottom-up DP", "Caching ke saath top-down DP", "Greedy", "Bina overlap ka divide and conquer"], explanation: "Recursion + cache." },
      { q: "Kaunsi property ka matlab hai ki wahi subproblem baar-baar aata hai?", options: ["Optimal substructure", "Overlapping subproblems", "Greedy choice", "Monotonicity"], explanation: "Isi liye caching se madad milti hai." },
    ],
  },
  "dijkstra-shortest-path": {
    excerpt: "Priority queue ki madad se non-negative weights wale graphs mein single-source shortest paths dhoondhiye.",
    parts: {
      0: `## Problem

**Non-negative** edge weights wala ek weighted graph aur source \`s\` diya hai; \`s\` se har vertex ki shortest distance nikaliye. Jab edges ke weights alag-alag hon, to BFS kaafi nahi hai.

## Greedy wali samajh

Hamesha woh bina visit hua vertex kholiye jiski **tentative distance sabse kam** ho. Weights non-negative hain, isliye baad ka koi raasta us vertex ko aur paas nahi la sakta; uski distance final hai.

<CodeTabs>`,
      8: `</CodeTabs>

## Complexity

Binary heap ke saath: **O((V + E) log V)**. Array wala version O(V²) hai, jo bahut dense graphs ke liye asal mein behtar hai.

<Callout type="warning">Dijkstra **negative** edges ke saath fail hota hai. Uski jagah Bellman-Ford (O(VE)) use kijiye, jo negative cycles bhi pakad leta hai.</Callout>`,
    },
    quiz: [
      { q: "Dijkstra ke liye edge weights hone chahiye…", options: ["Integers", "Non-negative", "Alag-alag", "V se kam"], explanation: "Negative edges greedy tark ko tod dete hain." },
      { q: "Heap wala Dijkstra chalta hai…", options: ["O(V + E)", "O((V + E) log V)", "O(VE)", "O(V³)"], explanation: "Har relaxation heap mein push kar sakta hai." },
    ],
  },
};

/** Quiz translations for the first DSA batch (kept separate so batch 1 stays prose-only). */
export const dsaQuizHinglish1: Record<string, NonNullable<HinglishArticle["quiz"]>> = {
  "time-and-space-complexity": [
    { q: "5n² + 3n + 100 ki time complexity kya hai?", options: ["O(n)", "O(n²)", "O(5n²)", "O(n³)"], explanation: "Constants aur chhote terms hata dijiye: O(n²)." },
    { q: "Jo loop har baar n ko aadha karta hai, woh chalta hai…", options: ["O(n)", "O(√n)", "O(log n)", "O(1)"], explanation: "n → n/2 → n/4 … log₂ n steps ke baad 1 tak pahunchta hai." },
    { q: "Ek second mein lagbhag kitne simple operations chalte hain?", options: ["10⁴", "10⁶", "10⁸", "10¹²"], explanation: "Competitive programming mein lagbhag 10⁸ ka andaaza chalta hai." },
  ],
  "arrays-introduction": [
    { q: "Array access O(1) kyun hai?", options: ["Arrays sorted hote hain", "Address = base + i × size", "Arrays cache mein hote hain", "Hashing"], explanation: "Lagataar storage se address seedha nikal jaata hai." },
    { q: "Prefix array pre ke saath a[l..r] ka sum hai…", options: ["pre[r] - pre[l]", "pre[r+1] - pre[l]", "pre[r] - pre[l-1]", "pre[r+1] + pre[l]"], explanation: "pre[i] mein pehle i elements ka sum hota hai." },
  ],
  "two-pointers-technique": [
    { q: "Dono siron se two pointers ke liye aam taur pe array hona chahiye…", options: ["Sorted", "Distinct", "Positive", "Even length ka"], explanation: "Monotonic order hi ek sire ko chhodne ki wajah deta hai." },
    { q: "Linked list pe fast/slow pointers kya kar sakte hain?", options: ["Sort", "Middle node dhoondhna", "O(1) mein ulta karna", "Hash karna"], explanation: "Jab fast aakhir tak pahunchta hai, slow beech mein hota hai." },
  ],
  "sliding-window-technique": [
    { q: "Sliding window kahan lagta hai?", options: ["Kisi bhi subsequence pe", "Lagataar subarrays pe", "Sirf sorted arrays pe", "Trees pe"], explanation: "Window ki paribhasha hi lagataar hai." },
    { q: "Nested loop hone ke bawajood variable window O(n) kyun hai?", options: ["Nahi hai", "Har index ek baar aata aur ek baar jaata hai", "Hashing", "Pehle sort karna"], explanation: "Dono pointers sirf aage badhte hain: zyada se zyada 2n moves." },
  ],
  "binary-search-guide": [
    { q: "lower_bound(x) pehla index deta hai jahan…", options: ["a[i] > x", "a[i] ≥ x", "a[i] == x", "a[i] < x"], explanation: "upper_bound strict > use karta hai." },
    { q: "'Binary search on the answer' ke liye condition honi chahiye…", options: ["Linear", "Monotonic", "Convex", "Constant"], explanation: "false…false true…true se search space aadha hota rehta hai." },
  ],
  "recursion-and-backtracking": [
    { q: "Har recursive function mein kya hona zaroori hai?", options: ["Ek loop", "Ek base case", "Ek global variable", "Memoisation"], explanation: "Base case ke bina recursion kabhi nahi rukti." },
    { q: "n elements ke set ke kitne subsets hote hain?", options: ["n", "n²", "2ⁿ", "n!"], explanation: "Har element ya andar hai ya bahar." },
  ],
  "sorting-algorithms": [
    { q: "Kaunsa sort hamesha O(n log n) aur stable hai?", options: ["Quick sort", "Heap sort", "Merge sort", "Selection sort"], explanation: "Merge sort hamesha O(n log n) aur stable hai." },
    { q: "Quick sort ka worst case hai…", options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"], explanation: "Kharab pivot se partition ek taraf jhuk jaate hain." },
  ],
};
