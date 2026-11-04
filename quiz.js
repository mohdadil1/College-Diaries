const $ = id => document.getElementById(id);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (arr, n) => shuffle([...arr]).slice(0, n);

// Builds a "what is the output?" question with random wrong answers
function num(code, ans, why) {
  const s = new Set([ans]);
  while (s.size < 4) s.add(ans + (rnd(-4, 4) || 5));
  const o = shuffle([...s]).map(String);
  return { q: "What is the output?", code, o, a: o.indexOf(String(ans)), w: why };
}

// Generated questions (random numbers every time)
const gens = [
  { l: 1, f: L => {
      const a = rnd(6, 10 + L * 8), b = rnd(2, 6), ops = L > 1 ? "+-*/%" : "+-*", o = ops[rnd(0, ops.length - 1)];
      const r = o == "+" ? a + b : o == "-" ? a - b : o == "*" ? a * b : o == "/" ? Math.trunc(a / b) : a % b;
      return num(`int a = ${a}, b = ${b};\nprintf("%d", a ${o} b);`, r,
        o == "/" ? "Integer division drops the decimal part." : o == "%" ? "% gives the remainder after division." : "Plain arithmetic on ints.");
  }},
  { l: 1, f: () => {
      const n = rnd(3, 7);
      return num(`int sum = 0;\nfor (int i = 1; i <= ${n}; i++)\n    sum += i;\nprintf("%d", sum);`, n * (n + 1) / 2, `It adds 1 up to ${n}, giving ${n * (n + 1) / 2}.`);
  }},
  { l: 1, f: () => {
      const r = [...Array(5)].map(() => rnd(1, 9)), k = rnd(0, 4);
      return num(`int arr[] = {${r.join(", ")}};\nprintf("%d", arr[${k}]);`, r[k], "Array indexing starts at 0.");
  }},
  { l: 2, f: () => {
      const x = rnd(2, 9), k = rnd(2, 9);
      return num(`int x = ${x};\nint *p = &x;\n*p = *p + ${k};\nprintf("%d", x);`, x + k, "p points to x, so changing *p changes x.");
  }},
  { l: 2, f: () => {
      const a = rnd(0, 4), b = a + rnd(6, 16), s = rnd(2, 4);
      return num(`int count = 0;\nfor (int i = ${a}; i < ${b}; i += ${s})\n    count++;\nprintf("%d", count);`, Math.ceil((b - a) / s), `i grows by ${s} while it is below ${b}.`);
  }},
  { l: 2, f: () => {
      const n = rnd(2, 8), k = rnd(2, 6);
      return num(`int x = ${n};\nx += ${k};\nx *= 2;\nprintf("%d", x);`, (n + k) * 2, "First add, then double.");
  }},
  { l: 3, f: () => {
      const n = rnd(2, 9);
      return num(`int x = ${n};\nint y = x++;\nprintf("%d", x + y);`, 2 * n + 1, "x++ gives y the old value, then x grows by 1.");
  }},
  { l: 3, f: () => {
      const a = rnd(1, 15), b = rnd(1, 15), o = "&|^"[rnd(0, 2)];
      return num(`int a = ${a}, b = ${b};\nprintf("%d", a ${o} b);`, o == "&" ? a & b : o == "|" ? a | b : a ^ b, "Compare the bits of both numbers.");
  }}
];

