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
const footer = document.getElementById(`footer`);

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
fetch("https://api.github.com/users/Mnunez1001/repos")
    .then(response => response.json())
    .then(repositories => {
        console.log(repositories);

        const projectSection = document.getElementById("projects");
        const projectList = projectSection.querySelector("ul");

        for (let i = 0; i < repositories.length; i++) {
            const project = document.createElement("li");
            project.innerText = repositories[i].name;
            projectList.appendChild(project);
        }
    })
    .catch(function (error) {
        console.log("An error occurred:", error);
        const projectSection = document.getElementById("projects");
        const projectList = projectSection.querySelector("ul");
        const errorMessage = document.createElement("li");
        errorMessage.innerText = "Unable to load GitHub repositories. Please try again later.";
        projectList.appendChild(errorMessage);
    });