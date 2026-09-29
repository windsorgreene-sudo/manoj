import type { HinglishArticle } from "./types";

export const webDbHinglish: Record<string, HinglishArticle> = {
  "introduction-to-dbms": {
    excerpt: "Databases kyun hote hain, tables/rows/columns, keys, aur relational databases data ko sahi kaise rakhte hain.",
    parts: {
      0: "## Sirf files kyun nahi?\n\nFiles mein query karna, kai users ke saath safely share karna, crash ke baad data wapas laana aur data ko consistent rakhna mushkil hai. **Database Management System** ek query language, concurrency control, durability aur integrity constraints deta hai.\n\n## Relational model\n\nData **relations** (tables) mein rehta hai. Har **tuple** (row) ek record hai aur har **attribute** (column) ka ek domain (type) hota hai.\n",
      2: "\n## Keys\n\n- **Super key**, columns ka koi bhi set jo row ko alag pehchaane.\n- **Candidate key**, *sabse chhota* super key.\n- **Primary key**, chuna hua candidate key (unique, null nahi).\n- **Foreign key**, dusri table ke primary key ki taraf ishaara karta hai aur **referential integrity** laagu karta hai.\n\n## Teen level ka architecture\n\n1. **External**, alag users ke liye views.\n2. **Conceptual**, logical schema (tables, relationships).\n3. **Internal**, physical storage (files, indexes).\n\nIs alag-alag rakhne se **data independence** milti hai: aap application ki queries badle bina index jod sakte hain.\n\n<Callout type=\"tip\">Interview ka pasandida sawaal: \"Primary key aur unique key mein kya farq hai?\" Table mein ek hi primary key hoti hai (kabhi null nahi); unique keys kai ho sakti hain (jo null allow kar sakti hain).</Callout>",
    },
    quiz: [
      { q: "Sabse chhote super key ko kehte hain…", options: ["Foreign key", "Candidate key", "Composite key", "Surrogate key"], explanation: "Koi bhi column hataiye to woh unique nahi rehta." },
      { q: "Foreign keys kya laagu karti hain?", options: ["Entity integrity", "Referential integrity", "Normal forms", "Indexing"], explanation: "References maujood rows ki taraf hi hone chahiye." },
    ],
  },
  "sql-joins": {
    excerpt: "Asli students/courses data ke saath INNER, LEFT, RIGHT, FULL aur SELF joins, aur GROUP BY aur HAVING.",
    parts: {
      0: "## Sample data\n",
      2: "\n## INNER JOIN, sirf match hone wali rows\n",
      4: "\n## LEFT JOIN, left ki saari rows rakhiye\n",
      6: "\n## Dusre joins\n\n| Join | Kya rakhta hai |\n|---|---|\n| INNER | Sirf match hone wale jode |\n| LEFT | Left ki saari rows (+ matches ya NULL) |\n| RIGHT | Right ki saari rows (+ matches ya NULL) |\n| FULL OUTER | Dono taraf ki saari rows |\n| CROSS | Har combination (Cartesian product) |\n| SELF | Table ko khud se jodna (jaise employee → manager) |\n\n## GROUP BY aur HAVING\n",
      8: "\n`WHERE` grouping se **pehle** rows filter karta hai; `HAVING` aggregation ke **baad** groups filter karta hai.\n\n<Callout type=\"tip\">Bina enrollment wale students dhoondhiye: `LEFT JOIN … WHERE e.student_id IS NULL`, yahi \"anti-join\" pattern hai.</Callout>",
    },
    quiz: [
      { q: "Kaunsa join left table ki saari rows deta hai?", options: ["INNER", "LEFT", "CROSS", "SELF"], explanation: "Bina match wale right columns NULL ho jaate hain." },
      { q: "HAVING kya filter karta hai?", options: ["Grouping se pehle rows", "Aggregation ke baad groups", "Columns", "Indexes"], explanation: "WHERE rows ke liye, HAVING groups ke liye." },
    ],
  },
  "database-normalization": {
    excerpt: "Functional dependencies ki madad se step by step duplicate data aur update anomalies hataiye.",
    parts: {
      0: "## Problem: anomalies\n\n`orders(order_id, customer, customer_city, product, price)` sochiye. Agar customer shehar badle to kai rows update karni padengi (**update anomaly**); bina order wale customer ko store nahi kar sakte (**insertion anomaly**); uska aakhri order delete karne pe uska shehar bhi kho jaata hai (**deletion anomaly**).\n\n## Functional dependencies\n\n`X → Y` ka matlab hai X ki value se Y ki value tay hoti hai. Yahan: `customer → customer_city` aur `product → price`.\n\n## Normal forms\n\n**1NF**, har column mein **atomic** values; koi repeat hone wale groups nahi (ek cell mein comma se alag list nahi).\n\n**2NF**: 1NF aur koi **partial dependency** nahi: har non-key attribute *poore* composite key pe nirbhar ho, uske kisi hisse pe nahi.\n\n**3NF**: 2NF aur koi **transitive dependency** nahi: non-key attributes sirf key pe nirbhar hon (dusre non-key attributes pe nahi).\n\n**BCNF**, har dependency `X → Y` mein X ek super key ho. 3NF ka aur sakht roop.\n\n## Hamare example ko todna\n",
      2: "\nAb har baat sirf **ek baar** store hai.\n\n## Denormalise kab karein\n\nZyada padhne wale analytics mein kabhi-kabhi mehnge joins se bachne ke liye data jaan-boojh ke duplicate kiya jaata hai. Par yeh soch-samajh ke kijiye, copies ko sync rakhne ke plan ke saath.\n\n<Callout type=\"info\">Todna **lossless** hona chahiye (hisson ko jodne pe bilkul original wapas mile) aur behtar hai ki **dependency-preserving** bhi ho.</Callout>",
    },
    quiz: [
      { q: "Transitive dependency kis form ko todti hai?", options: ["1NF", "2NF", "3NF", "Kisi ko nahi"], explanation: "3NF non-key → non-key dependencies ki ijaazat nahi deta." },
      { q: "Ek cell mein comma se alag values kis form ko todti hain?", options: ["1NF", "2NF", "3NF", "BCNF"], explanation: "Values atomic honi chahiye." },
    ],
  },
  "transactions-and-acid": {
    excerpt: "Transaction ko bharosemand kya banata hai, saath chalne wale transactions kaunse anomalies laate hain, aur isolation levels suraksha aur speed ka santulan kaise karte hain.",
    parts: {
      0: "## Transaction\n\nTransaction operations ka ek silsila hai jise **ek logical unit** maana jaata hai.\n",
      2: "\n## ACID\n\n- **Atomicity**, ya sab ya kuch nahi (undo logs se banta hai).\n- **Consistency**, constraints pehle aur baad dono mein sahi rehte hain.\n- **Isolation**, saath chalne wale transactions ek dusre ka adhoora kaam nahi dekhte.\n- **Durability**, commit hone ke baad crash mein bhi bacha rehta hai (write-ahead logging).\n\n## Concurrency anomalies\n\n| Anomaly | Kya hota hai |\n|---|---|\n| Dirty read | Bina commit hua data padhna jo baad mein roll back ho jaaye |\n| Non-repeatable read | Wahi row do baar padhne pe alag values |\n| Phantom read | Wahi query dusri baar nayi rows laati hai |\n| Lost update | Do likhne wale ek dusre ka kaam mita dete hain |\n\n## Isolation levels (SQL standard)\n\n| Level | Dirty | Non-repeatable | Phantom |\n|---|---|---|---|\n| Read Uncommitted | ho sakta hai | ho sakta hai | ho sakta hai |\n| Read Committed |, | ho sakta hai | ho sakta hai |\n| Repeatable Read |, |, | ho sakta hai |\n| Serializable |, |, |, |\n\nPostgreSQL ka default **Read Committed** hai aur woh isolation **MVCC** se deta hai: padhne wale kabhi likhne walon ko nahi rokte, kyunki har transaction ek snapshot dekhta hai.\n\n## Lost updates rokna\n",
      4: "\n<Callout type=\"tip\">Two-phase locking (2PL) conflict-serializability ki guarantee deta hai: transaction koi bhi lock chhodne se pehle saare locks le leta hai.</Callout>",
    },
    quiz: [
      { q: "Write-ahead logging se kaunsi ACID property milti hai?", options: ["Isolation", "Durability", "Consistency", "Sirf Atomicity"], explanation: "Commit hue badlaav pehle disk pe log hote hain." },
      { q: "Serializable isolation kya rokta hai?", options: ["Sirf dirty reads", "Sirf dirty aur non-repeatable", "Teeno anomalies", "Kuch nahi"], explanation: "Yeh sabse sakht level hai." },
    ],
  },
  "database-indexing": {
    excerpt: "Indexes queries ko tez kaise karte hain, databases B+ trees kyun use karte hain, composite indexes, aur index kab nuksaan karta hai.",
    parts: {
      0: "## Indexes kyun?\n\nIndex ke bina `WHERE email = 'x'` har row scan karta hai: O(n). Index ek alag sorted structure hai jo key → row ki jagah batata hai, isse lookup **O(log n)** ho jaata hai.\n\n## B+ trees\n\nDatabases **B+ trees** use karte hain kyunki disk poore pages (jaise 8 KB) padhti hai. Har node mein saikdon keys hoti hain, isliye tree bahut **kam gehra** hota hai; ek arab rows ke liye bhi sirf 3-4 levels chahiye.\n\n- Andar ke nodes sirf keys rakhte hain, raasta batane ke liye.\n- **Leaves** keys + row pointers rakhti hain aur **judi hoti hain**, isliye range scans (`BETWEEN`, `ORDER BY`) seedha chalna ban jaata hai.\n\n## Indexes banana\n",
      2: "\n## Composite indexes aur leftmost prefix rule\n\n`(a, b, c)` pe bana index `a`, `(a, b)` ya `(a, b, c)` pe filters mein kaam aata hai, par akele `b` pe **nahi**. Sabse zyada chhaantne wale equality columns pehle aur range columns aakhir mein rakhiye.\n\n## Keemat\n\n- Har INSERT/UPDATE/DELETE ko har index bhi update karna padta hai.\n- Indexes disk aur memory lete hain.\n- Kam chhaantne wale columns (jaise boolean) ko shayad hi faayda hota hai.\n\n| Index type | Kiske liye achha |\n|---|---|\n| B+ tree | Equality aur ranges (default) |\n| Hash | Sirf equality |\n| GIN | Full-text search, arrays, JSON |\n| BRIN | Bahut badi, apne aap ordered tables (time series) |\n\n<Callout type=\"tip\">**Covering index** mein query ke saare zaroori columns hote hain, isliye database ko table chhoona hi nahi padta (\"index-only scan\").</Callout>",
    },
    quiz: [
      { q: "B+ tree ki leaves judi kyun hoti hain?", options: ["Jagah bachane ke liye", "Range scans tez karne ke liye", "Hashing ke liye", "Locking ke liye"], explanation: "Ranges seedha chalna ban jaati hain." },
      { q: "(a, b) pe bana index kis filter mein kaam aata hai?", options: ["Sirf b", "Sirf a", "Kisi mein nahi", "c"], explanation: "Leftmost-prefix rule." },
    ],
  },
  "semantic-html": {
    excerpt: "Structure, SEO aur screen readers ke liye sahi HTML elements use kijiye: landmarks, headings, forms aur alt text.",
    parts: {
      0: "## Semantics kyun zaroori hain\n\nSemantic elements **matlab** batate hain, dikhawat nahi. Browsers, search engines aur assistive technology sab inpe nirbhar hain. `<button>` apne aap focus aur keyboard se chalta hai; `<div onclick>` nahi.\n\n## Page landmarks\n",
      2: "\n## Headings ek outline banati hain\n\nHar page pe ek hi `<h1>` rakhiye aur levels kabhi na chhodiye (`h2` → `h4`). Screen reader use karne wale headings se hi page mein chalte hain.\n\n## Accessible forms\n",
      4: "\n## Images\n\nHar `<img>` ko `alt` chahiye. Content batayiye (`alt=\"Difficulty ke hisaab se solve problems ka bar chart\"`) ya sirf sajawat wali images ke liye `alt=\"\"` rakhiye.\n\n<Callout type=\"tip\">Sirf keyboard se test kijiye: Tab dabake page pe chaliye. Agar aapko nahi dikhta ki focus kahan hai ya kisi control tak nahi pahunch paate, to aapke kai users bhi nahi pahunch paayenge.</Callout>",
    },
    quiz: [
      { q: "Page ka main content kis element mein hona chahiye?", options: ["<div id='main'>", "<main>", "<section>", "<body>"], explanation: "<main> hi main landmark hai." },
      { q: "Sajawat wali image ka alt text hona chahiye…", options: ["Chhod dein", "alt=\"image\"", "alt=\"\"", "File ka naam"], explanation: "Khaali alt screen readers ko ise chhodne ko kehta hai." },
    ],
  },
  "css-flexbox-and-grid": {
    excerpt: "Jaaniye kab ek-dimension wala Flexbox aur kab do-dimension wala Grid use karna hai, responsive layout ke tareekon ke saath.",
    parts: {
      0: "## Flexbox, ek dimension\n\nFlexbox items ko **ek axis** (row ya column) pe lagata hai. Navbars, toolbars aur cheezon ko beech mein laane ke liye ekdam sahi.\n",
      2: "\n## Grid, do dimension\n\nGrid **rows aur columns** dono ek saath sambhalta hai. Page layouts aur card galleries ke liye ekdam sahi.\n",
      4: "\n`repeat(auto-fill, minmax(260px, 1fr))` utne 260px+ columns banata hai jitne fit hon, yaani **bina kisi** media query ke responsive gallery.\n\n## Chunna\n\n| Zarurat | Kya use karein |\n|---|---|\n| Row mein items jo wrap hon | Flexbox |\n| Ek cheez beech mein | Flexbox ya Grid |\n| Poore page ka layout | Grid |\n| Items ko rows *aur* columns dono mein line mein laana | Grid |\n\n<Callout type=\"tip\">Mobile-first: chhoti screens ke liye base styles likhiye, phir badi screens ke liye `min-width` media queries jodiye.</Callout>",
    },
    quiz: [
      { q: "Flexbox mukhya roop se hai…", options: ["Do-dimensional", "Ek-dimensional", "Sirf text ke liye", "Purana ho chuka"], explanation: "Yeh ek hi axis pe layout karta hai." },
      { q: "repeat(auto-fill, minmax(260px, 1fr)) kya banata hai?", options: ["Bilkul 260px columns", "Screen ke hisaab se columns ki ginti", "Ek column", "Rows"], explanation: "Jitne columns fit hon." },
    ],
  },
  "how-http-works": {
    excerpt: "URL type karne pe kya hota hai: DNS, TCP/TLS, HTTP methods, headers, status codes aur caching.",
    parts: {
      0: "## URL se page tak\n\n1. **DNS** `kodshala.com` ko ek IP address mein badalta hai.\n2. Ek **TCP** connection (aur HTTPS ke liye **TLS** handshake) banta hai.\n3. Browser **HTTP request** bhejta hai; server **response** lautata hai.\n4. Browser HTML padhta hai, CSS/JS/images laata hai, aur page banata hai.\n\n## Request ki banawat\n",
      2: "\n## Methods\n\n| Method | Kaam | Idempotent |\n|---|---|---|\n| GET | Resource padhna | Haan |\n| POST | Banana / koi action chalana | Nahi |\n| PUT | Resource badal dena | Haan |\n| PATCH | Thoda update karna | Nahi |\n| DELETE | Hatana | Haan |\n\n## Status codes\n\n- **2xx success**: 200 OK, 201 Created, 204 No Content\n- **3xx redirect**: 301 Moved Permanently, 304 Not Modified\n- **4xx client error**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests\n- **5xx server error**: 500 Internal Server Error, 503 Service Unavailable\n\n## Caching headers\n\n`Cache-Control: public, max-age=31536000, immutable` CDNs aur browsers ko static files ek saal tak dobara use karne deta hai. `ETag` + `If-None-Match` se server body dobara bheje bina **304** de sakta hai.\n\n<Callout type=\"info\">HTTP/2 ek hi connection pe kai requests chalata hai; HTTP/3 head-of-line blocking se bachne ke liye QUIC (UDP) pe chalta hai.</Callout>",
    },
    quiz: [
      { q: "Kaunsa status code 'Too Many Requests' ka matlab hai?", options: ["403", "404", "429", "503"], explanation: "Rate limiters 429 use karte hain." },
      { q: "Kaunsa method idempotent NAHI hai?", options: ["GET", "PUT", "DELETE", "POST"], explanation: "POST dohraane se duplicates ban sakte hain." },
    ],
  },
  "rest-apis-with-fetch": {
    excerpt: "Saaf REST endpoints design kijiye aur unhe browser se fetch ke saath call kijiye, errors aur JSON bodies ke saath.",
    parts: {
      0: "## Ek paragraph mein REST\n\nREST aapke domain ko **resources** ki tarah dekhta hai, jinhe URLs se pehchaana jaata hai aur standard HTTP methods se badla jaata hai. Responses aam taur pe JSON hote hain aur server **stateless** hota hai, har request apni zaroori cheezein (jaise auth token) saath laati hai.\n\n## Achha endpoint design\n",
      2: "\nResources ke liye **nouns**, collections ke liye plural, filtering aur pagination ke liye query strings, aur sahi status codes use kijiye.\n\n## Chhota sa Express server\n",
      4: "\n## fetch se call karna\n",
      6: "\n<Callout type=\"warning\">`fetch` sirf network fail hone pe reject karta hai; 404 ya 500 pe bhi resolve hi hota hai. Hamesha `res.ok` check kijiye.</Callout>",
    },
    quiz: [
      { q: "Kuch safalta se banne pe sahi status hai…", options: ["200", "201", "204", "302"], explanation: "201 Created." },
      { q: "Kya fetch HTTP 500 pe reject karta hai?", options: ["Haan", "Nahi, res.ok check kijiye", "Sirf Node mein", "Sirf await ke saath"], explanation: "Sirf network errors reject hote hain." },
    ],
  },
};