// Question bank: l = level (1 easy, 2 medium, 3 hard), a = index of the correct option
const bank = [
  // ---------- EASY (30) ----------
  { l: 1, q: "Which symbol gives the address of a variable?", o: ["*", "&", "#", "@"], a: 1, w: "& is the address-of operator." },
  { l: 1, q: "Which header is needed for printf?", o: ["stdlib.h", "string.h", "stdio.h", "math.h"], a: 2, w: "printf lives in stdio.h." },
  { l: 1, q: "Which loop always runs at least once?", o: ["for", "while", "do-while", "none"], a: 2, w: "do-while checks its condition after the body." },
  { l: 1, q: "Which format specifier prints an int?", o: ["%f", "%c", "%s", "%d"], a: 3, w: "%d is for int." },
  { l: 1, q: "Which function prints output to the screen?", o: ["scanf()", "printf()", "input()", "echo()"], a: 1, w: "printf() prints formatted output." },
  { l: 1, q: "Which function reads formatted input from the keyboard?", o: ["scanf()", "printf()", "get()", "read()"], a: 0, w: "scanf() reads input into variables." },
  { l: 1, q: "Which symbol ends most statements in C?", o: [": (colon)", ". (period)", "; (semicolon)", ", (comma)"], a: 2, w: "Statements end with a semicolon." },
  { l: 1, q: "Which is a valid single-line comment in C?", o: ["// comment", "# comment", "-- comment", "<!-- comment -->"], a: 0, w: "// starts a single-line comment." },
  { l: 1, q: "Which data type stores whole numbers?", o: ["int", "char", "float", "void"], a: 0, w: "int holds whole numbers." },
  { l: 1, q: "Which data type stores a single character?", o: ["string", "char", "text", "letter"], a: 1, w: "char holds one character." },
  { l: 1, q: "Which data type stores decimal numbers?", o: ["int", "char", "float", "bool"], a: 2, w: "float (or double) holds decimals." },
  { l: 1, q: "Which format specifier prints a float?", o: ["%d", "%f", "%c", "%s"], a: 1, w: "%f is for floating-point numbers." },
  { l: 1, q: "Which format specifier prints a single character?", o: ["%c", "%s", "%d", "%f"], a: 0, w: "%c prints one character." },
  { l: 1, q: "Which format specifier prints a string?", o: ["%c", "%d", "%s", "%f"], a: 2, w: "%s prints a string." },
  { l: 1, q: "Where does every C program start running?", o: ["start()", "main()", "run()", "begin()"], a: 1, w: "Execution begins in main()." },
  { l: 1, q: "Which keyword sends a value back from a function?", o: ["give", "return", "send", "exit"], a: 1, w: "return gives a value back to the caller." },
  { l: 1, q: "Which pair marks a multi-line comment?", o: ["/* */", "// //", "<!-- -->", "## ##"], a: 0, w: "/* starts and */ ends a block comment." },
  { l: 1, q: "What is the index of the first element of an array?", o: ["0", "1", "-1", "It depends"], a: 0, w: "Arrays start at index 0." },
  { l: 1, q: "Which operator checks if two values are equal?", o: ["=", "==", "===", "!="], a: 1, w: "== compares, = assigns." },
  { l: 1, q: "Which operator means logical AND?", o: ["&&", "||", "!", "&"], a: 0, w: "&& is true only if both sides are true." },
  { l: 1, q: "What does i++ do?", o: ["Increases i by 1", "Increases i by 2", "Multiplies i by itself", "Decreases i by 1"], a: 0, w: "++ adds 1." },
  { l: 1, q: "Which loop is the usual choice when you know how many times to repeat?", o: ["for", "if", "switch", "goto"], a: 0, w: "for packs start, condition and step in one line." },
  { l: 1, q: "Which header file declares sqrt()?", o: ["stdio.h", "math.h", "string.h", "stdlib.h"], a: 1, w: "Maths functions live in math.h." },
  { l: 1, q: "How do you declare an integer variable named age?", o: ["int age;", "integer age;", "age int;", "var age;"], a: 0, w: "Type first, then the name." },
  { l: 1, q: "What does 7 % 3 evaluate to?", o: ["1", "2", "3", "0"], a: 0, w: "% gives the remainder: 7 = 2*3 + 1." },
  { l: 1, q: "Which keyword gives the alternative branch of an if?", o: ["otherwise", "else", "then", "elif"], a: 1, w: "C uses else (there is no elif keyword)." },
  { l: 1, q: "What does the escape sequence \\n do in printf?", o: ["Prints a new line", "Prints a tab", "Ends the program", "Prints a backslash and n"], a: 0, w: "\\n moves to the next line." },
  { l: 1, q: "Which is a valid variable name in C?", o: ["2total", "total_sum", "my-var", "int"], a: 1, w: "Names can't start with a digit, contain - or be keywords." },
  { l: 1, q: "Which quotes surround a string literal in C?", o: ["Single quotes ' '", "Double quotes \" \"", "Backticks", "Angle brackets"], a: 1, w: "Strings use double quotes; single quotes are for one char." },
  { l: 1, q: "What does 10 / 3 give when both are ints?", o: ["3", "3.33", "4", "1"], a: 0, w: "Integer division drops the decimal part." },

  // ---------- MEDIUM (30) ----------
  { l: 2, q: "What does sizeof(char) always equal?", o: ["1", "2", "4", "8"], a: 0, w: "By definition, sizeof(char) is 1." },
  { l: 2, q: "What marks the end of a C string?", o: ["'\\n'", "'\\0'", "' '", "EOF"], a: 1, w: "Strings end with the null character '\\0'." },
  { l: 2, q: "Which function allocates memory dynamically?", o: ["alloc()", "new()", "malloc()", "create()"], a: 2, w: "malloc() from stdlib.h." },
  { l: 2, q: "What does break do inside a loop?", o: ["Skips one iteration", "Exits the loop", "Restarts the loop", "Ends the program"], a: 1, w: "break leaves the loop immediately." },
  { l: 2, q: "What does continue do inside a loop?", o: ["Skips the rest of this iteration", "Exits the loop", "Pauses the program", "Restarts the program"], a: 0, w: "continue jumps to the next iteration." },
  { l: 2, q: "Which operator gets the value a pointer points to?", o: ["&", "*", "->", "#"], a: 1, w: "* dereferences a pointer." },
  { l: 2, q: "What does a NULL pointer mean?", o: ["It points to nothing", "It points to the first array item", "It points to a string", "It is a syntax error"], a: 0, w: "NULL means the pointer holds no valid address." },
  { l: 2, q: "Which function copies one string into another?", o: ["strcpy()", "strcmp()", "strcat()", "strlen()"], a: 0, w: "strcpy(dest, src) copies src into dest." },
  { l: 2, q: "Which function compares two strings?", o: ["strcat()", "strcmp()", "strcpy()", "strchr()"], a: 1, w: "strcmp() compares strings." },
  { l: 2, q: "What does strcmp return when two strings are equal?", o: ["1", "-1", "0", "true"], a: 2, w: "It returns 0 for equal strings." },
  { l: 2, q: "Which keyword groups different variables under one name?", o: ["class", "struct", "object", "array"], a: 1, w: "A struct bundles related variables." },
  { l: 2, q: "Which operator accesses a struct member through a pointer?", o: [".", "->", "::", "&"], a: 1, w: "ptr->member is the same as (*ptr).member." },
  { l: 2, q: "What is the last valid index of int arr[10]?", o: ["10", "9", "11", "8"], a: 1, w: "Indexes run from 0 to 9." },
  { l: 2, q: "Which function resizes previously allocated memory?", o: ["realloc()", "resize()", "malloc()", "extend()"], a: 0, w: "realloc() grows or shrinks a block." },
  { l: 2, q: "Which header declares strcpy and strlen?", o: ["stdio.h", "string.h", "stdlib.h", "ctype.h"], a: 1, w: "String functions are in string.h." },
  { l: 2, q: "Without break, a switch case will...", o: ["Stop immediately", "Fall through to the next case", "Cause a compile error", "Restart the switch"], a: 1, w: "Execution falls into the next case." },
  { l: 2, q: "What value does an uninitialised local int hold?", o: ["0", "A garbage (indeterminate) value", "NULL", "1"], a: 1, w: "Local variables are not set to 0 automatically." },
  { l: 2, q: "What does static do to a local variable?", o: ["Keeps its value between function calls", "Makes it a constant", "Makes it global to all files", "Stores it in a register"], a: 0, w: "A static local lives for the whole program." },
  { l: 2, q: "What is the difference between = and ==?", o: ["= assigns, == compares", "= compares, == assigns", "They are the same", "= is for strings"], a: 0, w: "One stores a value, the other tests equality." },
  { l: 2, q: "Which declares a pointer to an int?", o: ["int p*;", "int *p;", "pointer int p;", "int &p;"], a: 1, w: "int *p; declares p as a pointer to int." },
  { l: 2, q: "What does the sizeof operator give you?", o: ["Size in bytes", "Number of elements", "Number of digits", "A memory address"], a: 0, w: "sizeof returns the size in bytes." },
  { l: 2, q: "What does condition ? a : b do?", o: ["Gives a if condition is true, otherwise b", "Always runs both", "Declares an array", "Loops until true"], a: 0, w: "It is a short if-else expression." },
  { l: 2, q: "Which function safely reads a whole line, including spaces?", o: ["gets()", "fgets()", 'scanf("%d")', "getch()"], a: 1, w: "fgets() limits how much it reads. gets() is unsafe." },
  { l: 2, q: "What does main normally return?", o: ["int", "void", "char", "float"], a: 0, w: "main returns an int status code." },
  { l: 2, q: "How does C pass function arguments by default?", o: ["By value (a copy)", "By reference", "By name", "Always by pointer"], a: 0, w: "The function gets a copy unless you pass a pointer." },
  { l: 2, q: "What does #define do?", o: ["Creates a macro replaced before compiling", "Declares a variable", "Imports a library at runtime", "Defines a function"], a: 0, w: "The preprocessor swaps the macro for its value." },
  { l: 2, q: "Which declares a 2D array of ints?", o: ["int a[3][4];", "int a(3,4);", "int a[3,4];", "int[3][4] a;"], a: 0, w: "Use one pair of brackets per dimension." },
  { l: 2, q: 'Why does scanf("%d", &x) need the &?', o: ["It needs the address of x to store the value", "It converts x to a string", "It makes x constant", "It checks x for errors"], a: 0, w: "scanf writes into the memory address you give it." },
  { l: 2, q: "What does 5 / 2.0 evaluate to?", o: ["2", "2.5", "3", "Error"], a: 1, w: "One operand is a double, so the result is 2.5." },
  { l: 2, q: "Which function opens a file?", o: ["open()", "fopen()", "fileopen()", "readfile()"], a: 1, w: "fopen() returns a FILE pointer." },

  // ---------- HARD (30) ----------
  { l: 3, q: "What does free(p) do?", o: ["Deletes the pointer variable", "Releases the memory p points to", "Sets p to NULL", "Resizes the memory"], a: 1, w: "It returns heap memory to the system." },
  { l: 3, q: "What does strlen(\"hello\") return?", o: ["4", "5", "6", "Depends"], a: 1, w: "It counts characters, not the '\\0'." },
  { l: 3, q: "In most expressions, an array name becomes...", o: ["A pointer to its first element", "A copy of the array", "Its length", "NULL"], a: 0, w: "Arrays decay to a pointer to element 0." },
  { l: 3, q: "After free(p), p still holds the old address. What is p called?", o: ["Dangling pointer", "Null pointer", "Wild card", "Void pointer"], a: 0, w: "It points to memory that is no longer yours." },
  { l: 3, q: "What is a memory leak?", o: ["Allocated memory that is never freed", "Reading outside an array", "Using an uninitialised variable", "Freeing memory twice"], a: 0, w: "The program loses track of memory it still owns." },
  { l: 3, q: "What does malloc return if it cannot allocate memory?", o: ["0 bytes", "NULL", "-1", "It crashes the program"], a: 1, w: "Always check for NULL." },
  { l: 3, q: "How does calloc differ from malloc?", o: ["calloc sets the memory to zero", "calloc is always faster", "calloc frees memory", "calloc only works for chars"], a: 0, w: "calloc zero-initialises the block." },
  { l: 3, q: "What does const int *p mean?", o: ["You cannot change the int through p", "p itself cannot change", "p must be NULL", "p is a constant string"], a: 0, w: "The data is read-only through p, but p can move." },
  { l: 3, q: "What does int *const p mean?", o: ["p cannot point somewhere else", "The int cannot change", "p is a void pointer", "p is an array"], a: 0, w: "The pointer is fixed, but the data can change." },
  { l: 3, q: "What is a void * pointer?", o: ["A generic pointer with no type", "A pointer to nothing", "A pointer to a function", "A null pointer"], a: 0, w: "It can hold any address but must be cast to dereference." },
  { l: 3, q: "What does a function pointer store?", o: ["The address of a function", "The return value", "The function name as text", "The number of arguments"], a: 0, w: "You can call the function through it." },
  { l: 3, q: "Which of these is undefined behaviour in C?", o: ["Dividing an int by zero", "Declaring an unused variable", "Using a long variable name", "Nesting loops"], a: 0, w: "Integer division by zero is undefined." },
  { l: 3, q: "What does volatile tell the compiler?", o: ["The value may change unexpectedly, so do not optimise it away", "The value never changes", "Store it in a file", "Make it thread-safe automatically"], a: 0, w: "Used for hardware registers and similar cases." },
  { l: 3, q: "What is the output?", code: `char s[] = "abc";\nprintf("%d", sizeof(s));`, o: ["3", "4", "5", "Error"], a: 1, w: "sizeof counts the hidden '\\0' too." },
  { l: 3, q: "What is the output?", code: `int arr[] = {1, 2, 3, 4};\nprintf("%d", sizeof(arr) / sizeof(arr[0]));`, o: ["4", "16", "1", "8"], a: 0, w: "Total bytes divided by bytes per element gives the element count." },
  { l: 3, q: "What is the output?", code: `printf("%.1f", 7 / 2 * 2.0);`, o: ["7.0", "6.0", "3.0", "6"], a: 1, w: "7 / 2 is 3 (int division) first, then 3 * 2.0 = 6.0." },
  { l: 3, q: "What is the output?", code: `for (int i = 0; i < 5; i++) {\n    if (i == 2) continue;\n    printf("%d", i);\n}`, o: ["01234", "0134", "0123", "1234"], a: 1, w: "continue skips printing when i is 2." },
  { l: 3, q: "What is the output?", code: `int a = 5;\nprintf("%d", a << 2);`, o: ["10", "20", "25", "52"], a: 1, w: "Shifting left by 2 multiplies by 4." },
  { l: 3, q: "What is the output?", code: `printf("%d", 'A' + 1);`, o: ["A1", "66", "B", "65"], a: 1, w: "'A' is 65 in ASCII, so 'A' + 1 is 66." },
  { l: 3, q: "What is the output?", code: `int x = 0;\nif (x = 5) printf("yes");\nelse printf("no");`, o: ["yes", "no", "Compile error", "Nothing is printed"], a: 0, w: "x = 5 assigns 5, which is true." },
  { l: 3, q: "What is the output?", code: `int a[3] = {10, 20, 30};\nint *p = a;\nprintf("%d", *(p + 2));`, o: ["10", "20", "30", "Garbage"], a: 2, w: "p + 2 points to the third element." },
  { l: 3, q: "What is the output?", code: `int a[3] = {10, 20, 30};\nint *p = a;\np++;\nprintf("%d", *p);`, o: ["10", "20", "30", "11"], a: 1, w: "p++ moves the pointer to the next element." },
  { l: 3, q: "What is the output?", code: `int x = 10;\nint *p = &x;\nint **q = &p;\nprintf("%d", **q);`, o: ["10", "The address of x", "The address of p", "Error"], a: 0, w: "**q follows two pointers back to x." },
  { l: 3, q: "What is the output?", code: `switch (2) {\n  case 1: printf("A");\n  case 2: printf("B");\n  case 3: printf("C"); break;\n  default: printf("D");\n}`, o: ["B", "BC", "BCD", "C"], a: 1, w: "Case 2 falls through into case 3, then break stops it." },
  { l: 3, q: "What is the output?", code: `printf("%d", !0 + !5);`, o: ["0", "1", "2", "5"], a: 1, w: "!0 is 1 and !5 is 0, so the sum is 1." },
  { l: 3, q: "What is the output?", code: `printf("%d", -7 % 3);`, o: ["1", "-1", "2", "-2"], a: 1, w: "In C the result takes the sign of the left operand." },
  { l: 3, q: "What is the output?", code: `printf("%d", 1 + 2 * 3 % 4);`, o: ["1", "2", "3", "7"], a: 2, w: "2 * 3 % 4 is (6 % 4) = 2, then 1 + 2 = 3." },
  { l: 3, q: "What is the output?", code: `int x = 1;\nx <<= 3;\nprintf("%d", x);`, o: ["3", "6", "8", "9"], a: 2, w: "1 shifted left 3 times is 8." },
  { l: 3, q: "What is the output?", code: `char *s = "hello";\nprintf("%c", *(s + 1));`, o: ["h", "e", "l", "An address"], a: 1, w: "s + 1 points to the second character." },
  { l: 3, q: "What is the output?", code: `int x = 20;\nprintf("%d", x / 3 * 3);`, o: ["20", "18", "6", "21"], a: 1, w: "20 / 3 is 6 in int division, and 6 * 3 is 18." }
];

