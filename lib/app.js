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
