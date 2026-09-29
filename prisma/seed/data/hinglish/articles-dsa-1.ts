import type { HinglishArticle } from "./types";

/** Hinglish versions of DSA tutorials (prose only; code blocks are reused from the English article). */
export const dsaHinglish1: Record<string, HinglishArticle> = {
  "time-and-space-complexity": {
    excerpt: "Big-O notation se samjhiye ki algorithm input badhne pe kaise scale karta hai, loops, nested loops aur recursion ke examples ke saath.",
    parts: {
      0: `## Complexity kyun zaroori hai

Do programs ek hi answer de sakte hain, par ek millisecond mein khatam ho aur dusra ek ghanta le. **Asymptotic analysis** se hum algorithms ko bina chalaye compare kar sakte hain: bas ginte hain ki input size \`n\` badhne pe basic operations kitne badhte hain.

## Big-O notation

\`O(f(n))\` growth ki **upper bound** batata hai, constants aur chhote terms ko chhod ke. Isliye \`3n² + 10n + 7\` seedha \`O(n²)\` hai.

| Complexity | Naam | n = 10⁶ (lagbhag ops) |
|---|---|---|
| O(1) | Constant | 1 |
| O(log n) | Logarithmic | 20 |
| O(n) | Linear | 10⁶ |
| O(n log n) | Linearithmic | 2 × 10⁷ |
| O(n²) | Quadratic | 10¹² |

Contests ka ek simple rule: ek second mein lagbhag **10⁸ simple operations** chalte hain.

## Loops ginna

<CodeTabs>`,
      8: `</CodeTabs>

## Space complexity

Space complexity yeh ginti hai ki algorithm **extra** memory kitni leta hai. Input ki copy banana \`O(n)\` hai; aur jo recursion \`n\` level gehri jaaye, woh bhi \`O(n)\` stack space leti hai.

<Callout type="tip">Interview mein hamesha time aur space dono batayein: "Yeh O(n log n) time aur O(1) extra space mein chalta hai."</Callout>

## Best, average aur worst case

Quick sort average mein \`O(n log n)\` hai, par worst case mein \`O(n²)\` (pehle se sorted input aur kharab pivot). Jab koi sirf "complexity" bolta hai, to aam taur pe **worst case** ki baat hoti hai.`,
    },
  },
  "arrays-introduction": {
    excerpt: "Samjhiye arrays memory mein kaise rehte hain, indexing O(1) kyun hai, aur traversal, insertion aur prefix sums mein mahir baniye.",
    parts: {
      0: `## Array kya hota hai?

Array ek hi type ke elements ko **lagataar memory (contiguous memory)** mein rakhta hai. Har element ka size same hota hai, isliye \`a[i]\` ka address bas \`base + i × size\` hai. Isi wajah se random access **O(1)** hai.

## Main operations

| Operation | Time |
|---|---|
| Access \`a[i]\` | O(1) |
| Update \`a[i] = x\` | O(1) |
| End pe insert/delete (dynamic array) | O(1) amortised |
| Beech mein insert/delete | O(n), elements ko khiskana padta hai |
| Unsorted mein search | O(n) |

## Prefix sums

Prefix-sum array O(n) ki taiyaari ke baad "\`a[l..r]\` ka sum" O(1) mein bata deta hai: \`pre[i] = a[0] + … + a[i-1]\`, to range sum hai \`pre[r+1] - pre[l]\`.

<CodeTabs>`,
      8: `</CodeTabs>

## Dynamic arrays

C++ ka \`vector\`, Java ka \`ArrayList\`, Python ki \`list\` aur JS arrays apne aap bade hote hain. Jagah khatam hone pe yeh lagbhag **do guna bada** buffer lete hain aur copy karte hain, phir bhi har append *amortised* O(1) rehta hai.

<Callout type="warning">Off-by-one errors array ka sabse common bug hai. Shuru mein hi tay kar lein ki aapki ranges inclusive \`[l, r]\` hain ya half-open \`[l, r)\`, aur usi pe tike rahein.</Callout>`,
    },
  },
  "two-pointers-technique": {
    excerpt: "Do indices ko ek dusre ki taraf ya ek hi direction mein chalakar O(n²) pair search ko O(n) scan mein badliye.",
    parts: {
      0: `## Idea kya hai

Bahut saare array problems **pairs** ke baare mein poochte hain. Har pair check karna O(n²) hai. Agar array sorted hai (ya usme koi monotonic property hai), to do indices ek hi O(n) pass mein kaam kar dete hain.

## Pattern 1, dono sire se

Sorted array mein aisa pair dhoondhiye jiska sum \`target\` ho: \`l = 0\`, \`r = n - 1\` se shuru karein. Sum chhota ho to \`l\` ko right le jaayein; bada ho to \`r\` ko left.

<CodeTabs>`,
      8: `</CodeTabs>

**Yeh kaam kyun karta hai:** agar \`a[l] + a[r] < target\`, to \`a[l]\` ka \`r\` ke left wale kisi bhi element ke saath sum aur bhi chhota hoga. Matlab \`a[l]\` kabhi answer ka hissa nahi ban sakta, aur hum use aaram se chhod dete hain.

## Pattern 2, ek hi direction (fast aur slow)

Ek *read* pointer har element ko padhta hai, aur ek *write* pointer batata hai ki agla rakha jaane wala element kahan jayega. Isse duplicates hatana ya zeroes ko khiskana in-place O(n) time aur O(1) space mein ho jaata hai. Linked lists pe yahi idea (slow 1 step, fast 2 step) middle node dhoondhta hai ya cycle pakadta hai.

<Callout type="tip">Practice karein: **Move Zeroes**, **Two Sum** (sorted version), **Trapping Rain Water**.</Callout>`,
    },
  },
  "sliding-window-technique": {
    excerpt: "Ek window ko badhaate aur ghataate hue subarray aur substring problems ko linear time mein solve karein.",
    parts: {
      0: `## Kab use karein

Aise problems dekhiye jo kisi **lagataar (contiguous)** subarray ya substring ke baare mein poochte hain: sabse lamba, sabse chhota ya sabse zyada sum, *kisi condition ke saath*. Har window ko shuru se dobara ginne ki jagah hum use **slide** karte hain: right se aane wala element jodte hain aur left se jaane wala hata dete hain.

## Fixed size window

Size \`k\` ki kisi bhi window ka sabse bada sum:

<CodeTabs>`,
      8: `</CodeTabs>

## Variable size window

"Bina repeat characters ka sabse lamba substring" jaise problem mein har step pe \`r\` badhaiye; jab tak window galat hai, \`l\` se chhota karte rahiye. Har index window mein zyada se zyada ek baar aata aur ek baar jaata hai, isliye nested \`while\` hone ke bawajood kul kaam **O(n)** hai.`,
      10: `<Callout type="info">Window ka **maximum/minimum** chahiye to *monotonic deque* lagta hai, **Sliding Window Maximum** dekhiye.</Callout>`,
    },
  },
  "binary-search-guide": {
    excerpt: "Classic binary search, lower/upper bound aur kaam ka 'binary search on the answer' pattern seekhiye.",
    parts: {
      0: `## Classic binary search

Ek interval \`[lo, hi]\` rakhiye jisme answer zaroor ho. Beech wale element se compare karke har step pe aadha hissa hata dijiye, isse **O(log n)** milta hai.

<CodeTabs>`,
      8: `</CodeTabs>

## Lower bound

\`lower_bound\` woh pehla index deta hai jahan \`a[i] ≥ x\` ho. Occurrences ginne (\`upper - lower\`) aur O(n log n) mein LIS ke liye yahi buniyaad hai.

## Answer pe binary search

Agar koi condition \`ok(x)\` **monotonic** hai (false, false, …, true, true), to aap sabse chhota \`x\` binary search se dhoondh sakte hain jahan woh true ho jaaye, chahe koi array ho hi nahi. Examples: D din mein packages pahunchane ke liye ship ki kam se kam capacity, threshold ke neeche sabse chhota divisor, Koko eating bananas.

<Callout type="warning">C++/Java mein \`mid = lo + (hi - lo) / 2\` likhiye, \`(lo + hi) / 2\` bade indices pe overflow kar sakta hai.</Callout>`,
    },
  },
  "recursion-and-backtracking": {
    excerpt: "Base cases aur call stack ke saath recursive sochna seekhiye, phir backtracking se har choice ko tareeke se explore kijiye.",
    parts: {
      0: `## Recursive sochna

Recursive function kisi problem ko usi problem ke **chhote versions** solve karke hal karta hai. Har recursion mein chahiye:

1. Ek **base case** jo recursion ko rokta hai.
2. Ek **recursive step** jo base case ki taraf badhta hai.

## Example: saare subsets banana

Har element ya to *andar* hai ya *bahar*, yaani har element ke do choices, isliye \`2ⁿ\` subsets.

<CodeTabs>`,
      8: `</CodeTabs>

## Backtracking ka template`,
      10: `**Pruning**, yaani galat adhoore states ko jaldi reject karna, hi backtracking ko practice mein fast banata hai. N-Queens mein hum kabhi attacked square pe queen nahi rakhte, isse search tree bahut chhota ho jaata hai.

<Callout type="tip">Recursion ki gehraai utna hi stack leti hai. Python ki default limit lagbhag 1000 frames hai; gehre inputs ke liye \`sys.setrecursionlimit\` use karein ya loop mein badal dein.</Callout>`,
    },
  },
  "sorting-algorithms": {
    excerpt: "Bubble, insertion, merge aur quick sort ko compare kijiye: kaise kaam karte hain, complexity kya hai, aur stability kab maayne rakhti hai.",
    parts: {
      0: `## Overview

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble sort | O(n) | O(n²) | O(n²) | O(1) | Haan |
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) | Haan |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Haan |
| Quick sort | O(n log n) | O(n log n) | O(n²) | O(log n) | Nahi |
| Heap sort | O(n log n) | O(n log n) | O(n log n) | O(1) | Nahi |

Sort **stable** tab hai jab barabar elements apna purana order bachaye rakhein. Records ko kai keys se sort karte waqt yeh zaroori hota hai.

## Merge sort

Array ko aadha-aadha baantiye, dono hisson ko recursively sort kijiye, phir do sorted hisson ko linear time mein **merge** kijiye.

<CodeTabs>`,
      8: `</CodeTabs>

## Quick sort

Ek **pivot** chuniye, partition kijiye taaki chhote elements left aur bade right mein jaayein, phir recurse kijiye. Random pivot se O(n²) wala worst case lagbhag namumkin ho jaata hai.

<Callout type="info">Library ke sorts hybrid hote hain: C++ ka \`std::sort\` introsort use karta hai; Python aur Java (objects) **Timsort** use karte hain, jo stable hai.</Callout>`,
    },
  },
};
