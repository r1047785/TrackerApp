// Elementen ophalen
const dateInput = document.getElementById("date");
const songMemoryInput = document.getElementById("songMemoryInput");
const addInputBtn = document.getElementById("addInputBtn");
const addMemoryBtn = document.getElementById("addMemoryBtn");
const memoryList = document.getElementById("memoryList");
const historyList = document.getElementById("historyList");
const historyStats = document.getElementById("historyStats");
const totalMemories = document.getElementById("totalMemories");

// Standaarddatum instellen op vandaag
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

// Klikfunctie voor de + knop
addInputBtn.addEventListener("click", function () {
  addMemory();
});

// Klikfunctie voor de "herinnering toevoegen"-knop
addMemoryBtn.addEventListener("click", function () {
  addMemory();
});

// Ondersteuning voor Enter-toets
songMemoryInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addMemory();
  }
});

// Functie om een herinnering toe te voegen
function addMemory() {
  const inputValue = songMemoryInput.value.trim();
  const selectedDate = dateInput.value;

  // Validatie
  if (!inputValue) {
    alert("Please enter a song title and memory");
    return;
  }

  if (!inputValue.includes(",")) {
    alert('Please use the format "Title,Memory"');
    return;
  }

  // Invoer splitsen
  const [songTitle, memory] = inputValue.split(",", 2);

  if (!songTitle || !memory) {
    alert("Please enter both a song title and memory");
    return;
  }

  // Bestaande herinneringen ophalen of lege array maken
  const memories = JSON.parse(localStorage.getItem("songMemories") || "[]");

  // Nieuwe herinnering toevoegen
  memories.push({
    date: selectedDate,
    song: songTitle.trim(),
    memory: memory.trim(),
    timestamp: new Date().toISOString(),
  });

  // Opslaan in localStorage
  localStorage.setItem("songMemories", JSON.stringify(memories));

  // Invoer leegmaken
  songMemoryInput.value = "";

  // Beide lijsten opnieuw laden
  loadMemories();
  loadHistory();
}

// Herinneringen laden voor geselecteerde dag
function loadMemories() {
  const memories = JSON.parse(localStorage.getItem("songMemories") || "[]");
  const selectedDate = dateInput.value;

  // Filter herinneringen voor geselecteerde datum
  const todayMemories = memories.filter((item) => item.date === selectedDate);

  // Huidige lijst leegmaken
  memoryList.innerHTML = "";

  if (todayMemories.length === 0) {
    memoryList.innerHTML =
      '<p style="text-align: center; color: #666;">No memories for this date yet.</p>';
    return;
  }

  // Sorteren op nieuwste eerst
  todayMemories.sort(
    (a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
  );

  // Elke herinnering tonen
  todayMemories.forEach((item) => {
    const memoryElement = document.createElement("div");
    memoryElement.className = "memory-item";

    const formattedDate = new Date(item.date).toLocaleDateString();

    memoryElement.innerHTML = `
              <div class="memory-date">${formattedDate}</div>
              <div class="memory-song">${item.song}</div>
              <div class="memory-text">${item.memory}</div>
            `;

    memoryList.appendChild(memoryElement);
  });
}

// Volledige geschiedenis laden
function loadHistory() {
  const memories = JSON.parse(localStorage.getItem("songMemories") || "[]");

  // Statistieken bijwerken
  totalMemories.textContent = memories.length;

  // Huidige geschiedenislijst leegmaken
  historyList.innerHTML = "";

  if (memories.length === 0) {
    historyList.innerHTML =
      '<div class="no-history">No memories saved yet. Start adding some!</div>';
    return;
  }

  // Sorteren op nieuwste eerst
  memories.sort(
    (a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
  );

  // Elke herinnering tonen in geschiedenis
  memories.forEach((item) => {
    const historyElement = document.createElement("div");
    historyElement.className = "history-item";

    const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    historyElement.innerHTML = `
              <div class="history-date">${formattedDate}</div>
              <div class="history-song">♪ ${item.song}</div>
              <div class="history-memory">${item.memory}</div>
            `;

    historyList.appendChild(historyElement);
  });
}

// Herinneringen opnieuw laden wanneer de datum verandert
dateInput.addEventListener("change", function () {
  loadMemories();
});
