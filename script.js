// ---------- Data ----------
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivational" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Wisdom" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Motivational" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "Tech" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Tech" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "Tech" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Tech" },
  { text: "Do or do not. There is no try.", author: "Yoda", category: "Wisdom" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Motivational" },
  { text: "I'm not lazy, I'm just on my energy-saving mode.", author: "Unknown", category: "Funny" },
  { text: "I told my computer I needed a break, and now it won't stop sending me KitKats.", author: "Unknown", category: "Funny" },
  { text: "There are only 10 types of people: those who understand binary and those who don't.", author: "Unknown", category: "Funny" },
  { text: "Security is always excessive until it's not enough.", author: "Robbie Sinclair", category: "Cybersecurity" },
  { text: "The only truly secure system is one that is powered off.", author: "Gene Spafford", category: "Cybersecurity" },
  { text: "Amateurs hack systems, professionals hack people.", author: "Bruce Schneier", category: "Cybersecurity" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Motivational" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Motivational" },
  { text: "Knowledge is power.", author: "Francis Bacon", category: "Wisdom" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", category: "Wisdom" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", category: "Tech" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson", category: "Tech" },
  { text: "A computer once beat me at chess, but it was no match for me at kickboxing.", author: "Emo Philips", category: "Funny" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivational" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien", category: "Wisdom" }
];

// ---------- State ----------
let currentQuote = null;
let autoplayTimer = null;

// ---------- Elements ----------
const quoteCard = document.getElementById("quoteCard");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteCategory = document.getElementById("quoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const copyBtn = document.getElementById("copyBtn");
const tweetBtn = document.getElementById("tweetBtn");
const autoplayToggle = document.getElementById("autoplayToggle");
const darkModeToggle = document.getElementById("darkModeToggle");

// ---------- Category options ----------
function renderCategoryOptions() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat === "all" ? "All categories" : cat}</option>`)
    .join("");
}

// ---------- Quote logic ----------
function getFilteredQuotes() {
  const selected = categoryFilter.value;
  return selected === "all" ? quotes : quotes.filter(q => q.category === selected);
}

function pickRandomQuote() {
  const pool = getFilteredQuotes();
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  let next;
  do {
    next = pool[Math.floor(Math.random() * pool.length)];
  } while (currentQuote && next.text === currentQuote.text);
  return next;
}

function renderQuote(quote) {
  if (!quote) {
    quoteText.textContent = "No quotes in this category yet.";
    quoteAuthor.textContent = "";
    quoteCategory.textContent = "";
    return;
  }
  quoteCard.classList.add("fade");
  setTimeout(() => {
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = `— ${quote.author}`;
    quoteCategory.textContent = quote.category;
    updateTweetLink(quote);
    quoteCard.classList.remove("fade");
  }, 200);
}

function newQuote() {
  currentQuote = pickRandomQuote();
  renderQuote(currentQuote);
}

// ---------- Copy to clipboard ----------
copyBtn.addEventListener("click", async () => {
  if (!currentQuote) return;
  const fullText = `"${currentQuote.text}" — ${currentQuote.author}`;
  try {
    await navigator.clipboard.writeText(fullText);
    copyBtn.textContent = "✅ Copied!";
  } catch {
    copyBtn.textContent = "⚠️ Copy failed";
  }
  setTimeout(() => (copyBtn.textContent = "📋 Copy"), 1500);
});

// ---------- Tweet link ----------
function updateTweetLink(quote) {
  const tweetText = encodeURIComponent(`"${quote.text}" — ${quote.author}`);
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${tweetText}`;
}

// ---------- Category filter ----------
categoryFilter.addEventListener("change", newQuote);

// ---------- Autoplay ----------
autoplayToggle.addEventListener("change", () => {
  if (autoplayToggle.checked) {
    autoplayTimer = setInterval(newQuote, 8000);
  } else {
    clearInterval(autoplayTimer);
  }
});

// ---------- Dark mode ----------
function applySavedTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
  darkModeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

darkModeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  darkModeToggle.textContent = next === "dark" ? "☀️" : "🌙";
});

// ---------- Keyboard shortcut ----------
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "SELECT") {
    e.preventDefault();
    newQuote();
  }
});

// ---------- Buttons ----------
newQuoteBtn.addEventListener("click", newQuote);

// ---------- Init ----------
applySavedTheme();
renderCategoryOptions();
newQuote();