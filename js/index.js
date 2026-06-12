// New footer element////////////////////////////////////////////////////////////////////////////////////////////////
const footer = document.getElementById(`footer`);

// New paragraph element for the copyright
const copyright = document.createElement("p");

// Current year
const today = new Date();
const thisYear = today.getFullYear();

// inner HTML of the copyright element
copyright.innerHTML = `© ${thisYear} Miguel Alexander Nunez Palomares`;

// copyright element appended to the footer
footer.appendChild(copyright);

// footer appended to the body of the document
//document.body.appendChild(footer);

// New message form code////////////////////////////////////////////////////////////////////////////////////////////////
const contactForm = document.getElementById("contactForm");
const contactBtn = document.getElementById("contactSubmit");
const formStatus = document.getElementById("formStatus");

if (contactForm && contactBtn && formStatus) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    formStatus.textContent = "";
    contactBtn.disabled = true;
    contactBtn.textContent = "Sending...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });

      if (response.ok) {
        formStatus.textContent = "Thanks! Your message has been sent.";
        contactForm.reset();
      } else {
        formStatus.textContent =
          "Oops, something went wrong. Please try again later.";
      }
    } catch (error) {
      formStatus.textContent =
        "Network error. Check your connection and try again.";
    } finally {
      contactBtn.disabled = false;
      contactBtn.textContent = "Send Message";
    }
  });
}

// GitHub repositories section/////////////////////////////////////////////////////////////////////////////////////////////////
async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
}

async function loadGitHubRepositories() {
  try {
    const repositories = await fetchJson(
      "https://api.github.com/users/Mnunez1001/repos",
    );

    const projectSection = document.getElementById("projects");
    const projectList = projectSection.querySelector("ul");

    for (let i = 0; i < repositories.length; i++) {
      const project = document.createElement("li");
      project.innerText = repositories[i].name;
      projectList.appendChild(project);
    }
  } catch (error) {
    console.error("GitHub repositories error:", error);

    const projectSection = document.getElementById("projects");
    const projectList = projectSection.querySelector("ul");

    const errorMessage = document.createElement("li");
    errorMessage.innerText =
      "Unable to load GitHub repositories. Please try again later.";
    projectList.appendChild(errorMessage);
  }
}

async function loadGitHubProfileStats() {
  try {
    const profile = await fetchJson("https://api.github.com/users/Mnunez1001");

    document.getElementById("public-repos").innerText = profile.public_repos;
    document.getElementById("github-followers").innerText = profile.followers;
    document.getElementById("github-following").innerText = profile.following;
  } catch (error) {
    console.error("GitHub profile error:", error);
  }
}

loadGitHubRepositories();
loadGitHubProfileStats();

// Copy email address to clipboard when clicked /////////////////////////////////////////////////////////////////////////////////////////////////

const copyEmailButton = document.getElementById("copy-email-button");
const emailText = document.getElementById("email-text");

copyEmailButton.addEventListener("click", function () {
  navigator.clipboard.writeText(emailText.innerText);

  copyEmailButton.innerText = "Copied!";

  setTimeout(function () {
    copyEmailButton.innerText = "Copy Email";
  }, 2000);
});

// Dark Mode Code /////////////////////////////////////////////////////////////////////////////////////////////////

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
      const response = await fetch("../data/portfolio-data.json");

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
