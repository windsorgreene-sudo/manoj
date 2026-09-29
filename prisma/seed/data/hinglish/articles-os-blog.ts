import type { HinglishArticle } from "./types";

export const osBlogHinglish: Record<string, HinglishArticle> = {
  "processes-and-threads": {
    excerpt: "Processes, threads, PCB aur context switching samjhiye, aur jaaniye kab multi-threading aur kab multi-processing chunna hai.",
    parts: {
      0: "## Process\n\n**Process** chalta hua program hai. Iske paas apna address space (code, data, heap, stack), khuli files aur dusre resources hote hain. OS ise **Process Control Block** (PCB) se track karta hai: PID, state, program counter, registers, scheduling ki jaankari, memory maps.\n\nProcess ki states: **new → ready → running → waiting → terminated**.\n\n## Thread\n\n**Thread** process ke *andar* CPU scheduling ki unit hai. Ek hi process ke threads code, heap aur khuli files **share** karte hain, par har ek ka apna stack, registers aur program counter hota hai.\n\n| | Process | Thread |\n|---|---|---|\n| Memory | Alag address space | Bhai-behen threads ke saath shared |\n| Banane ki keemat | Zyada | Kam |\n| Baat-cheet | IPC (pipes, sockets, shared memory) | Shared variables |\n| Crash ka asar | Alag rehta hai | Poora process gira sakta hai |\n\n## Threads banana\n",
      2: "\n## Context switching\n\nCPU ko ek process se dusre pe le jaane ka matlab hai PCB save aur restore karna, aur aksar TLB bhi khaali karna, jo sirf kharcha hai. Ek hi process ke andar thread badalna sasta hai kyunki address space wahi rehta hai.\n\n<Callout type=\"info\">CPython mein GIL ek samay pe sirf ek thread ko Python bytecode chalane deta hai. CPU wale kaam ke liye `multiprocessing` aur I/O wale kaam ke liye threads/async use kijiye.</Callout>",
    },
    quiz: [
      { q: "Ek hi process ke threads kya share karte hain?", options: ["Stack", "Registers", "Heap", "Program counter"], explanation: "Har thread ka apna stack aur registers hote hain." },
      { q: "Process ki jaankari kaunsa data structure rakhta hai?", options: ["TLB", "PCB", "Page table", "Inode"], explanation: "Process Control Block." },
    ],
  },
  "cpu-scheduling-algorithms": {
    excerpt: "FCFS, SJF, SRTF, Priority aur Round Robin, Gantt charts, waiting time aur turnaround ke hisaab ke saath.",
    parts: {
      0: "## Metrics\n\n- **Turnaround time** = khatam hone ka samay − aane ka samay\n- **Waiting time** = turnaround − burst\n- **Response time** = pehli baar chalna − aane ka samay\n\n## Example workload\n\n| Process | Arrival | Burst |\n|---|---|---|\n| P1 | 0 | 8 |\n| P2 | 1 | 4 |\n| P3 | 2 | 2 |\n\n## FCFS (First Come First Served)\n\nOrder P1 → P2 → P3. Khatam hone ke samay: 8, 12, 14. Waiting: 0, 7, 10 → **average 5.67**. Simple hai, par lambe kaam ke peeche phanse chhote kaam **convoy effect** jhelte hain.\n\n## SJF (Shortest Job First, non-preemptive)\n\nt=0 pe sirf P1 hai, to woh 8 tak chalta hai. Phir P3 (2) → 10, P2 (4) → 14. Waiting: 0, 9, 6 → **average 5.0**. Average waiting time ke liye SJF sabse achha hai, par ise burst ka andaaza chahiye aur lambe kaam **bhookhe** reh sakte hain.\n\n## SRTF (preemptive SJF)\n\nP1 0-1 chalta hai, P2 use hata deta hai (4 < 7) aur 1-2 chalta hai, P3 use hata deta hai (2 < 3) aur 2-4 chalta hai, P2 4-7 mein khatam, P1 7-14 mein khatam. Waiting: 6, 2, 0 → **average 2.67**.\n\n## Round Robin\n\nHar process ko baari-baari ek **time quantum** (maan lijiye 2) milta hai. Response time aur barabari badhiya; bahut chhota quantum context switches mein time barbaad karta hai, bahut bada FCFS jaisa ho jaata hai.\n",
      2: "\n<Callout type=\"tip\">Asli OS **multilevel feedback queues** use karte hain: interactive kaam upar ki chhote-quantum queues mein rehte hain, aur CPU khane wale kaam neeche chale jaate hain.</Callout>",
    },
    quiz: [
      { q: "Kaunsa algorithm average waiting time sabse kam karta hai (jab saare kaam pata hon)?", options: ["FCFS", "SJF", "Round Robin", "Priority"], explanation: "Shortest job first sabit roop se sabse achha hai." },
      { q: "Convoy effect kisse juda hai?", options: ["FCFS", "SRTF", "Round Robin", "MLFQ"], explanation: "Chhote kaam ek lambe kaam ke peeche intezaar karte hain." },
    ],
  },
  deadlocks: {
    excerpt: "Chaar Coffman conditions, resource allocation graphs, rokne ke tareeke aur deadlock avoidance.",
    parts: {
      0: "## Deadlock kya hai?\n\nProcesses ka ek group deadlock mein tab hai jab har ek kisi aise resource ka intezaar kare jo group ke kisi dusre process ke paas hai; koi aage nahi badh sakta.\n\n## Chaar Coffman conditions (saari honi chahiye)\n\n1. **Mutual exclusion**, resource ek samay pe ek hi process ke paas.\n2. **Hold and wait**, process kuch resources rakhe hue dusron ka intezaar karta hai.\n3. **No preemption**, resources zabardasti nahi chheene ja sakte.\n4. **Circular wait**, intezaar ka ek chakra P1 → P2 → … → P1.\n\n## Sambhalne ke tareeke\n\n- **Prevention**, koi ek condition tod dijiye. Sabse practical: ek **global lock ordering** tay kijiye taaki circular wait ho hi na sake.\n- **Avoidance**, request tabhi dijiye jab system *safe state* mein rahe (Banker's algorithm).\n- **Detection aur recovery**, hone dijiye, wait-for graph mein cycles dhoondhiye, aur ek process ko khatam ya roll back kijiye.\n- **Nazarandaaz kijiye**, \"ostrich algorithm\", jo zyadatar desktop OS use karte hain.\n\n## Code mein lock ordering\n",
      2: "\n## Banker's algorithm (idea)\n\n`Available`, `Max`, `Allocation` aur `Need = Max − Allocation` rakhiye. State **safe** tab hai jab koi aisa order ho jisme har process apni bachi zarurat, available aur pehle wale processes ke chhode resources se paa sake. Request dene se pehle maan lijiye de di, aur check kijiye ki state safe hai.\n\n<Callout type=\"info\">Deadlock ≠ starvation. Starvation mein ek process hamesha intezaar karta hai jabki baaki aage badhte hain; deadlock mein chakra ka *koi bhi* aage nahi badhta.</Callout>",
    },
    quiz: [
      { q: "Inme se Coffman condition kaunsi NAHI hai?", options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"], explanation: "Condition *no* preemption hai." },
      { q: "Global lock ordering kya rokta hai?", options: ["Mutual exclusion", "Circular wait", "Starvation", "Paging"], explanation: "Agar sab ek hi order mein lock karein to chakra ban hi nahi sakta." },
    ],
  },
  "memory-management-paging": {
    excerpt: "Logical vs physical addresses, paging, TLB, page faults aur page replacement algorithms (FIFO, LRU, Optimal).",
    parts: {
      0: "## Logical vs physical addresses\n\nPrograms **logical (virtual) addresses** use karte hain; **MMU** unhe RAM ke **physical** addresses mein badalta hai. Isse processes alag rehte hain aur har ek ko lagta hai ki uske paas badi lagataar memory hai.\n\n## Paging\n\nVirtual memory fixed size ke **pages** (aam taur pe 4 KB) mein, aur RAM usi size ke **frames** mein bati hoti hai. **Page table** page → frame batati hai. Paging *external* fragmentation khatam karti hai (aadha bhara aakhri page thoda sa *internal* fragmentation deta hai).\n\nAddress = **page number | offset**. 4 KB pages ke saath neeche ke 12 bits offset hain.\n\n## TLB\n\nHar access pe page table dekhna memory ka time do guna kar deta. **Translation Lookaside Buffer** haal ke translations cache karta hai; 99% se zyada hit rate aam baat hai.\n\n## Page faults aur demand paging\n\nPages tabhi load hote hain jab pehli baar chhue jaayein. RAM mein na hone wala page chhoona **page fault** deta hai: OS ek frame chunta hai, agar woh badla hua (dirty) hai to use likhta hai, page load karta hai aur instruction dobara chalata hai.\n\n## Page replacement\n",
      2: "\n| Algorithm | Idea | Notes |\n|---|---|---|\n| FIFO | Sabse purana hataiye | **Belady's anomaly** jhelta hai |\n| LRU | Sabse kam haal mein use hua hataiye | Practice mein badhiya, par theek se track karna mehnga |\n| Optimal | Woh page hataiye jo sabse der se use hoga | Sirf theory ka paimaana |\n| Clock | Reference bit se LRU ka andaaza | Asli OS use karte hain |\n\n<Callout type=\"warning\">**Thrashing** tab hoti hai jab processes ke paas unke working set ke liye kaafi frames nahi hote: system chalane se zyada time paging mein lagata hai.</Callout>",
    },
    quiz: [
      { q: "Kaunsa algorithm Belady's anomaly jhel sakta hai?", options: ["LRU", "Optimal", "FIFO", "Clock"], explanation: "FIFO mein zyada frames ka matlab zyada faults bhi ho sakta hai." },
      { q: "TLB kya cache karta hai?", options: ["Disk blocks", "Page table ke translations", "Instructions", "Processes"], explanation: "Haal ke virtual→physical mappings." },
    ],
  },
  "how-to-prepare-for-coding-interviews-2026": {
    excerpt: "12 hafte ka plan: DSA patterns, system design ki buniyaad, mock interviews aur AI ke daur mein recruiters ki ummeedein.",
    parts: {
      0: "## Hafte 1-4: Buniyaad\n\n**Ek language** chuniye aur uski standard library mein ache se haath baithaiye. Arrays, strings, hashing, two pointers, sliding window aur binary search cover kijiye. Roz 3-4 problems solve kijiye; har ek mein code se pehle complexity likhiye.\n\n## Hafte 5-8: Main patterns\n\nLinked lists, stacks/queues, trees, graphs (BFS/DFS, Dijkstra, topological sort) aur dynamic programming. **Kodshala DSA Sheet** use kijiye aur ginti se zyada samajh pe dhyaan dijiye; jo problems galat hue unhe 3 din baad, phir ek hafte baad dobara solve kijiye.\n\n## Hafte 9-10: Contests aur speed\n\nWeekly contests mein judiye. Time ka dabaav woh kamiyan dikhata hai jo bina time ki practice chhupa leti hai. Jo problem solve na hui, har ek ka editorial padhiye.\n\n## Hafte 11-12: Mock interviews aur projects\n\n**Bol-bol ke sochne** ki practice kijiye: problem saaf kijiye, pehle brute force bataiye, use behtar kijiye, phir code kijiye. Do projects taiyaar rakhiye jin pe gehri baat kar sakein: trade-offs, galtiyan, numbers.\n\n## 2026 mein kya badla\n\nInterviewers take-home mein AI tools ki ijaazat zyada dene lage hain, par ummeed karte hain ki aap bane hue code ko **samjha aur parakh** sakein. Complexity, edge cases aur testing ki samajh pehle se zyada keemti hai.\n\n<Callout type=\"tip\">Lagataar mehnat tezi se behtar hai: roz ek ghante ki 60 din ki streak weekend pe ratne se aage nikal jaati hai.</Callout>",
    },
  },
  "inside-the-kodshala-judge": {
    excerpt: "Judge0 ke saath sandbox mein code chalana, har test ka verdict, time aur memory limits, aur rate limiting pe ek nazar.",
    parts: {
      0: "## Pipeline\n\nJab aap **Submit** dabate hain, aapka code check hota hai, rate-limit hota hai, aur har hidden test case ke saath ek **Judge0** worker ko bheja jaata hai. Judge0 program ko ek **isolate** sandbox mein compile karke chalata hai: sakht CPU-time, wall-time aur memory limits, koi network nahi, aur sirf padhne layak filesystem.\n\n## Verdicts\n\n- **Accepted**, har test ka output match karta hai (aakhir ke whitespace ko chhodkar).\n- **Wrong Answer**, kam se kam ek test pe output alag hai.\n- **Time Limit Exceeded**, CPU limit paar ho gayi.\n- **Runtime Error**, non-zero exit, segfault ya bina pakdi exception.\n- **Compilation Error**, compiler ne code reject kar diya.\n\nHum pehle fail hone wale hidden test pe ruk jaate hain, aur runtime aur memory saare tests mein sabse zyada wali batate hain.\n\n## Run aur Submit alag kyun hain\n\n**Run** dikhne wale sample tests (aur aapka apna input) use karta hai taaki aap jaldi-jaldi sudhaar sakein; **Submit** hidden tests use karta hai jinme khaali inputs, sabse bade size aur negative numbers jaise edge cases hote hain.\n\n## Sahi istemaal\n\nCode chalana har user ke liye rate-limited hai, taaki contests ke dauraan sabke liye queue chhoti rahe.",
    },
  },
  "why-we-built-kodshala": {
    excerpt: "Coding seekhne ke liye paanch tabs nahi hone chahiye. Seekhne, practice aur contest ke ek platform ki kahani aur soch.",
    parts: {
      0: "## Paanch tabs zyada hain\n\nHum jin students se mile, unme se zyadatar ke ek tab mein tutorial site, dusre mein problem site, teesre mein video, chauthe mein online compiler aur paanchve mein progress track karne ki spreadsheet khuli hoti thi. Baar-baar tab badalna raftaar tod raha tha.\n\n## Hamare usool\n\n1. **Karke seekhiye**, har code block pe *Try it Yourself* button hai.\n2. **Hints, spoilers nahi**, hamara AI tutor aapko answer thamane ki jagah uski taraf dheere se le jaata hai.\n3. **Dikhne wali progress**, streaks, XP, heatmaps aur certificates lagataar mehnat ko dikhate hain.\n4. **Har jagah fast**, saste phones aur 4G pe bhi tutorials aur problems jaldi khulte hain.\n\n## Aage kya\n\nCompany ke hisaab se mock interviews, peer code review aur aur languages. Contact page pe bataiye aapko kya chahiye, hum sab kuch padhte hain.",
    },
  },
};