// How many questions of each difficulty per level: [difficulty, count]
const mix = {
  1: [[1, 10]],
  2: [[1, 3], [2, 7]],
  3: [[1, 2], [2, 3], [3, 5]]
};

// Mostly bank questions (no repeats in a round), plus a few generated ones for variety
function make(level, n) {
  const nGen = n >= 5 ? Math.floor(n / 5) : 0;
  const out = pick(bank.filter(x => x.l === level), n - nGen).map(x => {
    const idx = shuffle([0, 1, 2, 3]);
    return { q: x.q, code: x.code, o: idx.map(i => x.o[i]), a: idx.indexOf(x.a), w: x.w };
  });
  const g = gens.filter(x => x.l === level);
  while (out.length < n) out.push(g[rnd(0, g.length - 1)].f(level));
  return out;
}

function build(L) {
  return shuffle(mix[L].flatMap(([level, n]) => make(level, n)));
}

let L = 1, qs = [], i = 0, score = 0, streak = 0, locked = false;
const show = id => document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id == id));

document.querySelectorAll("#levels .pill").forEach(b => b.onclick = () => {
  document.querySelectorAll("#levels .pill").forEach(x => x.classList.remove("active"));
  b.classList.add("active"); L = +b.dataset.l;
});

function start() { qs = build(L); i = 0; score = 0; streak = 0; show("game"); render(); }

