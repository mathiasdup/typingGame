const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

//VARIABLES

let arrayOfWord = [];
let score = 0;
let time = 10;
text.focus();

// LOCAL STORAGE

let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "easy";

function updateLocalStorage() {
  localStorage.setItem("difficulty", difficulty);
}

difficultySelect.value =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "easy";

// Pick a random word

var callback = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

function fetchWords(numberOfWords, callback) {
  fetch(`https://random-word-api.herokuapp.com/word?number=${numberOfWords}`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((word) => arrayOfWord.push(word));
      word.innerHTML = callback(arrayOfWord);
    });
}

// Add a word to dom

function addWordToDom() {
  fetchWords(5, callback);
}

addWordToDom();

// Score function

function updateScore() {
  score++;
  scoreEl.innerText = score;
}

//time

const timeInterval = setInterval(updateTime, 1000);

function updateTime() {
  time--;
  timeEl.innerHTML = time + "s";

  if (time === 0) {
    clearInterval(timeInterval);
    //endgame
    gameOver();
  }
}

// function gameover

function gameOver() {
  endgameEl.innerHTML = `
  <h1>Time ran out</h1> 
  <p>Your final score is ${score}</p>
  <button onclick="location.reload()">Reload</button>
  `;
  endgameEl.style.display = "flex";
}

// EVENT LISTENER

settingsBtn.addEventListener("click", () => {
  settings.classList.toggle("hide");
});

text.addEventListener("input", (e) => {
  if (e.target.value === word.innerHTML) {
    addWordToDom();
    updateScore();
    e.target.value = "";
    if (difficulty === "easy") {
      time += 5;
    } else if (difficulty === "medium") {
      time += 3;
    } else {
      time += 2;
    }
    updateTime();
  }
});

difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value;
  updateLocalStorage();
});
