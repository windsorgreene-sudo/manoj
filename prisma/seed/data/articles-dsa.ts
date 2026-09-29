import type { SeedArticle } from "./types";

const fence = "```";

export const dsaArticles: SeedArticle[] = [
  {
    slug: "time-and-space-complexity",
    title: "Time and Space Complexity (Big-O)",
    category: "dsa",
    difficulty: "EASY",
    excerpt: "Learn how to measure how an algorithm scales using Big-O notation, with worked examples for loops, nested loops and recursion.",
    tags: ["complexity", "big-o", "fundamentals"],
    content: `## Why complexity matters

Two programs can produce the same answer while one finishes in a millisecond and the other takes an hour. **Asymptotic analysis** lets us compare algorithms without running them, by counting how the number of basic operations grows with the input size \`n\`.

## Big-O notation

We write \`O(f(n))\` to describe an **upper bound** on growth, ignoring constants and lower-order terms. So \`3n² + 10n + 7\` is simply \`O(n²)\`.

| Complexity | Name | n = 10⁶ (approx. ops) |
|---|---|---|
| O(1) | Constant | 1 |
| O(log n) | Logarithmic | 20 |
| O(n) | Linear | 10⁶ |
| O(n log n) | Linearithmic | 2 × 10⁷ |
| O(n²) | Quadratic | 10¹² |

A rule of thumb for contests: about **10⁸ simple operations per second**.

## Counting loops

<CodeTabs>

${fence}cpp
// O(n): one pass
long long sum = 0;
for (int i = 0; i < n; i++) sum += a[i];

// O(n^2): every pair
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (a[i] + a[j] == target) found = true;
${fence}

${fence}python
# O(n): one pass
total = sum(a)

# O(n^2): every pair
found = any(a[i] + a[j] == target
            for i in range(n) for j in range(i + 1, n))
${fence}

${fence}java
// O(log n): halve the range every step
int steps = 0;
for (int x = n; x > 1; x /= 2) steps++;
${fence}

${fence}javascript
// O(n log n): sorting dominates
const sorted = [...a].sort((x, y) => x - y);
${fence}

</CodeTabs>

## Space complexity

Space complexity counts the **extra** memory an algorithm allocates. Creating a copy of the input is \`O(n)\`; a recursion that goes \`n\` levels deep also uses \`O(n)\` stack space.

<Callout type="tip">Always state both time and space in interviews: "This runs in O(n log n) time and O(1) extra space."</Callout>

## Best, average and worst case

Quick sort is \`O(n log n)\` on average but \`O(n²)\` in the worst case (already-sorted input with a bad pivot). When we say "complexity" without qualification we usually mean the **worst case**.`,
    quiz: [
      { q: "What is the time complexity of 5n² + 3n + 100?", options: ["O(n)", "O(n²)", "O(5n²)", "O(n³)"], answer: 1, explanation: "Drop constants and lower-order terms: O(n²)." },
      { q: "A loop that halves n each iteration runs in…", options: ["O(n)", "O(√n)", "O(log n)", "O(1)"], answer: 2, explanation: "n → n/2 → n/4 … reaches 1 after log₂ n steps." },
      { q: "Roughly how many simple operations fit in one second?", options: ["10⁴", "10⁶", "10⁸", "10¹²"], answer: 2, explanation: "About 10⁸ is the common competitive-programming estimate." },
    ],
  },
  {
    slug: "arrays-introduction",
    title: "Arrays: The Foundation of DSA",
    category: "dsa",
    difficulty: "EASY",
    excerpt: "Understand how arrays live in memory, why indexing is O(1), and master traversal, insertion and prefix sums.",
    tags: ["arrays", "prefix-sum", "fundamentals"],
    content: `## What is an array?

An array stores elements of the same type in **contiguous memory**. Because every element has the same size, the address of \`a[i]\` is simply \`base + i × size\`, that's why random access is **O(1)**.

## Core operations

| Operation | Time |
|---|---|
| Access \`a[i]\` | O(1) |
| Update \`a[i] = x\` | O(1) |
| Insert/delete at end (dynamic array) | O(1) amortised |
| Insert/delete in the middle | O(n), elements must shift |
| Search unsorted | O(n) |

## Prefix sums

A prefix-sum array answers "sum of \`a[l..r]\`" in O(1) after O(n) preprocessing: \`pre[i] = a[0] + … + a[i-1]\`, so the range sum is \`pre[r+1] - pre[l]\`.

<CodeTabs>

${fence}cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<int> a = {3, 1, 4, 1, 5, 9, 2, 6};
    vector<long long> pre(a.size() + 1, 0);
    for (size_t i = 0; i < a.size(); i++) pre[i + 1] = pre[i] + a[i];
    // sum of a[2..5] = 4 + 1 + 5 + 9
    cout << pre[6] - pre[2] << endl; // 19
}
${fence}

${fence}python
a = [3, 1, 4, 1, 5, 9, 2, 6]
pre = [0]
for x in a:
    pre.append(pre[-1] + x)
print(pre[6] - pre[2])  # 19
${fence}

${fence}java
public class Main {
    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2, 6};
        long[] pre = new long[a.length + 1];
        for (int i = 0; i < a.length; i++) pre[i + 1] = pre[i] + a[i];
        System.out.println(pre[6] - pre[2]); // 19
    }
}
${fence}

${fence}javascript
const a = [3, 1, 4, 1, 5, 9, 2, 6];
const pre = [0];
for (const x of a) pre.push(pre[pre.length - 1] + x);
console.log(pre[6] - pre[2]); // 19
${fence}

</CodeTabs>

## Dynamic arrays

\`vector\` in C++, \`ArrayList\` in Java, \`list\` in Python and JS arrays grow automatically. When capacity runs out they allocate a buffer about **twice as large** and copy, each append is still O(1) *amortised*.

<Callout type="warning">Off-by-one errors are the #1 array bug. Decide early whether your ranges are inclusive \`[l, r]\` or half-open \`[l, r)\` and stick to it.</Callout>`,
    quiz: [
      { q: "Why is array access O(1)?", options: ["Arrays are sorted", "Address = base + i × size", "Arrays are cached", "Hashing"], answer: 1, explanation: "Contiguous storage makes the address computable directly." },
      { q: "With prefix array pre, the sum of a[l..r] is…", options: ["pre[r] - pre[l]", "pre[r+1] - pre[l]", "pre[r] - pre[l-1]", "pre[r+1] + pre[l]"], answer: 1, explanation: "pre[i] holds the sum of the first i elements." },
    ],
  },
  {
    slug: "two-pointers-technique",
    title: "The Two Pointers Technique",
    category: "dsa",
    difficulty: "EASY",
    excerpt: "Turn O(n²) pair searches into O(n) scans using two indices that move toward each other or in the same direction.",
    tags: ["two-pointers", "arrays", "patterns"],
    content: `## The idea

Many array problems ask about **pairs**. Checking every pair is O(n²). If the array is sorted (or has some monotonic property), two indices can sweep it in a single O(n) pass.

## Pattern 1, opposite ends

Find a pair with sum equal to \`target\` in a sorted array: start with \`l = 0\`, \`r = n - 1\`. If the sum is too small, move \`l\` right; if too big, move \`r\` left.

<CodeTabs>

${fence}cpp
bool pairSum(const vector<int>& a, int target) {
    int l = 0, r = (int)a.size() - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == target) return true;
        if (s < target) l++; else r--;
    }
    return false;
}
${fence}

${fence}python
def pair_sum(a, target):
    l, r = 0, len(a) - 1
    while l < r:
        s = a[l] + a[r]
        if s == target:
            return True
        if s < target:
            l += 1
        else:
            r -= 1
    return False

print(pair_sum([1, 2, 4, 7, 11, 15], 15))  # True
${fence}

${fence}java
static boolean pairSum(int[] a, int target) {
    int l = 0, r = a.length - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == target) return true;
        if (s < target) l++; else r--;
    }
    return false;
}
${fence}

${fence}javascript
function pairSum(a, target) {
  let l = 0, r = a.length - 1;
  while (l < r) {
    const s = a[l] + a[r];
    if (s === target) return true;
    s < target ? l++ : r--;
  }
  return false;
}
console.log(pairSum([1, 2, 4, 7, 11, 15], 15)); // true
${fence}

</CodeTabs>

**Why it works:** if \`a[l] + a[r] < target\`, then \`a[l]\` paired with any element left of \`r\` is even smaller, so \`a[l]\` can never be part of the answer and we safely discard it.

## Pattern 2, same direction (fast & slow)

A *read* pointer scans every element while a *write* pointer marks where the next kept element goes. This removes duplicates or moves zeroes in-place in O(n) time and O(1) space. The same idea on linked lists (slow moves 1, fast moves 2) finds the middle node or detects a cycle.

<Callout type="tip">Practice: **Move Zeroes**, **Two Sum** (sorted version), **Trapping Rain Water**.</Callout>`,
    quiz: [
      { q: "Two pointers from opposite ends usually requires the array to be…", options: ["Sorted", "Distinct", "Positive", "Of even length"], answer: 0, explanation: "The monotonic order justifies discarding one end." },
      { q: "Fast/slow pointers on a linked list can…", options: ["Sort it", "Find the middle node", "Reverse it in O(1)", "Hash it"], answer: 1, explanation: "When fast reaches the end, slow is at the middle." },
    ],
  },
  {
    slug: "sliding-window-technique",
    title: "Sliding Window Technique",
    category: "dsa",
    difficulty: "MEDIUM",
    excerpt: "Solve subarray and substring problems in linear time by maintaining a window that grows and shrinks.",
    tags: ["sliding-window", "strings", "patterns"],
    content: `## When to use it

Look for problems asking about a **contiguous** subarray or substring that is the longest/shortest/has max sum *subject to a condition*. Instead of recomputing each window from scratch, we **slide**: add the element entering on the right and remove the one leaving on the left.

## Fixed-size window

Maximum sum of any window of size \`k\`:

<CodeTabs>

${fence}python
def max_window_sum(a, k):
    s = sum(a[:k])
    best = s
    for i in range(k, len(a)):
        s += a[i] - a[i - k]
        best = max(best, s)
    return best

print(max_window_sum([2, 1, 5, 1, 3, 2], 3))  # 9
${fence}

${fence}cpp
int maxWindowSum(const vector<int>& a, int k) {
    int s = accumulate(a.begin(), a.begin() + k, 0), best = s;
    for (int i = k; i < (int)a.size(); i++) {
        s += a[i] - a[i - k];
        best = max(best, s);
    }
    return best;
}
${fence}

${fence}java
static int maxWindowSum(int[] a, int k) {
    int s = 0;
    for (int i = 0; i < k; i++) s += a[i];
    int best = s;
    for (int i = k; i < a.length; i++) {
        s += a[i] - a[i - k];
        best = Math.max(best, s);
    }
    return best;
}
${fence}

${fence}javascript
function maxWindowSum(a, k) {
  let s = a.slice(0, k).reduce((x, y) => x + y, 0), best = s;
  for (let i = k; i < a.length; i++) {
    s += a[i] - a[i - k];
    best = Math.max(best, s);
  }
  return best;
}
console.log(maxWindowSum([2, 1, 5, 1, 3, 2], 3)); // 9
${fence}

</CodeTabs>

## Variable-size window

For "longest substring without repeating characters", expand \`r\` every step; while the window is invalid, shrink from \`l\`. Every index enters and leaves the window at most once, so the total work is **O(n)** even though there is a nested \`while\`.

${fence}python
def longest_unique(s):
    last, l, best = {}, 0, 0
    for r, ch in enumerate(s):
        if last.get(ch, -1) >= l:
            l = last[ch] + 1
        last[ch] = r
        best = max(best, r - l + 1)
    return best

print(longest_unique("abcabcbb"))  # 3
${fence}

<Callout type="info">For window **maximum/minimum** you need a *monotonic deque*, see **Sliding Window Maximum**.</Callout>`,
    quiz: [
      { q: "Sliding window applies to…", options: ["Any subsequence", "Contiguous subarrays", "Only sorted arrays", "Trees"], answer: 1, explanation: "Windows are contiguous by definition." },
      { q: "Why is the variable window O(n) despite a nested loop?", options: ["It isn't", "Each index enters and leaves once", "Hashing", "Sorting first"], answer: 1, explanation: "Both pointers only move forward: at most 2n moves." },
    ],
  },
  {
    slug: "binary-search-guide",
    title: "Binary Search: Beyond Sorted Arrays",
    category: "dsa",
    difficulty: "MEDIUM",
    excerpt: "Master the classic binary search, lower/upper bound, and the powerful 'binary search on the answer' pattern.",
    tags: ["binary-search", "searching"],
    content: `## Classic binary search

Keep an interval \`[lo, hi]\` that must contain the answer. Compare with the middle element and discard half each step → **O(log n)**.

<CodeTabs>

${fence}cpp
int binarySearch(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2; // avoids overflow
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}
${fence}

${fence}python
def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([-1, 0, 3, 5, 9, 12], 9))  # 4
${fence}

${fence}java
static int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}
${fence}

${fence}javascript
function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === target) return mid;
    a[mid] < target ? (lo = mid + 1) : (hi = mid - 1);
  }
  return -1;
}
console.log(binarySearch([-1, 0, 3, 5, 9, 12], 9)); // 4
${fence}

</CodeTabs>

## Lower bound

\`lower_bound\` returns the first index with \`a[i] ≥ x\`. It is the building block for counting occurrences (\`upper - lower\`) and for LIS in O(n log n).

## Binary search on the answer

If a predicate \`ok(x)\` is **monotonic** (false, false, …, true, true), you can binary-search the smallest \`x\` where it becomes true, even when there's no array at all. Examples: minimum ship capacity to deliver packages in D days, smallest divisor under a threshold, Koko eating bananas.

<Callout type="warning">Write \`mid = lo + (hi - lo) / 2\` in C++/Java, \`(lo + hi) / 2\` can overflow for large indices.</Callout>`,
    quiz: [
      { q: "lower_bound(x) returns the first index with…", options: ["a[i] > x", "a[i] ≥ x", "a[i] == x", "a[i] < x"], answer: 1, explanation: "upper_bound uses strict >." },
      { q: "'Binary search on the answer' requires the predicate to be…", options: ["Linear", "Monotonic", "Convex", "Constant"], answer: 1, explanation: "false…false true…true lets us halve the search space." },
    ],
  },
  {
    slug: "recursion-and-backtracking",
    title: "Recursion and Backtracking",
    category: "dsa",
    difficulty: "MEDIUM",
    excerpt: "Think recursively with base cases and the call stack, then explore choices systematically with backtracking.",
    tags: ["recursion", "backtracking"],
    content: `## Thinking recursively

A recursive function solves a problem by solving **smaller instances of the same problem**. Every recursion needs:

1. A **base case** that stops the recursion.
2. A **recursive step** that moves toward the base case.

## Example: generating all subsets

Each element is either *in* or *out*, two choices per element, so \`2ⁿ\` subsets.

<CodeTabs>

${fence}python
def subsets(nums):
    result, path = [], []

    def go(i):
        if i == len(nums):          # base case
            result.append(path[:])
            return
        path.append(nums[i])        # choose
        go(i + 1)
        path.pop()                  # un-choose (backtrack)
        go(i + 1)

    go(0)
    return result

print(subsets([1, 2, 3]))
${fence}

${fence}cpp
void go(int i, vector<int>& nums, vector<int>& path, vector<vector<int>>& res) {
    if (i == (int)nums.size()) { res.push_back(path); return; }
    path.push_back(nums[i]);
    go(i + 1, nums, path, res);
    path.pop_back();
    go(i + 1, nums, path, res);
}
${fence}

${fence}java
static void go(int i, int[] nums, Deque<Integer> path, List<List<Integer>> res) {
    if (i == nums.length) { res.add(new ArrayList<>(path)); return; }
    path.addLast(nums[i]);
    go(i + 1, nums, path, res);
    path.removeLast();
    go(i + 1, nums, path, res);
}
${fence}

${fence}javascript
function subsets(nums) {
  const res = [], path = [];
  (function go(i) {
    if (i === nums.length) return void res.push([...path]);
    path.push(nums[i]); go(i + 1);
    path.pop(); go(i + 1);
  })(0);
  return res;
}
console.log(subsets([1, 2, 3]).length); // 8
${fence}

</CodeTabs>

## The backtracking template

\`\`\`
solve(state):
    if state is complete: record it; return
    for choice in choices(state):
        if valid(choice):
            apply(choice)
            solve(state)
            undo(choice)
\`\`\`

**Pruning**, rejecting invalid partial states early, is what makes backtracking fast in practice. In N-Queens we never place a queen on an attacked square, cutting the search tree dramatically.

<Callout type="tip">Recursion depth equals stack usage. Python's default limit is ~1000 frames; use \`sys.setrecursionlimit\` or convert to iteration for deep inputs.</Callout>`,
    quiz: [
      { q: "What must every recursive function have?", options: ["A loop", "A base case", "A global variable", "Memoisation"], answer: 1, explanation: "Without a base case recursion never terminates." },
      { q: "How many subsets does a set of n elements have?", options: ["n", "n²", "2ⁿ", "n!"], answer: 2, explanation: "Each element is in or out." },
    ],
  },
  {
    slug: "sorting-algorithms",
    title: "Sorting Algorithms Explained",
    category: "dsa",
    difficulty: "MEDIUM",
    excerpt: "Compare bubble, insertion, merge and quick sort, how they work, their complexity, and when stability matters.",
    tags: ["sorting", "merge-sort", "quick-sort"],
    content: `## Overview

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

A sort is **stable** if equal elements keep their original relative order, important when sorting records by multiple keys.

## Merge sort

Divide the array in half, sort each half recursively, then **merge** two sorted halves in linear time.

<CodeTabs>

${fence}python
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
${fence}

${fence}cpp
void mergeSort(vector<int>& a, int l, int r) {
    if (r - l <= 1) return;
    int m = (l + r) / 2;
    mergeSort(a, l, m); mergeSort(a, m, r);
    inplace_merge(a.begin() + l, a.begin() + m, a.begin() + r);
}
${fence}

${fence}java
static void mergeSort(int[] a, int[] tmp, int l, int r) {
    if (r - l <= 1) return;
    int m = (l + r) >>> 1;
    mergeSort(a, tmp, l, m); mergeSort(a, tmp, m, r);
    int i = l, j = m, k = l;
    while (i < m && j < r) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i < m) tmp[k++] = a[i++];
    while (j < r) tmp[k++] = a[j++];
    System.arraycopy(tmp, l, a, l, r - l);
}
${fence}

${fence}javascript
function mergeSort(a) {
  if (a.length <= 1) return a;
  const m = a.length >> 1, L = mergeSort(a.slice(0, m)), R = mergeSort(a.slice(m));
  const out = [];
  while (L.length && R.length) out.push(L[0] <= R[0] ? L.shift() : R.shift());
  return [...out, ...L, ...R];
}
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
${fence}

</CodeTabs>

## Quick sort

Pick a **pivot**, partition so smaller elements go left and larger go right, then recurse. A random pivot makes the O(n²) worst case astronomically unlikely.

<Callout type="info">Library sorts are hybrids: C++ \`std::sort\` uses introsort; Python and Java (objects) use **Timsort**, which is stable.</Callout>`,
    quiz: [
      { q: "Which sort is guaranteed O(n log n) and stable?", options: ["Quick sort", "Heap sort", "Merge sort", "Selection sort"], answer: 2, explanation: "Merge sort is always O(n log n) and stable." },
      { q: "Quick sort's worst case is…", options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"], answer: 2, explanation: "Bad pivots produce unbalanced partitions." },
    ],
  },
  {
    slug: "linked-list-basics",
    title: "Linked Lists: Singly and Doubly",
    category: "dsa",
    difficulty: "EASY",
    excerpt: "Build a linked list from scratch, reverse it in-place and detect cycles with Floyd's algorithm.",
    tags: ["linked-list", "pointers"],
    content: `## Structure

A linked list is a chain of **nodes**; each node stores a value and a pointer to the next node. Unlike arrays, nodes are scattered in memory, so access by index is O(n), but insertion/deletion at a known node is O(1).

## Reversing a list in-place

Walk the list, flipping each \`next\` pointer to point backward.

<CodeTabs>

${fence}cpp
struct Node { int val; Node* next; Node(int v) : val(v), next(nullptr) {} };

Node* reverse(Node* head) {
    Node* prev = nullptr;
    while (head) {
        Node* nxt = head->next;
        head->next = prev;
        prev = head;
        head = nxt;
    }
    return prev;
}
${fence}

${fence}python
class Node:
    def __init__(self, val, nxt=None):
        self.val, self.next = val, nxt

def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev

head = Node(1, Node(2, Node(3)))
node = reverse(head)
while node:
    print(node.val, end=" ")  # 3 2 1
    node = node.next
${fence}

${fence}java
class Node { int val; Node next; Node(int v) { val = v; } }

static Node reverse(Node head) {
    Node prev = null;
    while (head != null) {
        Node nxt = head.next;
        head.next = prev;
        prev = head;
        head = nxt;
    }
    return prev;
}
${fence}

${fence}javascript
function reverse(head) {
  let prev = null;
  while (head) [head.next, prev, head] = [prev, head, head.next];
  return prev;
}
const list = { val: 1, next: { val: 2, next: { val: 3, next: null } } };
let n = reverse(list);
while (n) { console.log(n.val); n = n.next; }
${fence}

</CodeTabs>

## Floyd's cycle detection

Move \`slow\` one step and \`fast\` two steps. If there is a cycle they must meet; if \`fast\` hits \`null\`, there is none. O(n) time, O(1) space.

## Doubly linked lists

Each node also keeps a \`prev\` pointer, allowing O(1) deletion given only the node. This is exactly how an **LRU cache** is built: a hash map for O(1) lookup plus a doubly linked list for O(1) move-to-front.`,
    quiz: [
      { q: "Accessing the k-th node of a linked list takes…", options: ["O(1)", "O(log n)", "O(k)", "O(k²)"], answer: 2, explanation: "You must walk k pointers." },
      { q: "Floyd's algorithm uses…", options: ["A hash set", "Slow and fast pointers", "Recursion", "Sorting"], answer: 1, explanation: "Tortoise and hare." },
    ],
  },
  {
    slug: "stacks-and-queues",
    title: "Stacks and Queues",
    category: "dsa",
    difficulty: "EASY",
    excerpt: "LIFO vs FIFO, implementing both with arrays and linked lists, plus classic applications like bracket matching and BFS.",
    tags: ["stack", "queue", "deque"],
    content: `## Stack: Last In, First Out

Think of a pile of plates: you \`push\` on top and \`pop\` from the top. Both are O(1). Stacks power function calls, undo, expression evaluation and bracket matching.

## Queue: First In, First Out

A line at a ticket counter: \`enqueue\` at the back, \`dequeue\` from the front, both O(1). Queues power BFS, task scheduling and buffering.

## Bracket matching with a stack

<CodeTabs>

${fence}python
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return not stack

print(is_valid("{[()]}"), is_valid("(]"))  # True False
${fence}

${fence}cpp
bool isValid(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            if (st.empty()) return false;
            char o = st.top(); st.pop();
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) return false;
        }
    }
    return st.empty();
}
${fence}

${fence}java
static boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if ("([{".indexOf(c) >= 0) st.push(c);
        else if (st.isEmpty() || "([{".indexOf(st.pop()) != ")]}".indexOf(c)) return false;
    }
    return st.isEmpty();
}
${fence}

${fence}javascript
function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" }, st = [];
  for (const c of s) {
    if ("([{".includes(c)) st.push(c);
    else if (st.pop() !== pairs[c]) return false;
  }
  return st.length === 0;
}
console.log(isValid("{[()]}"), isValid("(]"));
${fence}

</CodeTabs>

## Deque and monotonic structures

A **deque** supports O(1) push/pop at both ends. Keeping it *monotonic* (always increasing or decreasing) solves "next greater element" and "sliding window maximum" in O(n).

<Callout type="warning">In Python, never use \`list.pop(0)\` as a queue, it's O(n). Use \`collections.deque\`.</Callout>`,
    quiz: [
      { q: "Which structure does BFS use?", options: ["Stack", "Queue", "Heap", "Tree"], answer: 1, explanation: "FIFO order explores level by level." },
      { q: "Undo functionality is naturally modelled by a…", options: ["Queue", "Stack", "Graph", "Hash map"], answer: 1, explanation: "The most recent action is undone first: LIFO." },
    ],
  },
  {
    slug: "hashing-and-hash-maps",
    title: "Hashing and Hash Maps",
    category: "dsa",
    difficulty: "EASY",
    excerpt: "How hash tables achieve O(1) lookups, collisions, load factor, and the frequency-count pattern.",
    tags: ["hashing", "hash-map", "hash-set"],
    content: `## How a hash table works

A **hash function** maps a key to an integer; taking it modulo the table size gives a bucket index. Lookups, inserts and deletes are **O(1) on average**.

When two keys land in the same bucket we have a **collision**, resolved by *chaining* (each bucket is a small list) or *open addressing* (probe for the next free slot). Tables resize when the **load factor** (items ÷ buckets) passes a threshold like 0.75.

## The frequency-count pattern

<CodeTabs>

${fence}python
from collections import Counter

words = "the cat and the hat and the bat".split()
freq = Counter(words)
print(freq.most_common(2))  # [('the', 3), ('and', 2)]
${fence}

${fence}cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<string> words = {"the","cat","and","the","hat","and","the","bat"};
    unordered_map<string,int> freq;
    for (auto& w : words) freq[w]++;
    cout << freq["the"] << endl; // 3
}
${fence}

${fence}java
import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] words = "the cat and the hat and the bat".split(" ");
        Map<String, Integer> freq = new HashMap<>();
        for (String w : words) freq.merge(w, 1, Integer::sum);
        System.out.println(freq.get("the")); // 3
    }
}
${fence}

${fence}javascript
const words = "the cat and the hat and the bat".split(" ");
const freq = new Map();
for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
console.log(freq.get("the")); // 3
${fence}

</CodeTabs>

## Classic uses

- **Two Sum** in O(n): store \`value → index\` and look up \`target - x\`.
- **Anagram grouping**: key = sorted word.
- **Subarray sum equals K**: store counts of prefix sums.

<Callout type="info">Worst case is O(n) per operation if every key collides. Competitive programmers sometimes add a random salt to the hash to avoid adversarial inputs.</Callout>`,
    quiz: [
      { q: "Average lookup time in a hash map is…", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0, explanation: "With a good hash function and resizing." },
      { q: "What is the load factor?", options: ["Buckets / items", "Items / buckets", "Collisions / items", "Hash / size"], answer: 1, explanation: "It measures how full the table is." },
    ],
  },
  {
    slug: "binary-search-trees",
    title: "Binary Trees and Binary Search Trees",
    category: "dsa",
    difficulty: "MEDIUM",
    excerpt: "Tree terminology, the four traversals, and how the BST property gives O(log n) search when the tree is balanced.",
    tags: ["trees", "bst", "traversal"],
    content: `## Terminology

A **binary tree** is a hierarchy where each node has at most two children. The top node is the *root*, nodes without children are *leaves*, and the **height** is the longest root-to-leaf path.

## Traversals

- **Preorder** (root, left, right), copy a tree.
- **Inorder** (left, root, right), gives a BST in sorted order.
- **Postorder** (left, right, root), delete a tree / evaluate expressions.
- **Level order** (BFS), level by level using a queue.

## The BST property

For every node, all keys in the left subtree are **smaller** and all keys in the right subtree are **larger**. Search, insert and delete walk one path: **O(h)**: O(log n) for balanced trees, O(n) for a degenerate "linked list" tree.

<CodeTabs>

${fence}python
class Node:
    def __init__(self, key):
        self.key, self.left, self.right = key, None, None

def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root

def inorder(root):
    return inorder(root.left) + [root.key] + inorder(root.right) if root else []

root = None
for k in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, k)
print(inorder(root))  # sorted!
${fence}

${fence}cpp
struct Node { int key; Node *left = nullptr, *right = nullptr; Node(int k) : key(k) {} };

Node* insert(Node* root, int key) {
    if (!root) return new Node(key);
    if (key < root->key) root->left = insert(root->left, key);
    else root->right = insert(root->right, key);
    return root;
}
void inorder(Node* r) { if (!r) return; inorder(r->left); cout << r->key << ' '; inorder(r->right); }
${fence}

${fence}java
class Node { int key; Node left, right; Node(int k) { key = k; } }

static Node insert(Node root, int key) {
    if (root == null) return new Node(key);
    if (key < root.key) root.left = insert(root.left, key);
    else root.right = insert(root.right, key);
    return root;
}
${fence}

${fence}javascript
function insert(root, key) {
  if (!root) return { key, left: null, right: null };
  if (key < root.key) root.left = insert(root.left, key);
  else root.right = insert(root.right, key);
  return root;
}
const inorder = (r) => (r ? [...inorder(r.left), r.key, ...inorder(r.right)] : []);
let root = null;
for (const k of [50, 30, 70, 20, 40, 60, 80]) root = insert(root, k);
console.log(inorder(root));
${fence}

</CodeTabs>

<Callout type="tip">Self-balancing BSTs (AVL, Red-Black) keep height O(log n). C++ \`std::map\` and Java \`TreeMap\` are Red-Black trees.</Callout>`,
    quiz: [
      { q: "Inorder traversal of a BST yields…", options: ["Random order", "Sorted order", "Reverse insertion order", "Level order"], answer: 1, explanation: "Left < root < right at every node." },
      { q: "Search in an unbalanced BST can degrade to…", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explanation: "Inserting sorted keys forms a chain." },
    ],
  },
  {
    slug: "graph-traversal-bfs-dfs",
    title: "Graph Traversal: BFS and DFS",
    category: "dsa",
    difficulty: "MEDIUM",
    excerpt: "Represent graphs with adjacency lists and explore them with breadth-first and depth-first search.",
    tags: ["graphs", "bfs", "dfs"],
    content: `## Representing a graph

A graph has **vertices** and **edges**. The adjacency **list** (\`adj[u]\` = neighbours of \`u\`) uses O(V + E) memory and is the default choice. An adjacency **matrix** uses O(V²) but answers "is there an edge u-v?" in O(1).

## Breadth-first search

BFS explores in **rings of increasing distance** using a queue. In an unweighted graph it finds shortest paths.

<CodeTabs>

${fence}python
from collections import deque

def bfs(adj, src):
    dist = {src: 0}
    q = deque([src])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

adj = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2, 4], 4: [3]}
print(bfs(adj, 0))  # {0: 0, 1: 1, 2: 1, 3: 2, 4: 3}
${fence}

${fence}cpp
vector<int> bfs(const vector<vector<int>>& adj, int src) {
    vector<int> dist(adj.size(), -1);
    queue<int> q; q.push(src); dist[src] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
    return dist;
}
${fence}

${fence}java
static int[] bfs(List<List<Integer>> adj, int src) {
    int[] dist = new int[adj.size()];
    Arrays.fill(dist, -1);
    Deque<Integer> q = new ArrayDeque<>();
    q.add(src); dist[src] = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : adj.get(u)) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.add(v); }
    }
    return dist;
}
${fence}

${fence}javascript
function bfs(adj, src) {
  const dist = new Map([[src, 0]]), q = [src];
  for (let i = 0; i < q.length; i++) {
    const u = q[i];
    for (const v of adj[u]) if (!dist.has(v)) { dist.set(v, dist.get(u) + 1); q.push(v); }
  }
  return dist;
}
console.log(bfs({ 0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2, 4], 4: [3] }, 0));
${fence}

</CodeTabs>

## Depth-first search

DFS goes **as deep as possible** before backtracking (recursion or an explicit stack). It is the tool for connected components, cycle detection, topological sort and finding bridges.

Both BFS and DFS run in **O(V + E)**.

<Callout type="tip">Grid problems are graphs in disguise: each cell is a vertex connected to its 4 neighbours. **Number of Islands** is just counting connected components.</Callout>`,
    quiz: [
      { q: "BFS finds shortest paths in…", options: ["Weighted graphs", "Unweighted graphs", "Only trees", "Negative-weight graphs"], answer: 1, explanation: "Each edge counts as 1 step." },
      { q: "Time complexity of BFS/DFS with adjacency lists?", options: ["O(V)", "O(E)", "O(V + E)", "O(V²)"], answer: 2, explanation: "Every vertex and edge is processed once." },
    ],
  },
  {
    slug: "dynamic-programming-introduction",
    title: "Introduction to Dynamic Programming",
    category: "dsa",
    difficulty: "HARD",
    excerpt: "Recognise overlapping subproblems and optimal substructure, then solve with memoisation or tabulation.",
    tags: ["dynamic-programming", "memoization"],
    content: `## When is DP applicable?

1. **Optimal substructure**, the optimal answer is built from optimal answers to subproblems.
2. **Overlapping subproblems**, the same subproblems are solved again and again.

Naive Fibonacci recomputes \`fib(n-2)\` exponentially many times. Storing results turns O(2ⁿ) into O(n).

## Top-down vs bottom-up

<CodeTabs>

${fence}python
from functools import lru_cache

@lru_cache(maxsize=None)          # top-down: memoisation
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

def fib_table(n):                 # bottom-up: tabulation
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib(50), fib_table(50))
${fence}

${fence}cpp
long long fibTable(int n) {
    long long a = 0, b = 1;
    for (int i = 0; i < n; i++) { long long c = a + b; a = b; b = c; }
    return a;
}
${fence}

${fence}java
static long fibTable(int n) {
    long a = 0, b = 1;
    for (int i = 0; i < n; i++) { long c = a + b; a = b; b = c; }
    return a;
}
${fence}

${fence}javascript
const memo = new Map();
function fib(n) {
  if (n < 2) return n;
  if (!memo.has(n)) memo.set(n, fib(n - 1) + fib(n - 2));
  return memo.get(n);
}
console.log(fib(50));
${fence}

</CodeTabs>

## A recipe for DP problems

1. **Define the state**, what does \`dp[i]\` (or \`dp[i][j]\`) mean in words?
2. **Write the transition**, how does a state depend on smaller states?
3. **Set base cases.**
4. **Choose the order** of computation so dependencies are ready.
5. **Extract the answer** and optimise space if only the last row is needed.

## Worked example: Coin Change

State: \`dp[x]\` = fewest coins to make amount \`x\`. Transition: \`dp[x] = 1 + min(dp[x - c])\` over coins \`c ≤ x\`. Base: \`dp[0] = 0\`. Complexity O(amount × coins).

<Callout type="tip">Classic DP families: knapsack, LIS, LCS/edit distance, interval DP, DP on trees, bitmask DP.</Callout>`,
    quiz: [
      { q: "Memoisation is…", options: ["Bottom-up DP", "Top-down DP with caching", "Greedy", "Divide and conquer without overlap"], answer: 1, explanation: "Recursion + cache." },
      { q: "Which property means the same subproblem recurs?", options: ["Optimal substructure", "Overlapping subproblems", "Greedy choice", "Monotonicity"], answer: 1, explanation: "That's why caching helps." },
    ],
  },
  {
    slug: "dijkstra-shortest-path",
    title: "Dijkstra's Shortest Path Algorithm",
    category: "dsa",
    difficulty: "HARD",
    excerpt: "Find single-source shortest paths in graphs with non-negative weights using a priority queue.",
    tags: ["graphs", "shortest-path", "dijkstra", "heap"],
    content: `## The problem

Given a weighted graph with **non-negative** edge weights and a source \`s\`, find the shortest distance from \`s\` to every vertex. BFS is not enough once edges have different weights.

## The greedy insight

Always expand the unvisited vertex with the **smallest tentative distance**. Because weights are non-negative, no later path can make that vertex any closer, its distance is final.

<CodeTabs>

${fence}python
import heapq

def dijkstra(adj, s):
    dist = {v: float("inf") for v in adj}
    dist[s] = 0
    pq = [(0, s)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue            # stale entry
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist

adj = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
print(dijkstra(adj, 0))  # {0: 0, 1: 3, 2: 1, 3: 4}
${fence}

${fence}cpp
vector<long long> dijkstra(const vector<vector<pair<int,int>>>& adj, int s) {
    vector<long long> dist(adj.size(), LLONG_MAX);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u])
            if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
    }
    return dist;
}
${fence}

${fence}java
static long[] dijkstra(List<List<int[]>> adj, int s) {
    long[] dist = new long[adj.size()];
    Arrays.fill(dist, Long.MAX_VALUE);
    PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(x -> x[0]));
    dist[s] = 0; pq.add(new long[]{0, s});
    while (!pq.isEmpty()) {
        long[] top = pq.poll();
        int u = (int) top[1];
        if (top[0] > dist[u]) continue;
        for (int[] e : adj.get(u))
            if (dist[u] + e[1] < dist[e[0]]) { dist[e[0]] = dist[u] + e[1]; pq.add(new long[]{dist[e[0]], e[0]}); }
    }
    return dist;
}
${fence}

${fence}javascript
// Simple O(V^2) version, fine for small graphs
function dijkstra(adj, s) {
  const n = adj.length, dist = Array(n).fill(Infinity), done = Array(n).fill(false);
  dist[s] = 0;
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
    if (dist[u] === Infinity) break;
    done[u] = true;
    for (const [v, w] of adj[u]) dist[v] = Math.min(dist[v], dist[u] + w);
  }
  return dist;
}
console.log(dijkstra([[[1, 4], [2, 1]], [[3, 1]], [[1, 2], [3, 5]], []], 0));
${fence}

</CodeTabs>

## Complexity

With a binary heap: **O((V + E) log V)**. The array-based version is O(V²), which is actually better for very dense graphs.

<Callout type="warning">Dijkstra fails with **negative** edges. Use Bellman-Ford (O(VE)) instead, which also detects negative cycles.</Callout>`,
    quiz: [
      { q: "Dijkstra requires edge weights to be…", options: ["Integers", "Non-negative", "Distinct", "Less than V"], answer: 1, explanation: "Negative edges break the greedy argument." },
      { q: "Heap-based Dijkstra runs in…", options: ["O(V + E)", "O((V + E) log V)", "O(VE)", "O(V³)"], answer: 1, explanation: "Each relaxation may push into the heap." },
    ],
  },
];
