const gameContainer = document.querySelector(".container");
const userResult = document.querySelector(".user_result img");
const botResult = document.querySelector(".bot_result img");
const result = document.querySelector(".result");
const optionImages = document.querySelectorAll(".option_image");
const userScoreElement = document.getElementById("userScore");
const botScoreElement = document.getElementById("botScore");
const resetButton = document.querySelector(".reset_button");
const historyList = document.querySelector(".history");
const leaderboardList = document.getElementById("leaderboardList");

const defaultUserName = "You";
const defaultBotName = "BOT";

document.querySelector(".user_name").textContent = `${defaultUserName}: `;
document.querySelector(".bot_name").textContent = `${defaultBotName}: `;

const botImages = ["images/rock.png", "images/paper.png", "images/scissors.png"];
const outcomes = {
  RR: "Draw",
  RP: "BOT",
  RS: "YOU",
  PP: "Draw",
  PR: "YOU",
  PS: "BOT",
  SS: "Draw",
  SR: "BOT",
  SP: "YOU"
};

const sounds = {
  win: new Audio("sound/win.mp3"),
  lose: new Audio("sound/lose.mp3"),
  draw: new Audio("sound/draw.mp3"),
  click: new Audio("sound/click.mp3")
};

let userScore = 0;
let botScore = 0;
let history = [];

function handleOptionClick(event) {
  const clickedImage = event.currentTarget;
  const clickedIndex = Array.from(optionImages).indexOf(clickedImage);

  sounds.click.play();

  userResult.src = botResult.src = "images/rock.png";
  result.textContent = "Wait...";
  result.classList.remove("winner", "loser", "draw");

  optionImages.forEach((image, index) => {
    image.classList.toggle("active", index === clickedIndex);
  });

  gameContainer.classList.add("start");

  setTimeout(() => {
    gameContainer.classList.remove("start");
    gameContainer.classList.add("clash");

    setTimeout(() => {
      gameContainer.classList.remove("clash");

      const userImageSrc = clickedImage.querySelector("img").src;
      userResult.src = userImageSrc;

      const randomNumber = Math.floor(Math.random() * botImages.length);
      const botImageSrc = botImages[randomNumber];
      botResult.src = botImageSrc;

      const userValue = ["R", "P", "S"][clickedIndex];
      const botValue = ["R", "P", "S"][randomNumber];
      const outcomeKey = userValue + botValue;
      const outcome = outcomes[outcomeKey] || "Unknown";

      if (userValue === botValue) {
        result.textContent = "Match Draw";
        result.classList.add("draw");
        sounds.draw.play();
        updateHistory("Draw");
      } else if (outcome === "YOU") {
        result.textContent = "YOU WON!";
        result.classList.add("winner");
        userScore++;
        sounds.win.play();
        updateHistory("Win");
      } else {
        result.textContent = "BOT WON!";
        result.classList.add("loser");
        botScore++;
        sounds.lose.play();
        updateHistory("Lose");
      }

      updateScoreboard();
      updateLeaderboard();

      resetButton.style.display = "block";
    }, 800);
  }, 2500);
}

function updateScoreboard() {
  userScoreElement.textContent = userScore;
  botScoreElement.textContent = botScore;
}

function updateLeaderboard() {
  const userScoreBoard = document.getElementById("userScoreBoard");
  const botScoreBoard = document.getElementById("botScoreBoard");
  userScoreBoard.textContent = userScore;
  botScoreBoard.textContent = botScore;
}

function updateHistory(outcome) {
  const outcomeText = `${outcome} - ${new Date().toLocaleTimeString()}`;
  history.unshift(outcomeText);

  if (history.length > 5) {
    history.pop();
  }

  historyList.innerHTML = history
    .map(entry => `<li>${entry}</li>`)
    .join("");
}

function resetGame() {
  userScore = 0;
  botScore = 0;
  history = [];

  updateScoreboard();
  updateLeaderboard();

  result.textContent = "Start Playing!";
  result.classList.remove("winner", "loser", "draw");
  userResult.src = botResult.src = "images/rock.png";
  optionImages.forEach(image => image.classList.remove("active"));
  resetButton.style.display = "none";

  historyList.innerHTML = "";
}

optionImages.forEach(image => {
  image.addEventListener("click", handleOptionClick);
});

resetButton.addEventListener("click", resetGame);
