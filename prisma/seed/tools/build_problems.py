"""
Builds prisma/seed/data/problems.json.

Every problem has a Python reference solution; expected outputs for all sample and
hidden test cases are COMPUTED by running that solution, so test data is always correct.
Run:  python3 prisma/seed/tools/build_problems.py
"""
import heapq
import io
import json
import os
import random
import sys
from bisect import bisect_left
from collections import Counter, deque

random.seed(2026)
PROBLEMS = []


def problem(**kw):
    def deco(fn):
        kw["solve"] = fn
        PROBLEMS.append(kw)
        return fn
    return deco


def arr(a):
    return " ".join(map(str, a))


# ───────────────────────── 1. Two Sum ─────────────────────────
def gen_two_sum(n):
    a = random.sample(range(-1000, 1000), n)
    i, j = sorted(random.sample(range(n), 2))
    return f"{n}\n{arr(a)}\n{a[i] + a[j]}"


@problem(
    slug="two-sum", title="Two Sum", difficulty="EASY", topics=["Array", "Hash Table"], companies=["Amazon", "Google", "Microsoft"],
    statement="Given an array of **distinct** integers `nums` and an integer `target`, return the indices `i < j` of the two numbers such that they add up to `target`.\n\nExactly one valid answer exists.",
    input_format="Line 1: `n`\nLine 2: `n` space-separated integers\nLine 3: `target`",
    output_format="Two space-separated indices `i j` (0-based, `i < j`).",
    constraints="- 2 ≤ n ≤ 10^4\n- -10^9 ≤ nums[i], target ≤ 10^9\n- Exactly one answer exists",
    hints=["A brute force O(n²) solution checks every pair. Can you do better?", "For each number x, the partner you need is target − x.", "Store numbers you've seen in a hash map from value → index."],
    editorial="Scan left to right keeping a hash map `seen[value] = index`. For each `x` at index `j`, if `target - x` is in the map we found `i`. **Time** O(n), **Space** O(n).",
    samples=[("4\n2 7 11 15\n9", "0 1 is correct because nums[0] + nums[1] = 2 + 7 = 9."), ("3\n3 2 4\n6", "nums[1] + nums[2] = 6.")],
    hidden=[gen_two_sum(n) for n in (5, 10, 50, 200, 1000)],
)
def two_sum(inp):
    lines = inp.split("\n")
    a = list(map(int, lines[1].split()))
    t = int(lines[2])
    seen = {}
    for j, x in enumerate(a):
        if t - x in seen:
            return f"{seen[t - x]} {j}"
        seen[x] = j


# ───────────────────────── 2. Reverse Words ─────────────────────────
WORDS = "the quick brown fox jumps over lazy dog code verse learn practice compete graph tree heap stack queue".split()


@problem(
    slug="reverse-words-in-a-string", title="Reverse Words in a String", difficulty="EASY", topics=["String", "Two Pointers"], companies=["Microsoft", "Adobe"],
    statement="Given a sentence `s`, reverse the order of the **words**. A word is a maximal sequence of non-space characters. The output must contain words separated by a single space with no leading or trailing spaces.",
    input_format="A single line containing `s`.",
    output_format="The words of `s` in reverse order, joined by single spaces.",
    constraints="- 1 ≤ |s| ≤ 10^4\n- `s` contains English letters, digits and spaces\n- There is at least one word",
    hints=["Split the string on whitespace — most languages collapse repeated spaces for you.", "Reverse the list of words and join with a single space."],
    editorial="Split on whitespace, reverse, join. In-place variant: reverse the whole string, then reverse each word. **Time** O(n).",
    samples=[("the sky is blue", "Words reversed: blue is sky the."), ("  hello   world  ", "Extra spaces are removed.")],
    hidden=["a", "codeverse", "  one two  three   "] + [" ".join(random.choice(WORDS) for _ in range(k)) for k in (8, 40)],
)
def reverse_words(inp):
    return " ".join(inp.split()[::-1])


# ───────────────────────── 3. Valid Parentheses ─────────────────────────
def gen_brackets(n, valid):
    pairs = {"(": ")", "[": "]", "{": "}"}
    s, st = [], []
    for _ in range(n):
        if st and random.random() < 0.5:
            s.append(pairs[st.pop()])
        else:
            o = random.choice("([{")
            st.append(o)
            s.append(o)
    while st:
        s.append(pairs[st.pop()])
    if not valid:
        i = random.randrange(len(s))
        s[i] = random.choice(")]}([{".replace(s[i], ""))
    return "".join(s)


@problem(
    slug="valid-parentheses", title="Valid Parentheses", difficulty="EASY", topics=["Stack", "String"], companies=["Amazon", "Meta", "Flipkart"],
    statement="Given a string `s` containing just the characters `()[]{}`, determine if the input string is **valid**.\n\nA string is valid if every opening bracket is closed by the same type of bracket and in the correct order.",
    input_format="A single line containing `s`.",
    output_format="`true` if `s` is valid, otherwise `false`.",
    constraints="- 1 ≤ |s| ≤ 10^4",
    hints=["The most recent unmatched opening bracket must be closed first — which data structure gives you 'most recent'?", "Push opening brackets on a stack; on a closing bracket, the top must match."],
    editorial="Use a stack. Push every opener; for a closer, pop and compare. The string is valid iff every comparison matches and the stack ends empty. **Time** O(n).",
    samples=[("()[]{}", "Every bracket closes in order."), ("(]", "`(` is closed by `]` — invalid.")],
    hidden=["{[]}", "((", "]"] + [gen_brackets(30, True), gen_brackets(40, False), gen_brackets(500, True)],
)
def valid_parens(inp):
    st, pairs = [], {")": "(", "]": "[", "}": "{"}
    for c in inp.strip():
        if c in "([{":
            st.append(c)
        elif not st or st.pop() != pairs[c]:
            return "false"
    return "true" if not st else "false"


# ───────────────────────── 4. Maximum Subarray ─────────────────────────
@problem(
    slug="maximum-subarray", title="Maximum Subarray", difficulty="MEDIUM", topics=["Array", "Dynamic Programming", "Kadane"], companies=["Amazon", "Microsoft", "Goldman Sachs"],
    statement="Given an integer array `nums`, find the contiguous subarray (containing at least one number) with the largest sum and print that sum.",
    input_format="Line 1: `n`\nLine 2: `n` integers",
    output_format="A single integer — the maximum subarray sum.",
    constraints="- 1 ≤ n ≤ 10^5\n- -10^4 ≤ nums[i] ≤ 10^4",
    hints=["If the running sum becomes negative, would it ever help to keep it?", "Kadane's algorithm: best ending here = max(x, best ending at previous + x)."],
    editorial="**Kadane's algorithm**: keep `cur = max(x, cur + x)` and `best = max(best, cur)`. A negative prefix can never help a later subarray. **Time** O(n), **Space** O(1).",
    samples=[("9\n-2 1 -3 4 -1 2 1 -5 4", "The subarray [4, -1, 2, 1] has the largest sum 6."), ("1\n-7", "A single element must be chosen.")],
    hidden=[f"{n}\n{arr([random.randint(-100, 100) for _ in range(n)])}" for n in (5, 20, 100, 1000)] + ["4\n-3 -1 -2 -4"],
)
def max_subarray(inp):
    a = list(map(int, inp.split("\n")[1].split()))
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return str(best)


