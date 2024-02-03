const output = document.getElementById("output");
const input = document.getElementById("input");
const lastLoginDate = document.getElementById("lastLoginDate");
const suggestionBox = document.getElementById("suggestionBox");

let commandHistory = [];
let historyIndex = -1;
let currentIndex = -1;

const COMMANDS = {
  clear: () => (output.innerHTML = ""),
  help: () => displayHelp(),
  quote: () => fetchQuote(),
  double: (arg) => doubleNumber(arg),
};

const CUSTOM_COMMANDS = {
  hello: { msg: "Hello :)" },
  boom: {
    msg: "Displays fireworks.",
    action: displayFireworks,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  displayLastLogin();
  displayHelp();
});

function displayFireworks() {
  const duration = 3000;

  for (let i = 0; i < 50; i++) {
    const dot = document.createElement("div");
    dot.className = "firework-dot";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 2}s`;
    output.appendChild(dot);
  }

  setTimeout(() => {
    const dots = document.querySelectorAll(".firework-dot");
    dots.forEach((dot) => dot.remove());
  }, duration);
}

const displayHelp = () => {
  const helpEntries = [
    { command: "clear", description: "Clears the terminal." },
    {
      command: "help",
      description: "Displays this list of available commands.",
    },
    { command: "quote", description: "Fetches a random quote." },
    { command: "double X", description: "Doubles the number X." },
    ...Object.keys(CUSTOM_COMMANDS).map((cmd) => ({
      command: cmd,
      description: CUSTOM_COMMANDS[cmd].msg,
    })),
  ];

  let helpHTML =
    "<h4>List of Available Commands:</h4><ul style='line-height: 1.5;'>";
  helpEntries.forEach((entry) => {
    helpHTML += `<li>${entry.command} - ${entry.description}</li>`;
  });
  helpHTML += "</ul>";
  addLineToTerminal("terminal", helpHTML, true);
};

const fetchQuote = () => {
  fetch("https://dummyjson.com/quotes/random")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) =>
      addLineToTerminal("terminal", `${data.quote} - ${data.author}`)
    )
    .catch((error) => addLineToTerminal("terminal", `Error: ${error.message}`));
};

const doubleNumber = (arg) => {
  if (arg === undefined || arg === null) {
    addLineToTerminal("terminal", "Please enter a number to double.");
  } else {
    const numberString = arg.replace(",", ".");
    const number = parseFloat(numberString);
    if (!isNaN(number)) {
      addLineToTerminal("terminal", `${arg} * 2 = ${number * 2}`);
    } else {
      addLineToTerminal("terminal", `'${arg}' is not a number.`);
    }
  }
};

const addLineToTerminal = (sender, message, isHTML = false) => {
  const line = document.createElement("div");
  line.className = `terminal__line${
    sender === "you" ? "" : " terminal__line--response"
  }`;

  if (isHTML) {
    line.innerHTML = `${sender}: ${message}`;
  } else {
    line.textContent = `${sender}: ${message}`;
  }

  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
};

function displaySuggestions(input) {
  const suggestions = filterCommands(input);
  suggestionBox.innerHTML = "";
  suggestions.forEach((suggestion, index) => {
    const div = document.createElement("div");
    div.textContent = suggestion;
    div.classList.add("suggestion");
    div.setAttribute("data-index", index);
    div.onmousedown = () => selectSuggestion(suggestion);
    suggestionBox.appendChild(div);
  });
  currentIndex = -1;
  attachSuggestionClickEvent();
}

function highlightSuggestion() {
  document.querySelectorAll(".suggestion").forEach((div, index) => {
    if (index === currentIndex) {
      div.classList.add("highlighted");
    } else {
      div.classList.remove("highlighted");
    }
  });
}

function selectSuggestion(suggestion) {
  input.value = "";
  suggestionBox.innerHTML = "";
  currentIndex = -1;
  commandHistory.push(suggestion);
  historyIndex = commandHistory.length;
  executeCommand(suggestion);
}

function attachSuggestionClickEvent() {
  const suggestions = document.querySelectorAll(".suggestion");
  suggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedSuggestion = suggestion.textContent;
      selectSuggestion(selectedSuggestion);
    });
  });
}

const maxHistorySize = 10;
const executeCommand = (commandText) => {
  const [command, ...args] = commandText.split(" ");
  addLineToTerminal("you", commandText);
  suggestionBox.innerHTML = "";
  currentIndex = -1;

  if (COMMANDS[command]) {
    COMMANDS[command](...args);
  } else if (CUSTOM_COMMANDS[command]) {
    if (CUSTOM_COMMANDS[command].msg) {
      addLineToTerminal("terminal", CUSTOM_COMMANDS[command].msg);
    }
    if (commandHistory.length > maxHistorySize) {
      commandHistory.shift();
    }
    if (CUSTOM_COMMANDS[command].action) {
      CUSTOM_COMMANDS[command].action();
    }
  } else {
    addLineToTerminal(
      "terminal",
      `Command '${command}' not recognized. Type 'help' for a list of available commands.`
    );
  }
};

function filterCommands(input) {
  const allCommands = [
    ...Object.keys(COMMANDS),
    ...Object.keys(CUSTOM_COMMANDS),
  ];
  return allCommands.filter((cmd) => cmd.startsWith(input));
}

function handleKeyDown(e) {
  const { key } = e;
  const suggestions = document.querySelectorAll(".suggestion");
  const isSuggestionVisible = suggestions.length > 0;

  if (key === "Enter") {
    if (
      isSuggestionVisible &&
      currentIndex >= 0 &&
      currentIndex < suggestions.length
    ) {
      selectSuggestion(suggestions[currentIndex].textContent);
    } else {
      const commandText = input.value;
      input.value = "";
      executeCommand(commandText);
      commandHistory.push(commandText);
      historyIndex = commandHistory.length;
    }
    event.preventDefault();
  } else if (key === "ArrowUp") {
    if (isSuggestionVisible) {
      currentIndex =
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1;
      highlightSuggestion();
    } else if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    }
    event.preventDefault();
  } else if (key === "ArrowDown") {
    if (isSuggestionVisible) {
      currentIndex = (currentIndex + 1) % suggestions.length;
      highlightSuggestion();
    } else if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    }
    event.preventDefault();
  }
}

const displayLastLogin = () => {
  const lastLoginString =
    localStorage.getItem("lastLoginDate") || new Date().toISOString();
  const lastLogin = new Date(lastLoginString);
  const formattedDate = lastLogin.toUTCString();

  lastLoginDate.textContent = formattedDate;
};

input.addEventListener("keydown", handleKeyDown);

input.addEventListener("input", (e) => {
  displaySuggestions(e.target.value);
});

input.addEventListener("blur", () => {
  suggestionBox.innerHTML = "";
});
