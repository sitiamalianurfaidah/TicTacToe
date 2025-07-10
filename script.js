const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const themeToggle = document.querySelector("#themeToggle");

let gameMode = null; // 'pvp' or 'pvc'
let humanPlayer = "X";
let computerPlayer = "O";

window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        document.getElementById("scrollProgress").style.width = scrollPercent + "%";
    });

function setGameMode(mode) {
    gameMode = mode;

    // Sembunyikan pilihan mode
    document.querySelector(".mode-selection").style.display = "none";

    // Tampilkan bagian game
    document.getElementById("game-section").style.display = "flex";

    // Aktifkan pemilihan X/O
    document.getElementById("header").style.display = "flex";
}


function choosePlayer(player) {
    currentPlayer = player;
    humanPlayer = player;
    computerPlayer = (player === "X") ? "O" : "X";

    document.getElementById("xPlayerDisplay").classList.remove("player-active");
    document.getElementById("oPlayerDisplay").classList.remove("player-active");
    document.getElementById(`${player.toLowerCase()}PlayerDisplay`).classList.add("player-active");

    document.getElementById("xPlayerDisplay").style.pointerEvents = "none";
    document.getElementById("oPlayerDisplay").style.pointerEvents = "none";

    initializeGame();

    // jika AI yang jalan duluan
    if (gameMode === 'pvc' && currentPlayer === computerPlayer) {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    if (!running) return;
    let emptyIndices = options.map((val, idx) => val === "" ? idx : null).filter(i => i !== null);
    if (emptyIndices.length === 0) return;

    let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const cell = cells[randomIndex];

    updateCell(cell, randomIndex);
    checkWinner();
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;

    // kalau mode vs komputer dan sekarang giliran komputer
    if (gameMode === 'pvc' && currentPlayer === computerPlayer && running) {
        setTimeout(computerMove, 500);
    }
}

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        restartBtn.style.visibility = "visible";
        showConfetti();
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
        restartBtn.style.visibility = "visible";
    }
    else{
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
    restartBtn.style.visibility = "hidden";
}

function toggleTheme() {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    themeToggle.innerText = isLight ? "🌞" : "🌙";
}
function showConfetti() {
    const colors = ["#A737FF", "#1892EA", "#FF5F6D", "#FFC371", "#42E695"];
    const numConfetti = 100;
    const audio = new Audio("win-sound.mp3");
        audio.play();

    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.opacity = Math.random();
        document.body.appendChild(confetti);

        // Hapus confetti setelah animasi selesai
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

    setTimeout(() => {
        confetti.remove();
    }, 1500);