# ───────────────────────── 5. Binary Search ─────────────────────────
def gen_bs(n, present):
    a = sorted(random.sample(range(-5000, 5000), n))
    t = random.choice(a) if present else random.choice([x for x in range(-5000, 5000) if x not in set(a)][:50])
    return f"{n}\n{arr(a)}\n{t}"


@problem(
    slug="binary-search", title="Binary Search", difficulty="EASY", topics=["Array", "Binary Search"], companies=["Google", "TCS", "Infosys"],
    statement="Given a sorted (ascending) array of distinct integers `nums` and a `target`, print the index of `target` or `-1` if it is not present. Your algorithm must run in **O(log n)**.",
    input_format="Line 1: `n`\nLine 2: `n` sorted integers\nLine 3: `target`",
    output_format="Index of `target` (0-based) or `-1`.",
    constraints="- 1 ≤ n ≤ 10^5\n- All values are distinct",
    hints=["Compare target with the middle element and discard half of the array.", "Use `mid = lo + (hi - lo) / 2` to avoid overflow."],
    editorial="Maintain `[lo, hi]`. If `nums[mid] == target` return mid; if smaller move `lo = mid + 1`, else `hi = mid - 1`. **Time** O(log n).",
    samples=[("6\n-1 0 3 5 9 12\n9", "9 is at index 4."), ("6\n-1 0 3 5 9 12\n2", "2 does not exist.")],
    hidden=[gen_bs(1, True), gen_bs(10, True), gen_bs(10, False), gen_bs(500, True), gen_bs(2000, False)],
)
def binary_search(inp):
    lines = inp.split("\n")
    a = list(map(int, lines[1].split()))
    t = int(lines[2])
    i = bisect_left(a, t)
    return str(i if i < len(a) and a[i] == t else -1)


# ───────────────────────── 6. Merge Intervals ─────────────────────────
def gen_intervals(n):
    out = []
    for _ in range(n):
        s = random.randint(0, 200)
        out.append(f"{s} {s + random.randint(0, 20)}")
    return f"{n}\n" + "\n".join(out)


@problem(
    slug="merge-intervals", title="Merge Intervals", difficulty="MEDIUM", topics=["Array", "Sorting"], companies=["Google", "Meta", "Uber"],
    statement="Given `n` intervals `[start, end]`, merge all overlapping intervals and print the resulting non-overlapping intervals sorted by start. Intervals that touch (e.g. `[1,4]` and `[4,5]`) are considered overlapping.",
    input_format="Line 1: `n`\nNext `n` lines: `start end`",
    output_format="Each merged interval on its own line as `start end`.",
    constraints="- 1 ≤ n ≤ 10^4\n- 0 ≤ start ≤ end ≤ 10^4",
    hints=["Sort by start time first.", "Walk through the sorted list and extend the last merged interval while the next one starts before it ends."],
    editorial="Sort by start. For each interval, if it starts ≤ the end of the last merged one, extend `end = max(end, e)`; otherwise push a new interval. **Time** O(n log n).",
    samples=[("4\n1 3\n2 6\n8 10\n15 18", "[1,3] and [2,6] overlap → [1,6]."), ("2\n1 4\n4 5", "Touching intervals merge into [1,5].")],
    hidden=["1\n5 5", "3\n1 10\n2 3\n4 5"] + [gen_intervals(n) for n in (10, 50, 300)],
)
def merge_intervals(inp):
    lines = inp.split("\n")
    iv = sorted(tuple(map(int, l.split())) for l in lines[1:] if l.strip())
    out = []
    for s, e in iv:
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return "\n".join(f"{s} {e}" for s, e in out)


# ───────────────────────── 7. Climbing Stairs ─────────────────────────
@problem(
    slug="climbing-stairs", title="Climbing Stairs", difficulty="EASY", topics=["Dynamic Programming", "Math"], companies=["Amazon", "Adobe"],
    statement="You are climbing a staircase with `n` steps. Each time you can climb **1 or 2** steps. In how many distinct ways can you reach the top?",
    input_format="A single integer `n`.",
    output_format="The number of distinct ways.",
    constraints="- 1 ≤ n ≤ 45",
    hints=["To stand on step n you arrived from step n−1 or step n−2.", "ways(n) = ways(n−1) + ways(n−2) — looks familiar?"],
    editorial="This is the Fibonacci recurrence. Iterate with two variables. **Time** O(n), **Space** O(1).",
    samples=[("2", "1+1 or 2."), ("3", "1+1+1, 1+2, 2+1.")],
    hidden=["1", "5", "10", "30", "45"],
)
def climb(inp):
    n = int(inp)
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return str(a)


# ───────────────────────── 8. Longest Substring w/o Repeat ─────────────────────────
@problem(
    slug="longest-substring-without-repeating-characters", title="Longest Substring Without Repeating Characters", difficulty="MEDIUM",
    topics=["String", "Sliding Window", "Hash Table"], companies=["Amazon", "Bloomberg", "Adobe"],
    statement="Given a string `s`, find the length of the longest substring without repeating characters.",
    input_format="A single line `s` (lowercase letters and digits).",
    output_format="An integer — the maximum length.",
    constraints="- 1 ≤ |s| ≤ 5·10^4",
    hints=["Use a sliding window [l, r] that always contains unique characters.", "Store the last index of each character to jump `l` forward in O(1)."],
    editorial="Keep `last[c]`. When `s[r]` was seen inside the window, move `l = last[c] + 1`. Answer is the max window size. **Time** O(n).",
    samples=[("abcabcbb", "'abc' has length 3."), ("bbbbb", "'b' has length 1.")],
    hidden=["a", "pwwkew", "dvdf", "".join(random.choice("abcdefghij") for _ in range(200)), "".join(random.choice("abcdefghijklmnopqrstuvwxyz0123456789") for _ in range(3000))],
)
def longest_unique(inp):
    s = inp.strip()
    last, l, best = {}, 0, 0
    for r, c in enumerate(s):
        if c in last and last[c] >= l:
            l = last[c] + 1
        last[c] = r
        best = max(best, r - l + 1)
    return str(best)


