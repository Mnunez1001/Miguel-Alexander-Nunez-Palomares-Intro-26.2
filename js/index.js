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
    "Cyber Security"
];

const skillsSection = document.getElementById("skills");
const skillsList = skillsSection.querySelector("ul");

for (let i = 0; i < skills.length; i++) {
    const skill = document.createElement("li");
    skill.innerText = skills[i];
    skillsList.appendChild(skill);
}

// New footer element////////////////////////////////////////////////////////////////////////////////////////////////
const footer = document.createElement("footer");

// New paragraph element for the copyright
const copyright = document.createElement("p");

// Current year
const today = new Date();
const thisYear = today.getFullYear();

// inner HTML of the copyright element 
copyright.innerHTML = `Miguel Alexander Nunez Palomares © ${thisYear}`;

// copyright element appended to the footer
footer.appendChild(copyright);

// footer appended to the body of the document
document.body.appendChild(footer);
