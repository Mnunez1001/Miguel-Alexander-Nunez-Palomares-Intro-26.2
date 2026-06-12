// Footer with dynamic year and copyright information
const footer = document.getElementById("footer");
const copyright = document.createElement("p");

const today = new Date();
const thisYear = today.getFullYear();

copyright.innerHTML = `© ${thisYear} Miguel Alexander Nunez Palomares`;
footer.appendChild(copyright);

// Dark mode toggle///////////////////////////////////////////////////////////////////////////////////////////////////
const darkModeToggle = document.getElementById("dark-mode-toggle");

function enableDarkMode() {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerText = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    darkModeToggle.innerText = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
}

if (localStorage.getItem("theme") === "dark") {
    enableDarkMode();
}

darkModeToggle.addEventListener("click", function () {
    if (document.body.classList.contains("dark-mode")) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// ChatBot code////////////////////////////////////////////////////////////////////////////////////////////////////
(function () {
  const BOT_URL = "https://portfolio-faq-bot.onrender.com/ask";

  const openBtn = document.getElementById("faqOpen");
  const closeBtn = document.getElementById("faqClose");
  const widget = document.getElementById("faqWidget");
  const askBtn = document.getElementById("faqSend");
  const qEl = document.getElementById("faqQ");
  const aEl = document.getElementById("faqA");
  const statusEl = document.getElementById("faqStatus");

  if (!openBtn || !closeBtn || !widget || !askBtn || !qEl || !aEl || !statusEl)
    return;

  openBtn.addEventListener("click", function () {
    widget.hidden = false;
    qEl.focus();
  });

  closeBtn.addEventListener("click", function () {
    widget.hidden = true;
  });

  let portfolioKnowledge = "";

  async function loadPortfolioData() {
    try {
      const response = await fetch("data/portfolio-data.json");

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      portfolioKnowledge = JSON.stringify(data);
    } catch (error) {
      console.error("Portfolio data could not be loaded:", error);
    }
  }

  loadPortfolioData();

  function buildContext() {
    const pageContext = [
      document.querySelector("#about")?.innerText || "",
      document.querySelector("#experience")?.innerText || "",
      document.querySelector("#skills")?.innerText || "",
      document.querySelector("#projects")?.innerText || "",
      document.querySelector("#connect")?.innerText || "",
    ];

    return `
    Portfolio Knowledge Base:
    ${portfolioKnowledge}

    Current Page Context:
    ${pageContext.join("\n\n")}
  `
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 7000);
  }

  async function ask() {
    const question = qEl.value.trim();

    if (!question) {
      statusEl.textContent = "Please enter a question first.";
      return;
    }

    statusEl.textContent = "Thinking...";
    aEl.textContent = "";
    askBtn.disabled = true;

    try {
      const response = await fetch(BOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context: buildContext() }),
      });

      const data = await response.json();

      if (data.answer) {
        aEl.textContent = data.answer;
        statusEl.textContent = "Done.";
      } else {
        statusEl.textContent = "Sorry, I could not answer that.";
      }
    } catch (error) {
      statusEl.textContent = "Network error. Please try again.";
    } finally {
      askBtn.disabled = false;
    }
  }

  askBtn.addEventListener("click", ask);

  qEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      ask();
    }
  });
})();
