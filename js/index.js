// Skill section code (for now)
const skills = [
  "JavaScript",
  "HTML",
  "CSS",
  "Git",
  "GitHub",
  "Python",
  "Java",
  "MySQL",
  "Networking",
  "Cyber Security",
];

const skillsSection = document.getElementById("skills");
const skillsList = skillsSection.querySelector("ul");

for (let i = 0; i < skills.length; i++) {
  const skill = document.createElement("li");
  skill.innerText = skills[i];
  skillsList.appendChild(skill);
}

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
const messageForm = document.querySelector("form[name='leave_message']");

messageForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const usersName = event.target.usersName.value;
  const usersEmail = event.target.usersEmail.value;
  const usersMessage = event.target.usersMessage.value;

  console.log(usersName, usersEmail, usersMessage);

  const messageSection = document.getElementById("messages");
  const messageList = messageSection.querySelector("ul");

  const newMessage = document.createElement("li");

  newMessage.innerHTML = `
        <a href="mailto:${usersEmail}">${usersName}</a>
        <span>${usersMessage}</span>
    `;

  const removeButton = document.createElement("button");
  removeButton.innerText = "remove";
  removeButton.type = "button";

  removeButton.addEventListener("click", function () {
    const entry = removeButton.parentNode;
    entry.remove();
  });

  newMessage.appendChild(removeButton);
  messageList.appendChild(newMessage);

  messageForm.reset();
});

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
