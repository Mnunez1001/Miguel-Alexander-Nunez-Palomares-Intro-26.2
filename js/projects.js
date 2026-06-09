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