# ───────────────────────── 9. Number of Islands ─────────────────────────
def gen_grid(r, c, p=0.45):
    return f"{r} {c}\n" + "\n".join("".join("1" if random.random() < p else "0" for _ in range(c)) for _ in range(r))


@problem(
    slug="number-of-islands", title="Number of Islands", difficulty="MEDIUM", topics=["Graph", "BFS", "DFS", "Matrix"], companies=["Amazon", "Microsoft", "Swiggy"],
    statement="Given an `r × c` grid of `1` (land) and `0` (water), count the number of islands. An island is formed by connecting adjacent land cells **horizontally or vertically**.",
    input_format="Line 1: `r c`\nNext `r` lines: a string of `c` characters, each `0` or `1`.",
    output_format="The number of islands.",
    constraints="- 1 ≤ r, c ≤ 300",
    hints=["Every time you find an unvisited land cell, you found a new island.", "Flood-fill (BFS/DFS) from it to mark the whole island visited."],
    editorial="Iterate over cells; on unvisited `1`, increment the count and BFS to sink all connected land. **Time** O(r·c).",
    samples=[("4 5\n11110\n11010\n11000\n00000", "All land is connected — 1 island."), ("4 5\n11000\n11000\n00100\n00011", "Three separate islands.")],
    hidden=["1 1\n0", "1 1\n1", gen_grid(5, 5), gen_grid(20, 30), gen_grid(100, 100, 0.5)],
)
def islands(inp):
    lines = inp.split("\n")
    r, c = map(int, lines[0].split())
    g = [list(lines[i + 1].strip()) for i in range(r)]
    cnt = 0
    for i in range(r):
        for j in range(c):
            if g[i][j] == "1":
                cnt += 1
                g[i][j] = "0"
                q = deque([(i, j)])
                while q:
                    x, y = q.popleft()
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < r and 0 <= ny < c and g[nx][ny] == "1":
                            g[nx][ny] = "0"
                            q.append((nx, ny))
    return str(cnt)


# ───────────────────────── 10. Coin Change ─────────────────────────
@problem(
    slug="coin-change", title="Coin Change", difficulty="MEDIUM", topics=["Dynamic Programming", "BFS"], companies=["Amazon", "Paytm", "PhonePe"],
    statement="Given coin denominations and an `amount`, print the **fewest** number of coins needed to make that amount, or `-1` if it cannot be made. You have an infinite supply of each coin.",
    input_format="Line 1: `n amount`\nLine 2: `n` coin values",
    output_format="Minimum number of coins, or `-1`.",
    constraints="- 1 ≤ n ≤ 12\n- 1 ≤ coins[i] ≤ 10^4\n- 0 ≤ amount ≤ 10^4",
    hints=["Greedy (always take the biggest coin) fails for coins like [1, 3, 4] and amount 6.", "dp[x] = 1 + min(dp[x − coin]) over all coins."],
    editorial="Bottom-up DP: `dp[0] = 0`, `dp[x] = min(dp[x-c] + 1)`. Answer `dp[amount]` or -1 if unreachable. **Time** O(n·amount).",
    samples=[("3 11\n1 2 5", "11 = 5 + 5 + 1."), ("1 3\n2", "3 cannot be formed with 2s.")],
    hidden=["1 0\n1", "3 6\n1 3 4", "2 7\n2 4", "4 2345\n3 7 405 436", "5 9999\n1 5 10 25 50"],
)
def coin_change(inp):
    lines = inp.split("\n")
    n, amt = map(int, lines[0].split())
    coins = list(map(int, lines[1].split()))
    INF = 10**9
    dp = [0] + [INF] * amt
    for x in range(1, amt + 1):
        for c in coins:
            if c <= x and dp[x - c] + 1 < dp[x]:
                dp[x] = dp[x - c] + 1
    return str(dp[amt] if dp[amt] < INF else -1)


# ───────────────────────── 11. LIS ─────────────────────────
@problem(
    slug="longest-increasing-subsequence", title="Longest Increasing Subsequence", difficulty="MEDIUM", topics=["Dynamic Programming", "Binary Search"], companies=["Google", "Microsoft"],
    statement="Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence.",
    input_format="Line 1: `n`\nLine 2: `n` integers",
    output_format="Length of the LIS.",
    constraints="- 1 ≤ n ≤ 2500\n- -10^4 ≤ nums[i] ≤ 10^4",
    hints=["An O(n²) DP: lis[i] = 1 + max(lis[j]) for j < i with nums[j] < nums[i].", "For O(n log n), keep `tails[k]` = smallest tail of an increasing subsequence of length k+1."],
    editorial="Patience sorting: for each x, binary-search the first tail ≥ x and replace it (or append). The number of tails is the LIS length. **Time** O(n log n).",
    samples=[("8\n10 9 2 5 3 7 101 18", "[2, 3, 7, 101] has length 4."), ("6\n0 1 0 3 2 3", "[0, 1, 2, 3].")],
    hidden=["1\n5", "5\n5 4 3 2 1", "7\n7 7 7 7 7 7 7"] + [f"{n}\n{arr([random.randint(-1000, 1000) for _ in range(n)])}" for n in (50, 2000)],
)
def lis(inp):
    a = list(map(int, inp.split("\n")[1].split()))
    tails = []
    for x in a:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return str(len(tails))


# ───────────────────────── 12. Kth Largest ─────────────────────────
def gen_kth(n):
    a = [random.randint(-10000, 10000) for _ in range(n)]
    return f"{n} {random.randint(1, n)}\n{arr(a)}"


@problem(
    slug="kth-largest-element-in-an-array", title="Kth Largest Element in an Array", difficulty="MEDIUM", topics=["Heap", "Sorting", "Quickselect"], companies=["Meta", "Amazon", "Walmart"],
    statement="Given an integer array `nums` and an integer `k`, print the `k`-th largest element (in sorted order, not the k-th distinct).",
    input_format="Line 1: `n k`\nLine 2: `n` integers",
    output_format="The k-th largest element.",
    constraints="- 1 ≤ k ≤ n ≤ 10^5",
    hints=["Sorting works in O(n log n). Can you avoid sorting everything?", "Keep a min-heap of size k — its top is the answer."],
    editorial="Maintain a min-heap with the k largest seen elements; pop when size exceeds k. **Time** O(n log k). Quickselect gives expected O(n).",
    samples=[("6 2\n3 2 1 5 6 4", "Sorted descending: 6, 5, … → 5."), ("9 4\n3 2 3 1 2 4 5 5 6", "6,5,5,4 → 4.")],
    hidden=["1 1\n-3"] + [gen_kth(n) for n in (10, 100, 1000, 5000)],
)
def kth_largest(inp):
    lines = inp.split("\n")
    n, k = map(int, lines[0].split())
    return str(heapq.nlargest(k, map(int, lines[1].split()))[-1])


