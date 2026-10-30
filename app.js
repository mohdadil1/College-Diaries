const grid = document.querySelector('#grid');
const modal = document.querySelector('#modal');
const content = document.querySelector('#modal-content');
const search = document.querySelector('#search');
const cards = [...grid.querySelectorAll('.card')];
const quoteButton = document.querySelector('#quote-button');
const quoteOutput = document.querySelector('#coding-quote');
const codingQuotes = [
  'It works on my machine is not a deployment strategy.',
  'Every expert was once a beginner who refused to give up.',
  'A bug is just an unexpected feature with excellent timing.',
  'Keep calm and check the console.',
  'The best code is the code you understand tomorrow.',
  'First, solve the problem. Then, write the code.',
  'Programming: turning coffee into errors, then into solutions.',
  'Small commits can lead to big ideas.',
  'There are 10 kinds of people: those who understand binary and those who do not.',
  'You do not have to be perfect. You just have to keep debugging.'
];
let previousQuoteIndex = -1;
let filter = 'All';

function render() {
  const query = search.value.toLowerCase().trim();
  let visibleCount = 0;

  for (const card of cards) {
    const matchesCourse = filter === 'All' || card.dataset.course === filter;
    const matchesSearch = card.textContent.toLowerCase().includes(query);
    card.hidden = !matchesCourse || !matchesSearch;
    if (!card.hidden) visibleCount++;
  }

  document.querySelector('#empty').hidden = visibleCount > 0;
}

function showProfile(card) {
  const image = card.querySelector('.portrait img').cloneNode();
  const name = card.querySelector('h3').textContent;
  const course = card.dataset.course;
  const year = card.querySelector('.year').textContent;
  const story = card.querySelector('.story').textContent;

  content.replaceChildren(image);
  const heading = document.createElement('h2');
  heading.textContent = name;
  const details = document.createElement('p');
  details.textContent = `${course} · ${year}`;
  const diary = document.createElement('p');
  diary.textContent = story;
  content.append(heading, details, diary);
  modal.showModal();
}

function showGuide() {
  content.innerHTML = `<div class="eyebrow">CONTRIBUTION GUIDE</div>
    <h2>Add your own diary.</h2>
    <p>Add one HTML card to the students section. No JSON or JavaScript edits are needed.</p>
    <ol>
      <li>Fork and clone the class GitHub repository.</li>
      <li>Create a branch: <code>git switch -c profile/your-name</code></li>
      <li>Open <code>index.html</code> and copy a student card inside the <code>id="grid"</code> section. Change the name, course, year, introduction, skills and diary story.</li>
      <li>Add your photo at <code>images/your-name.jpg</code> and update the card's image path.</li>
      <li>Run the website locally and check your profile.</li>
      <li>Commit and push your changes, then open a pull request to your teacher's repository. Include a screenshot.</li>
    </ol>
    <pre>git add index.html images/your-name.jpg
git commit -m "Add my student profile"
git push -u origin profile/your-name</pre>
    <p>The teacher reviews and merges each contribution.</p>`;
  modal.showModal();
}

search.addEventListener('input', render);
quoteButton.addEventListener('click', () => {
  const availableQuotes = codingQuotes
    .map((quote, index) => ({ quote, index }))
    .filter(({ index }) => index !== previousQuoteIndex);
  const nextQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  previousQuoteIndex = nextQuote.index;
  quoteOutput.textContent = nextQuote.quote;
});
document.querySelector('#filters').addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  filter = button.dataset.filter;
  document.querySelectorAll('#filters button').forEach(item => {
    item.classList.toggle('active', item === button);
  });
  render();
});
grid.addEventListener('click', event => {
  const button = event.target.closest('.view');
  if (button) showProfile(button.closest('.card'));
});
document.querySelector('#guide').addEventListener('click', showGuide);
document.querySelector('#guide2').addEventListener('click', showGuide);
document.querySelector('.close').addEventListener('click', () => modal.close());

/* College Diaries - dark mode toggle (upgraded)
   Add just before </body>:  <script src="theme-toggle.js"></script>

   What it does:
   - Starts in the visitor's saved choice, else their device setting
   - Toggles the class "dark-mode" on <html>
   - Updates the button label + aria-pressed
   - Remembers the choice between visits
   - Follows device changes until the visitor picks manually
   - Syncs across open tabs
*/
(function () {
  "use strict";

  var root = document.documentElement;
  var KEY = "theme";
  var CLASS = "dark-mode";
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }

  function initialTheme() {
    return getSaved() || (media && media.matches ? "dark" : "light");
  }

  var button = document.getElementById("theme-toggle");

  // No button in the HTML? Create a floating one.
  if (!button) {
    button = document.createElement("button");
    button.id = "theme-toggle";
    button.type = "button";
    button.className = "floating";
    document.body.appendChild(button);
  }

  function apply(theme) {
    var isDark = theme === "dark";
    root.classList.toggle(CLASS, isDark);

    // Label shows what clicking will do
    button.textContent = isDark ? "\u2600\uFE0F Light mode" : "\uD83C\uDF19 Dark mode";
    button.setAttribute("aria-pressed", String(isDark));

    // Mobile browser bar color (optional nicety)
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = isDark ? "#121212" : "#ffffff";
  }

  apply(initialTheme());

  button.addEventListener("click", function () {
    var next = root.classList.contains(CLASS) ? "light" : "dark";
    apply(next);
    save(next);
  });

  // Follow the device only while the visitor hasn't chosen manually
  if (media) {
    var onSystemChange = function (e) {
      if (!getSaved()) apply(e.matches ? "dark" : "light");
    };
    if (media.addEventListener) media.addEventListener("change", onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange); // older Safari
  }

  // Keep other open tabs of the site in sync
  window.addEventListener("storage", function (e) {
    if (e.key === KEY && e.newValue) apply(e.newValue);
  });

  // Turn on transitions after first paint so the page doesn't animate on load
  requestAnimationFrame(function () { root.classList.add("theme-ready"); });
})();