function render() {
  locked = false; const q = qs[i];
  $("count").textContent = `Question ${i + 1} of ${qs.length}`;
  $("streak").textContent = streak > 1 ? `🔥 ${streak} in a row` : "";
  $("barFill").style.width = (i / qs.length * 100) + "%";
  $("qText").textContent = q.q;
  $("code").textContent = q.code || ""; $("code").hidden = !q.code;
  $("why").textContent = ""; $("nextBtn").hidden = true; $("opts").innerHTML = "";
  q.o.forEach((t, j) => {
    const b = document.createElement("button");
    b.innerHTML = `<i>${"ABCD"[j]}</i>`; b.append(t);
    b.style.animationDelay = j * 70 + "ms";
    b.onclick = () => answer(j, b);
    $("opts").append(b);
  });
}

function answer(j, btn) {
  if (locked) return; locked = true;
  const q = qs[i], all = $("opts").children;
  if (j == q.a) { score++; streak++; btn.classList.add("right"); }
  else { streak = 0; btn.classList.add("wrong"); all[q.a].classList.add("right"); }
  [...all].forEach(b => b.classList.add("done"));
  $("streak").textContent = streak > 1 ? `🔥 ${streak} in a row` : "";
  $("why").textContent = (j == q.a ? "Correct! " : "Not quite. ") + q.w;
  $("nextBtn").textContent = i == qs.length - 1 ? "See result →" : "Next →";
  $("nextBtn").hidden = false;
  $("barFill").style.width = ((i + 1) / qs.length * 100) + "%";
}

$("nextBtn").onclick = () => { i++; i < qs.length ? render() : finish(); };

function finish() {
  show("end"); $("scoreTotal").textContent = "/ " + qs.length;
  let n = 0;
  const t = setInterval(() => { $("scoreNum").textContent = n; if (n >= score) clearInterval(t); n++; }, 90);
  const r = score / qs.length;
  $("msg").textContent = r >= .8 ? "Brilliant. You really know your C." : r >= .5 ? "Solid work. One more round to level up." : "Good start. Every wrong answer is a lesson, so try again!";
  if (r >= .8) confetti();
}

function confetti() {
  for (let k = 0; k < 40; k++) {
    const d = document.createElement("span"); d.className = "dot";
    d.style.cssText = `left:${rnd(0, 100)}vw;background:${["#d8e38f", "#6f9d5f", "#f5f2e9"][k % 3]};animation-delay:${Math.random() * .8}s;animation-duration:${2 + Math.random() * 2}s`;
    document.body.append(d); setTimeout(() => d.remove(), 4500);
  }
}

$("startBtn").onclick = start;
$("againBtn").onclick = () => show("start");