# ───────────────────────── 13. Palindrome Number ─────────────────────────
@problem(
    slug="palindrome-number", title="Palindrome Number", difficulty="EASY", topics=["Math"], companies=["TCS", "Wipro", "Accenture"],
    statement="Given an integer `x`, print `true` if `x` reads the same backward as forward, otherwise `false`. Negative numbers are not palindromes.",
    input_format="A single integer `x`.",
    output_format="`true` or `false`.",
    constraints="- -2^31 ≤ x ≤ 2^31 − 1",
    hints=["Negative numbers can be rejected immediately.", "Reverse only half of the digits to avoid overflow."],
    editorial="Reject negatives and numbers ending in 0 (except 0). Build the reversed second half until it is ≥ the remaining first half, then compare. **Time** O(log x).",
    samples=[("121", "121 reversed is 121."), ("-121", "Reads 121- backwards.")],
    hidden=["0", "10", "12321", "1234567899", "2147447412"],
)
def palindrome_number(inp):
    s = inp.strip()
    return "true" if not s.startswith("-") and s == s[::-1] else "false"


# ───────────────────────── 14. FizzBuzz ─────────────────────────
@problem(
    slug="fizz-buzz", title="Fizz Buzz", difficulty="EASY", topics=["Math", "Simulation"], companies=["Infosys", "Cognizant"],
    statement="Print numbers from `1` to `n`, one per line. For multiples of 3 print `Fizz`, for multiples of 5 print `Buzz`, and for multiples of both print `FizzBuzz`.",
    input_format="A single integer `n`.",
    output_format="`n` lines as described.",
    constraints="- 1 ≤ n ≤ 10^4",
    hints=["Check divisibility by 15 first."],
    editorial="Loop from 1 to n and test `i % 15`, `i % 3`, `i % 5` in that order. **Time** O(n).",
    samples=[("5", "3 → Fizz, 5 → Buzz."), ("15", "15 → FizzBuzz.")],
    hidden=["1", "3", "30", "100"],
)
def fizzbuzz(inp):
    n = int(inp)
    return "\n".join("FizzBuzz" if i % 15 == 0 else "Fizz" if i % 3 == 0 else "Buzz" if i % 5 == 0 else str(i) for i in range(1, n + 1))


