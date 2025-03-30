document.addEventListener("DOMContentLoaded", function () {
  // Dit zorgt er voor dat ik de elementen ophaal
  const dateInput = document.getElementById("date");
  const songMemoryInput = document.getElementById("songMemoryInput");
  const addInputBtn = document.getElementById("addInputBtn");
  const addMemoryBtn = document.getElementById("addMemoryBtn");
  const memoryList = document.getElementById("memoryList");

  // Zet de Default datum naar vandaan
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  // dit zorgt ervoor dat de memories worden geladen op de pagina
  loadMemories();

  // de click functie voor de + knop.
  addInputBtn.addEventListener("click", function () {
    addMemory();
  });

  // de knop voor de add momory knop
  addMemoryBtn.addEventListener("click", function () {
    addMemory();
  });

  // Test, dit zorgt ervoor dat ik ook "enter" kan drukken in de textfield
  songMemoryInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addMemory();
    }
  });

  // Functiie voor add memory
  function addMemory() {
    const inputValue = songMemoryInput.value.trim();
    const selectedDate = dateInput.value;

    // Geeft een alert melding als je niks invult.
    if (!inputValue) {
      alert("Please enter a song title and memory");
      return;
    }

    // Checkt of je de vologorde wel goed hebt ingedient.
    if (!inputValue.includes(",")) {
      alert('Please use the format "Title,Memory"');
      return;
    }

    // Split de input die je indient.
    const [songTitle, memory] = inputValue.split(",", 2);

    if (!songTitle || !memory) {
      alert("Please enter both a song title and memory");
      return;
    }

    // haalt bestaande herinnering of creert een nieuwe lege array
    const memories = JSON.parse(localStorage.getItem("songMemories") || "[]");

    // voegt nieuwe memory toe
    memories.push({
      date: selectedDate,
      song: songTitle.trim(),
      memory: memory.trim(),
    });

    // slaag op in localstorage
    localStorage.setItem("songMemories", JSON.stringify(memories));

    // Cleart de input
    songMemoryInput.value = "";

    loadMemories();
  }

  // Functie die de memories laad en ook toont op het scherm.
  function loadMemories() {
    const memories = JSON.parse(localStorage.getItem("songMemories") || "[]");

    // Cleart de current list
    memoryList.innerHTML = "";

    // als er nog geen memories zijn komt deze text.
    if (memories.length === 0) {
      memoryList.innerHTML =
        '<p style="text-align: center; color: #666;">No memories saved yet.</p>';
      return;
    }

    // sorteert de datums (nieuwste bovenaan)
    memories.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display elke memory
    memories.forEach((item) => {
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
});
