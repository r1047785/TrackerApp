document.addEventListener("DOMContentLoaded", function () {
  // Haal elementen op
  const dateInput = document.getElementById("date");
  const songMemoryInput = document.getElementById("songMemoryInput");
  const addInputBtn = document.getElementById("addInputBtn");
  const addMemoryBtn = document.getElementById("addMemoryBtn");
  const memoryList = document.getElementById("memoryList");
  const historyList = document.getElementById("historyList");
  const historyStats = document.getElementById("historyStats");
  const totalMemories = document.getElementById("totalMemories");
  const moodOptions = document.querySelectorAll(".mood-option");

  // Stel standaarddatum in op vandaag
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  // Standaard gemoedstoestand selectie
  let selectedMood = "normal";

  // Laad herinneringen bij het laden van de pagina
  loadMemories();
  loadHistory();

  // Functionaliteit voor gemoedstoestand-selector
  moodOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Verwijder actieve klasse van alle opties
      moodOptions.forEach((opt) => opt.classList.remove("active"));

      // Voeg actieve klasse toe aan aangeklikte optie
      this.classList.add("active");

      // Update geselecteerde gemoedstoestand
      selectedMood = this.getAttribute("data-mood");
    });
  });

  // Klikfunctie voor + knop
  addInputBtn.addEventListener("click", function () {
    addMemory();
  });

  // Voeg herinnering toe knop
  addMemoryBtn.addEventListener("click", function () {
    addMemory();
  });

  // Ondersteuning voor Enter-toets
  songMemoryInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addMemory();
    }
  });

  // Functie om herinnering toe te voegen
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

    // Splits invoer
    const [songTitle, memory] = inputValue.split(",", 2);

    if (!songTitle || !memory) {
      alert("Please enter both a song title and memory");
      return;
    }

    // Haal bestaande herinneringen op of maak lege array
    const memories = JSON.parse(localStorage.getItem("songMemories") || "[]");

    // Haal emoji voor gemoedstoestand op
    const moodEmojis = {
      sad: "😢",
      normal: "😐",
      happy: "😊",
    };

    // Voeg nieuwe herinnering toe met gemoedstoestand
    memories.push({
      date: selectedDate,
      song: songTitle.trim(),
      memory: memory.trim(),
      mood: selectedMood,
      moodEmoji: moodEmojis[selectedMood],
      timestamp: new Date().toISOString(),
    });

    // Sla op in localStorage
    localStorage.setItem("songMemories", JSON.stringify(memories));

    // Maak invoerveld leeg
    songMemoryInput.value = "";

    // Herlaad beide lijsten
    loadMemories();
    loadHistory();
  }

  // Laad herinneringen voor de geselecteerde datum
  function loadMemories() {
    const memories = JSON.parse(localStorage.getItem("songMemories") || "[]");
    const selectedDate = dateInput.value;

    // Filter herinneringen voor geselecteerde datum
    const todayMemories = memories.filter((item) => item.date === selectedDate);

    // Maak huidige lijst leeg
    memoryList.innerHTML = "";

    if (todayMemories.length === 0) {
      memoryList.innerHTML =
        '<p style="text-align: center; color: #666;">No memories for this date yet.</p>';
      return;
    }

    // Sorteer op nieuwste eerst
    todayMemories.sort(
      (a, b) =>
        new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
    );

    // Toon elke herinnering
    todayMemories.forEach((item) => {
      const memoryElement = document.createElement("div");
      memoryElement.className = "memory-item";

      const formattedDate = new Date(item.date).toLocaleDateString();
      const moodDisplay = item.moodEmoji || "😐";

      memoryElement.innerHTML = `
              <div class="memory-date">${formattedDate} <span class="memory-mood">${moodDisplay}</span></div>
              <div class="memory-song">${item.song}</div>
              <div class="memory-text">${item.memory}</div>
            `;

      memoryList.appendChild(memoryElement);
    });
  }

  // Laad volledige geschiedenis
  function loadHistory() {
    const memories = JSON.parse(localStorage.getItem("songMemories") || "[]");

    // Update statistieken
    totalMemories.textContent = memories.length;

    // Maak huidige geschiedenislijst leeg
    historyList.innerHTML = "";

    if (memories.length === 0) {
      historyList.innerHTML =
        '<div class="no-history">No memories saved yet. Start adding some!</div>';
      return;
    }

    // Sorteer op nieuwste eerst
    memories.sort(
      (a, b) =>
        new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
    );

    // Toon elke herinnering in de geschiedenis
    memories.forEach((item) => {
      const historyElement = document.createElement("div");
      historyElement.className = "history-item";

      const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const moodDisplay = item.moodEmoji || "😐";

      historyElement.innerHTML = `
              <div class="history-date">
                <span>${formattedDate}</span>
                <span class="history-mood">${moodDisplay}</span>
              </div>
              <div class="history-song">♪ ${item.song}</div>
              <div class="history-memory">${item.memory}</div>
            `;

      historyList.appendChild(historyElement);
    });
  }

  // Herlaad herinneringen wanneer de datum verandert
  dateInput.addEventListener("change", function () {
    loadMemories();
  });
});