# ───────────────────────── 15. Majority Element ─────────────────────────
def gen_majority(n):
    m = random.randint(-50, 50)
    a = [m] * (n // 2 + 1) + [random.randint(-50, 50) for _ in range(n - n // 2 - 1)]
    random.shuffle(a)
    return f"{n}\n{arr(a)}"


@problem(
    slug="majority-element", title="Majority Element", difficulty="EASY", topics=["Array", "Boyer-Moore"], companies=["Amazon", "Zoho"],
    statement="Given an array `nums` of size `n`, print the majority element — the element that appears **more than ⌊n/2⌋** times. It is guaranteed to exist.",
    input_format="Line 1: `n`\nLine 2: `n` integers",
    output_format="The majority element.",
    constraints="- 1 ≤ n ≤ 5·10^4",
    hints=["A hash map of counts works in O(n) space.", "Boyer–Moore voting finds it in O(1) space: pair off different elements."],
    editorial="**Boyer–Moore voting**: keep a candidate and a counter; increment on match, decrement otherwise, replace candidate when counter hits 0. **Time** O(n), **Space** O(1).",
    samples=[("3\n3 2 3", "3 appears twice."), ("7\n2 2 1 1 1 2 2", "2 appears four times.")],
    hidden=["1\n9"] + [gen_majority(n) for n in (5, 51, 999, 5000)],
)
def majority(inp):
    a = list(map(int, inp.split("\n")[1].split()))
    return str(Counter(a).most_common(1)[0][0])


# ───────────────────────── 16. Move Zeroes ─────────────────────────
@problem(
    slug="move-zeroes", title="Move Zeroes", difficulty="EASY", topics=["Array", "Two Pointers"], companies=["Meta", "Microsoft"],
    statement="Given an integer array `nums`, move all `0`s to the end while keeping the relative order of the non-zero elements. Print the resulting array.",
    input_format="Line 1: `n`\nLine 2: `n` integers",
    output_format="The modified array, space-separated.",
    constraints="- 1 ≤ n ≤ 10^4",
    hints=["Use a write pointer for the next non-zero position."],
    editorial="Two pointers: copy each non-zero to `nums[w++]`, then fill the rest with zeros. **Time** O(n), **Space** O(1).",
    samples=[("5\n0 1 0 3 12", "Non-zeros 1 3 12 keep their order."), ("1\n0", "Nothing to move.")],
    hidden=["3\n1 2 3", "4\n0 0 0 1"] + [f"{n}\n{arr([random.choice([0, 0, random.randint(-9, 9)]) for _ in range(n)])}" for n in (20, 500)],
)
def move_zeroes(inp):
    a = list(map(int, inp.split("\n")[1].split()))
    nz = [x for x in a if x != 0]
    return arr(nz + [0] * (len(a) - len(nz)))


# ───────────────────────── 17. Product Except Self ─────────────────────────
@problem(
    slug="product-of-array-except-self", title="Product of Array Except Self", difficulty="MEDIUM", topics=["Array", "Prefix Sum"], companies=["Amazon", "Apple", "Meta"],
    statement="Given an integer array `nums`, print an array `answer` where `answer[i]` is the product of all elements of `nums` except `nums[i]`. Solve it **without division** in O(n).",
    input_format="Line 1: `n`\nLine 2: `n` integers",
    output_format="`n` space-separated integers.",
    constraints="- 2 ≤ n ≤ 10^5\n- -30 ≤ nums[i] ≤ 30\n- Every prefix/suffix product fits in a 64-bit integer",
    hints=["answer[i] = (product of everything left of i) × (product of everything right of i).", "Compute prefix products in one pass and suffix products in a second pass."],
    editorial="Fill `ans[i]` with the prefix product, then sweep from the right multiplying by a running suffix product. **Time** O(n), **Space** O(1) extra.",
    samples=[("4\n1 2 3 4", "24 12 8 6."), ("5\n-1 1 0 -3 3", "Only index 2 excludes the zero.")],
    hidden=["2\n5 7", "3\n0 0 2"] + [f"{n}\n{arr([random.randint(-3, 3) or 1 for _ in range(n)])}" for n in (10, 30)],
)
def product_except_self(inp):
    a = list(map(int, inp.split("\n")[1].split()))
    n = len(a)
    ans = [1] * n
    p = 1
    for i in range(n):
        ans[i] = p
        p *= a[i]
    s = 1
    for i in range(n - 1, -1, -1):
        ans[i] *= s
        s *= a[i]
    return arr(ans)


# ───────────────────────── 18. Trapping Rain Water ─────────────────────────
@problem(
    slug="trapping-rain-water", title="Trapping Rain Water", difficulty="HARD", topics=["Array", "Two Pointers", "Stack"], companies=["Google", "Amazon", "Goldman Sachs"],
    statement="Given `n` non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.",
    input_format="Line 1: `n`\nLine 2: `n` heights",
    output_format="Total units of trapped water.",
    constraints="- 1 ≤ n ≤ 2·10^4\n- 0 ≤ height[i] ≤ 10^5",
    hints=["Water above bar i = min(maxLeft, maxRight) − height[i].", "Two pointers: always move the side with the smaller max — it bounds the water."],
    editorial="Keep `l, r, leftMax, rightMax`. If `leftMax < rightMax`, water at `l` is `leftMax - h[l]`; move `l`. Otherwise do the same on the right. **Time** O(n), **Space** O(1).",
    samples=[("12\n0 1 0 2 1 0 1 3 2 1 2 1", "6 units are trapped."), ("6\n4 2 0 3 2 5", "9 units.")],
    hidden=["1\n5", "3\n2 0 2", "5\n5 4 3 2 1"] + [f"{n}\n{arr([random.randint(0, 50) for _ in range(n)])}" for n in (100, 5000)],
)
def trap(inp):
    h = list(map(int, inp.split("\n")[1].split()))
    l, r, lm, rm, w = 0, len(h) - 1, 0, 0, 0
    while l < r:
        if h[l] < h[r]:
            lm = max(lm, h[l]); w += lm - h[l]; l += 1
        else:
            rm = max(rm, h[r]); w += rm - h[r]; r -= 1
    return str(w)


# ───────────────────────── 19. Median of Two Sorted ─────────────────────────
def gen_median(n, m):
    return f"{n} {m}\n{arr(sorted(random.randint(-1000, 1000) for _ in range(n)))}\n{arr(sorted(random.randint(-1000, 1000) for _ in range(m)))}"


@problem(
    slug="median-of-two-sorted-arrays", title="Median of Two Sorted Arrays", difficulty="HARD", topics=["Array", "Binary Search", "Divide and Conquer"], companies=["Google", "Microsoft", "Uber"],
    statement="Given two sorted arrays `A` (size n) and `B` (size m), print the median of the combined array with exactly **one digit after the decimal point**. Aim for O(log(min(n, m))).",
    input_format="Line 1: `n m`\nLine 2: `n` sorted integers\nLine 3: `m` sorted integers",
    output_format="The median formatted with one decimal place (e.g. `2.5`).",
    constraints="- 1 ≤ n, m ≤ 1000\n- -10^6 ≤ A[i], B[i] ≤ 10^6",
    hints=["Merging is O(n + m) — acceptable here, but can you binary-search a partition?", "Partition both arrays so that the left halves together hold (n+m+1)/2 elements and maxLeft ≤ minRight."],
    editorial="Binary search on the cut in the smaller array; the cut in the other is determined. When `A[i-1] ≤ B[j]` and `B[j-1] ≤ A[i]` the median comes from the four boundary values. **Time** O(log min(n, m)).",
    samples=[("2 1\n1 3\n2", "Merged [1,2,3] → 2.0."), ("2 2\n1 2\n3 4", "Merged [1,2,3,4] → (2+3)/2 = 2.5.")],
    hidden=["1 1\n5\n6", gen_median(3, 4), gen_median(10, 10), gen_median(1, 99), gen_median(500, 700)],
)
def median_two(inp):
    lines = inp.split("\n")
    a = sorted(list(map(int, lines[1].split())) + list(map(int, lines[2].split())))
    n = len(a)
    med = a[n // 2] if n % 2 else (a[n // 2 - 1] + a[n // 2]) / 2
    return f"{med:.1f}"


# ───────────────────────── 20. Edit Distance ─────────────────────────
def rword(k):
    return "".join(random.choice("abcde") for _ in range(k))


@problem(
    slug="edit-distance", title="Edit Distance", difficulty="HARD", topics=["Dynamic Programming", "String"], companies=["Google", "Amazon"],
    statement="Given two strings `word1` and `word2`, print the minimum number of operations (insert, delete, replace a character) required to convert `word1` into `word2`.",
    input_format="Line 1: `word1`\nLine 2: `word2`\n(Either may be empty — an empty line.)",
    output_format="The edit distance.",
    constraints="- 0 ≤ |word1|, |word2| ≤ 500\n- Lowercase English letters",
    hints=["Let dp[i][j] be the distance between the first i chars of word1 and first j chars of word2.", "If the characters match, dp[i][j] = dp[i-1][j-1]; otherwise 1 + min(insert, delete, replace)."],
    editorial="Classic Levenshtein DP with an (n+1)×(m+1) table; roll it to two rows for O(m) space. **Time** O(n·m).",
    samples=[("horse\nros", "horse → rorse → rose → ros."), ("intention\nexecution", "5 operations.")],
    hidden=["abc\nabc", "\nabc", "kitten\nsitting", f"{rword(40)}\n{rword(35)}", f"{rword(300)}\n{rword(280)}"],
)
def edit_distance(inp):
    parts = inp.split("\n")
    a, b = parts[0].strip(), (parts[1].strip() if len(parts) > 1 else "")
    prev = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        cur = [i] + [0] * len(b)
        for j in range(1, len(b) + 1):
            cur[j] = prev[j - 1] if a[i - 1] == b[j - 1] else 1 + min(prev[j - 1], prev[j], cur[j - 1])
        prev = cur
    return str(prev[len(b)])


# ───────────────────────── 21. Dijkstra ─────────────────────────
def gen_graph(n, m, wmax=50, directed=False):
    edges = set()
    for v in range(1, n):
        u = random.randrange(v)
        edges.add((u, v))
    while len(edges) < m:
        u, v = random.sample(range(n), 2)
        edges.add((min(u, v), max(u, v)) if not directed else (u, v))
    return [(u, v, random.randint(1, wmax)) for u, v in edges]


def gen_dijkstra(n, m):
    e = gen_graph(n, m)
    return f"{n} {len(e)} 0\n" + "\n".join(f"{u} {v} {w}" for u, v, w in e)


@problem(
    slug="shortest-path-dijkstra", title="Shortest Path from Source (Dijkstra)", difficulty="MEDIUM", topics=["Graph", "Shortest Path", "Heap"], companies=["Uber", "Ola", "Google"],
    statement="Given an **undirected** weighted graph with `n` vertices (0…n−1) and `m` edges with positive weights, print the shortest distance from source `s` to every vertex. Print `-1` for unreachable vertices.",
    input_format="Line 1: `n m s`\nNext `m` lines: `u v w`",
    output_format="`n` space-separated distances.",
    constraints="- 1 ≤ n ≤ 10^4\n- 0 ≤ m ≤ 5·10^4\n- 1 ≤ w ≤ 10^4",
    hints=["BFS works only when all weights are equal.", "Use a min-priority queue keyed by tentative distance; skip stale entries."],
    editorial="**Dijkstra** with a binary heap: pop the closest vertex, relax its edges. With lazy deletion the complexity is O((n + m) log n).",
    samples=[("5 6 0\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3", "0→2→1→3→4 gives 7 to vertex 4."), ("3 1 0\n0 1 5", "Vertex 2 is unreachable.")],
    hidden=["1 0 0", gen_dijkstra(10, 15), gen_dijkstra(100, 300), gen_dijkstra(1000, 4000)],
)
def dijkstra(inp):
    lines = inp.split("\n")
    n, m, s = map(int, lines[0].split())
    g = [[] for _ in range(n)]
    for i in range(m):
        u, v, w = map(int, lines[1 + i].split())
        g[u].append((v, w)); g[v].append((u, w))
    INF = float("inf")
    d = [INF] * n
    d[s] = 0
    pq = [(0, s)]
    while pq:
        du, u = heapq.heappop(pq)
        if du > d[u]:
            continue
        for v, w in g[u]:
            if du + w < d[v]:
                d[v] = du + w
                heapq.heappush(pq, (d[v], v))
    return arr([x if x < INF else -1 for x in d])


# ───────────────────────── 22. Detect Cycle Directed ─────────────────────────
def gen_dag(n, m, cyclic):
    order = list(range(n)); random.shuffle(order)
    pos = {v: i for i, v in enumerate(order)}
    edges = set()
    while len(edges) < m:
        u, v = random.sample(range(n), 2)
        if pos[u] > pos[v]:
            u, v = v, u
        edges.add((u, v))
    edges = list(edges)
    if cyclic:
        u, v = edges[0]
        edges.append((v, u))
    return f"{n} {len(edges)}\n" + "\n".join(f"{u} {v}" for u, v in edges)


@problem(
    slug="detect-cycle-in-directed-graph", title="Detect Cycle in a Directed Graph", difficulty="MEDIUM", topics=["Graph", "DFS", "Topological Sort"], companies=["Microsoft", "Flipkart"],
    statement="Given a directed graph with `n` vertices and `m` edges, print `true` if it contains a cycle, otherwise `false`.",
    input_format="Line 1: `n m`\nNext `m` lines: `u v` (edge u → v)",
    output_format="`true` or `false`.",
    constraints="- 1 ≤ n ≤ 10^5\n- 0 ≤ m ≤ 2·10^5",
    hints=["In DFS, a back edge to a vertex currently on the recursion stack means a cycle.", "Alternatively, Kahn's algorithm: if topological sort can't include all vertices, there's a cycle."],
    editorial="**Kahn's algorithm**: repeatedly remove vertices with in-degree 0. If fewer than n vertices are removed, a cycle exists. **Time** O(n + m).",
    samples=[("4 4\n0 1\n1 2\n2 3\n3 1", "1 → 2 → 3 → 1 is a cycle."), ("3 2\n0 1\n1 2", "A simple chain.")],
    hidden=["1 0", "2 2\n0 1\n1 0", gen_dag(10, 15, False), gen_dag(50, 120, True), gen_dag(1000, 3000, False)],
)
def detect_cycle(inp):
    lines = inp.split("\n")
    n, m = map(int, lines[0].split())
    g = [[] for _ in range(n)]
    indeg = [0] * n
    for i in range(m):
        u, v = map(int, lines[1 + i].split())
        g[u].append(v); indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    seen = 0
    while q:
        u = q.popleft(); seen += 1
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return "true" if seen < n else "false"


# ───────────────────────── 23. N-Queens ─────────────────────────
@problem(
    slug="n-queens-count", title="N-Queens: Count Solutions", difficulty="HARD", topics=["Backtracking", "Bit Manipulation"], companies=["Google", "Directi"],
    statement="Place `n` queens on an `n × n` chessboard so that no two queens attack each other. Print the number of distinct solutions.",
    input_format="A single integer `n`.",
    output_format="Number of solutions.",
    constraints="- 1 ≤ n ≤ 11",
    hints=["Place one queen per row; backtrack when no column is safe.", "Track used columns and both diagonals (r+c and r−c) in sets or bitmasks."],
    editorial="Backtracking with three bitmasks (columns, `/` diagonals, `\\` diagonals). Available positions = `~(cols | d1 | d2) & full`. **Time** roughly O(n!).",
    samples=[("4", "There are two ways to place 4 queens."), ("1", "Trivial.")],
    hidden=["2", "3", "6", "8", "10"],
)
def nqueens(inp):
    n = int(inp)
    full = (1 << n) - 1

    def go(cols, d1, d2):
        if cols == full:
            return 1
        cnt, avail = 0, full & ~(cols | d1 | d2)
        while avail:
            bit = avail & -avail
            avail -= bit
            cnt += go(cols | bit, ((d1 | bit) << 1) & full, (d2 | bit) >> 1)
        return cnt
    return str(go(0, 0, 0))


# ───────────────────────── 24. LCS ─────────────────────────
@problem(
    slug="longest-common-subsequence", title="Longest Common Subsequence", difficulty="MEDIUM", topics=["Dynamic Programming", "String"], companies=["Amazon", "Morgan Stanley"],
    statement="Given two strings `a` and `b`, print the length of their longest common subsequence. A subsequence keeps relative order but need not be contiguous.",
    input_format="Line 1: `a`\nLine 2: `b`",
    output_format="Length of the LCS.",
    constraints="- 1 ≤ |a|, |b| ≤ 1000",
    hints=["dp[i][j] = LCS of a[:i] and b[:j].", "If a[i-1] == b[j-1] then dp[i][j] = dp[i-1][j-1] + 1, else max(dp[i-1][j], dp[i][j-1])."],
    editorial="2D DP filled row by row; only two rows are needed. **Time** O(|a|·|b|).",
    samples=[("abcde\nace", "'ace' has length 3."), ("abc\ndef", "Nothing in common.")],
    hidden=["a\na", "abc\nabc", f"{rword(50)}\n{rword(60)}", f"{rword(600)}\n{rword(500)}"],
)
def lcs(inp):
    a, b = [x.strip() for x in inp.split("\n")[:2]]
    prev = [0] * (len(b) + 1)
    for i in range(1, len(a) + 1):
        cur = [0] * (len(b) + 1)
        for j in range(1, len(b) + 1):
            cur[j] = prev[j - 1] + 1 if a[i - 1] == b[j - 1] else max(prev[j], cur[j - 1])
        prev = cur
    return str(prev[-1])


# ───────────────────────── 25. Sliding Window Max ─────────────────────────
@problem(
    slug="sliding-window-maximum", title="Sliding Window Maximum", difficulty="HARD", topics=["Deque", "Sliding Window", "Monotonic Queue"], companies=["Amazon", "Google", "Zomato"],
    statement="Given an array `nums` and a window size `k`, print the maximum of every contiguous window of size `k`, from left to right.",
    input_format="Line 1: `n k`\nLine 2: `n` integers",
    output_format="`n − k + 1` space-separated maxima.",
    constraints="- 1 ≤ k ≤ n ≤ 10^5",
    hints=["A heap gives O(n log n). Can you get O(n)?", "Keep a deque of indices whose values are decreasing; the front is the window max."],
    editorial="**Monotonic deque**: pop from the back while the new value is larger; pop the front if it left the window. Each index enters and leaves once. **Time** O(n).",
    samples=[("8 3\n1 3 -1 -3 5 3 6 7", "Windows give 3 3 5 5 6 7."), ("1 1\n1", "Single window.")],
    hidden=["5 5\n1 2 3 4 5", "5 1\n5 4 3 2 1"] + [f"{n} {k}\n{arr([random.randint(-100, 100) for _ in range(n)])}" for n, k in ((20, 4), (1000, 50))],
)
def sliding_max(inp):
    lines = inp.split("\n")
    n, k = map(int, lines[0].split())
    a = list(map(int, lines[1].split()))
    dq, out = deque(), []
    for i, x in enumerate(a):
        while dq and a[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(a[dq[0]])
    return arr(out)


# ───────────────────────── 26. Count Inversions ─────────────────────────
@problem(
    slug="count-inversions", title="Count Inversions", difficulty="HARD", topics=["Divide and Conquer", "Merge Sort", "Fenwick Tree"], companies=["Microsoft", "Adobe", "Samsung"],
    statement="Given an array `a`, count pairs `(i, j)` with `i < j` and `a[i] > a[j]`.",
    input_format="Line 1: `n`\nLine 2: `n` integers",
    output_format="The number of inversions.",
    constraints="- 1 ≤ n ≤ 10^5\n- The answer fits in a 64-bit integer",
    hints=["O(n²) is too slow for n = 10^5.", "While merging two sorted halves, when you take from the right half, every remaining element on the left forms an inversion."],
    editorial="Modified **merge sort**: during merge, taking `right[j]` before `left[i]` adds `len(left) - i` inversions. **Time** O(n log n).",
    samples=[("5\n2 4 1 3 5", "(2,1), (4,1), (4,3) → 3."), ("3\n1 2 3", "Already sorted.")],
    hidden=["1\n7", "5\n5 4 3 2 1"] + [f"{n}\n{arr([random.randint(1, 1000) for _ in range(n)])}" for n in (50, 5000)],
)
def inversions(inp):
    a = list(map(int, inp.split("\n")[1].split()))

    def sort(xs):
        if len(xs) <= 1:
            return xs, 0
        mid = len(xs) // 2
        l, cl = sort(xs[:mid]); r, cr = sort(xs[mid:])
        out, i, j, c = [], 0, 0, cl + cr
        while i < len(l) and j < len(r):
            if l[i] <= r[j]:
                out.append(l[i]); i += 1
            else:
                out.append(r[j]); j += 1; c += len(l) - i
        out += l[i:] + r[j:]
        return out, c
    return str(sort(a)[1])


# ───────────────────────── 27. Valid Anagram ─────────────────────────
def anagram_pair(k, same):
    a = rword(k)
    b = list(a); random.shuffle(b)
    if not same:
        b[0] = "z"
    return f"{a}\n{''.join(b)}"


@problem(
    slug="valid-anagram", title="Valid Anagram", difficulty="EASY", topics=["String", "Hash Table", "Sorting"], companies=["Amazon", "Uber", "Myntra"],
    statement="Given two strings `s` and `t`, print `true` if `t` is an anagram of `s` (same characters with the same counts), otherwise `false`.",
    input_format="Line 1: `s`\nLine 2: `t`",
    output_format="`true` or `false`.",
    constraints="- 1 ≤ |s|, |t| ≤ 5·10^4\n- Lowercase English letters",
    hints=["If the lengths differ, the answer is immediately false.", "Count characters with an array of size 26."],
    editorial="Increment counts for `s` and decrement for `t`; all counts must end at zero. **Time** O(n), **Space** O(1).",
    samples=[("anagram\nnagaram", "Same letters, same counts."), ("rat\ncar", "'t' vs 'c'.")],
    hidden=["a\na", "ab\na", anagram_pair(30, True), anagram_pair(30, False), anagram_pair(5000, True)],
)
def anagram(inp):
    a, b = [x.strip() for x in inp.split("\n")[:2]]
    return "true" if Counter(a) == Counter(b) else "false"


# ───────────────────────── 28. GCD & LCM ─────────────────────────
@problem(
    slug="gcd-and-lcm", title="GCD and LCM", difficulty="EASY", topics=["Math", "Number Theory"], companies=["TCS", "Capgemini"],
    statement="Given two positive integers `a` and `b`, print their greatest common divisor and least common multiple.",
    input_format="A single line `a b`.",
    output_format="`gcd lcm` separated by a space.",
    constraints="- 1 ≤ a, b ≤ 10^9",
    hints=["Euclid: gcd(a, b) = gcd(b, a mod b).", "lcm(a, b) = a / gcd(a, b) × b — divide first to avoid overflow."],
    editorial="Use the **Euclidean algorithm** in O(log min(a, b)) and derive the LCM with `a / g * b` (64-bit).",
    samples=[("12 18", "gcd 6, lcm 36."), ("7 13", "Co-prime numbers.")],
    hidden=["1 1", "1000000000 999999999", "48 180", "17 289", "123456 7890"],
)
def gcd_lcm(inp):
    import math
    a, b = map(int, inp.split())
    g = math.gcd(a, b)
    return f"{g} {a // g * b}"


# ───────────────────────── 29. Level Order ─────────────────────────
def gen_tree(n):
    vals = [str(random.randint(1, 99)) for _ in range(n)]
    for i in range(1, n):
        if random.random() < 0.2:
            vals[i] = "null"
    return f"{n}\n{' '.join(vals)}"


@problem(
    slug="binary-tree-level-order-traversal", title="Binary Tree Level Order Traversal", difficulty="MEDIUM", topics=["Tree", "BFS", "Binary Tree"], companies=["Amazon", "Microsoft", "LinkedIn"],
    statement="A binary tree is given in **LeetCode level-order format** (`null` marks a missing child; children of `null` nodes are not listed). Print the values level by level — one level per line, values separated by spaces.",
    input_format="Line 1: `n` (number of tokens)\nLine 2: `n` tokens (integers or `null`)",
    output_format="One line per level.",
    constraints="- 1 ≤ n ≤ 10^4\n- The first token is never `null`",
    hints=["Build the tree with a queue: each dequeued node takes the next two tokens as children.", "BFS again, processing the queue one level (its current size) at a time."],
    editorial="Construct the tree from tokens using a queue, then BFS in rounds of `len(queue)` nodes. **Time** O(n).",
    samples=[("7\n3 9 20 null null 15 7", "Levels: [3], [9, 20], [15, 7]."), ("1\n1", "A single node.")],
    hidden=["3\n1 null 2", gen_tree(10), gen_tree(40), gen_tree(300)],
)
def level_order(inp):
    toks = inp.split("\n")[1].split()
    root = {"v": toks[0], "l": None, "r": None}
    q, i = deque([root]), 1
    while q and i < len(toks):
        node = q.popleft()
        for side in ("l", "r"):
            if i < len(toks):
                if toks[i] != "null":
                    node[side] = {"v": toks[i], "l": None, "r": None}
                    q.append(node[side])
                i += 1
    out, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            nd = q.popleft(); level.append(nd["v"])
            for side in ("l", "r"):
                if nd[side]:
                    q.append(nd[side])
        out.append(" ".join(level))
    return "\n".join(out)


# ───────────────────────── 30. MST Kruskal ─────────────────────────
def gen_mst(n, m):
    e = gen_graph(n, m, 100)
    return f"{n} {len(e)}\n" + "\n".join(f"{u} {v} {w}" for u, v, w in e)


@problem(
    slug="minimum-spanning-tree", title="Minimum Spanning Tree", difficulty="HARD", topics=["Graph", "Union Find", "Greedy"], companies=["Amazon", "Cisco", "Juspay"],
    statement="Given a **connected** undirected weighted graph with `n` vertices and `m` edges, print the total weight of its minimum spanning tree.",
    input_format="Line 1: `n m`\nNext `m` lines: `u v w` (0-indexed)",
    output_format="The MST weight.",
    constraints="- 1 ≤ n ≤ 10^4\n- n − 1 ≤ m ≤ 10^5\n- 1 ≤ w ≤ 10^6",
    hints=["Greedy works: the lightest edge that doesn't form a cycle is always safe.", "Use a Disjoint Set Union with path compression and union by rank to test cycles quickly."],
    editorial="**Kruskal**: sort edges by weight and add each edge whose endpoints are in different DSU components. **Time** O(m log m).",
    samples=[("4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4", "Edges 2-3 (4), 0-3 (5), 0-1 (10) → 19."), ("2 1\n0 1 7", "Only one edge.")],
    hidden=["1 0", gen_mst(8, 12), gen_mst(100, 400), gen_mst(2000, 8000)],
)
def mst(inp):
    lines = inp.split("\n")
    n, m = map(int, lines[0].split())
    edges = sorted((tuple(map(int, lines[1 + i].split())) for i in range(m)), key=lambda e: e[2])
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    total = 0
    for u, v, w in edges:
        a, b = find(u), find(v)
        if a != b:
            parent[a] = b; total += w
    return str(total)


# ───────────────────────── Export ─────────────────────────
STARTERS = {
    "PYTHON": 'import sys\n\ndef main():\n    data = sys.stdin.read().split("\\n")\n    # {io}\n    # Write your solution here and print the answer\n    pass\n\nif __name__ == "__main__":\n    main()\n',
    "JAVASCRIPT": 'const lines = require("fs").readFileSync(0, "utf8").split("\\n");\n// {io}\n\nfunction solve(lines) {\n  // Write your solution here and return the answer\n  return "";\n}\n\nconsole.log(solve(lines));\n',
    "CPP": '#include <bits/stdc++.h>\nusing namespace std;\n\n// {io}\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // Write your solution here\n    return 0;\n}\n',
    "C": '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n// {io}\nint main(void) {\n    // Write your solution here\n    return 0;\n}\n',
    "JAVA": 'import java.util.*;\nimport java.io.*;\n\n// {io}\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        // Write your solution here\n    }\n}\n',
    "GO": 'package main\n\nimport (\n\t"bufio"\n\t"fmt"\n\t"os"\n)\n\n// {io}\nfunc main() {\n\treader := bufio.NewReader(os.Stdin)\n\t_ = reader\n\t// Write your solution here\n\tfmt.Print("")\n}\n',
}

import inspect


def main():
    out = []
    for idx, p in enumerate(PROBLEMS, start=1):
        fn = p["solve"]
        io_hint = "Input: " + p["input_format"].replace("\n", " | ").replace("`", "")
        starter = {k: v.replace("{io}", io_hint) for k, v in STARTERS.items()}
        samples = [{"input": i, "expected": fn(i), "explanation": e} for i, e in p["samples"]]
        hidden = [{"input": i, "expected": fn(i)} for i in p["hidden"]]
        src = inspect.getsource(fn).split("\n")
        src = src[next(i for i, l in enumerate(src) if l.startswith("def ")):]
        body = "\n".join(src)
        imports = ["import sys"]
        if "heapq" in body:
            imports.append("import heapq")
        if "deque" in body or "Counter" in body:
            imports.append("from collections import deque, Counter")
        if "bisect" in body:
            imports.append("from bisect import bisect_left")
        if "arr(" in body:
            body = "def arr(a):\n    return \" \".join(map(str, a))\n\n\n" + body
        solution = "\n".join(imports) + "\n\n\n" + body.rstrip() + f"\n\n\nprint({fn.__name__}(sys.stdin.read().rstrip(\"\\n\")))\n"
        out.append({
            "number": idx,
            "slug": p["slug"], "title": p["title"], "difficulty": p["difficulty"],
            "topics": p["topics"], "companies": p["companies"],
            "statement": p["statement"], "inputFormat": p["input_format"], "outputFormat": p["output_format"],
            "constraints": p["constraints"], "hints": p["hints"], "editorial": p["editorial"],
            "starterCode": starter,
            "solutionPython": solution,
            "samples": samples, "hidden": hidden,
        })
    path = os.path.join(os.path.dirname(__file__), "..", "data", "problems.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(out, f, indent=1)
    print(f"wrote {len(out)} problems → {os.path.normpath(path)}")


if __name__ == "__main__":
    main()
