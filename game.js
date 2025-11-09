import { 
  submitScore, 
  listenToTopScores, 
  auth, 
  loginWithGoogle, 
  logout 
} from "./firebase.js";

let countries = [];
let flagPoints = 0;
let capitalPoints = 0;
const flagRounds = 10;
const capitalRounds = 10;
let user = null;

// ======== ACCOUNT DROPDOWN ========
const accountBtn = document.getElementById("account-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userName = document.getElementById("user-name");
const userPfp = document.getElementById("user-pfp");

accountBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

auth.onAuthStateChanged((u) => {
  user = u;
  if (u) {
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    userName.textContent = u.displayName;

    if (u.photoURL) {
      userPfp.src = u.photoURL;
    } else {
      // fallback profile image
      userPfp.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    }
    userPfp.classList.remove("hidden");
  } else {
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    userName.textContent = "Login";
    userPfp.classList.add("hidden");
  }
});

loginBtn.onclick = async () => {
  const loggedIn = await loginWithGoogle();
  if (loggedIn) alert(`Welcome, ${loggedIn.displayName}!`);
  dropdownMenu.classList.add("hidden");
};

logoutBtn.onclick = () => {
  logout();
  alert("Logged out successfully!");
  dropdownMenu.classList.add("hidden");
};

// ======== FETCH COUNTRIES ========
async function fetchCountries() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital");
    const data = await res.json();
    return data.map((c) => ({
      name: c.name.common,
      flag: c.flags.svg,
      capital: c.capital ? c.capital[0] : "N/A",
    }));
  } catch (err) {
    console.error("Failed to fetch countries:", err);
    alert("Error fetching countries. Please refresh.");
    return [];
  }
}

// ======== HELPER ========
function getRandomItems(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// ======== FLAG CHALLENGE ========
function startFlagChallenge() {
  const challengeCountries = getRandomItems(countries, flagRounds);
  const flagSection = document.getElementById("flag-challenge");
  flagSection.style.display = "block";
  let round = 0;

  function nextFlag() {
    if (round >= flagRounds) {
      flagSection.style.display = "none";
      startCapitalChallenge();
      return;
    }

    const country = challengeCountries[round];
    document.getElementById("flag-img").src = country.flag;

    const optionsDiv = document.getElementById("flag-options");
    const options = getRandomItems(countries, 3);
    options.push(country);
    options.sort(() => 0.5 - Math.random());

    optionsDiv.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt.name;
      btn.className = "px-4 py-2 m-1 bg-accentBlue text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-all";
      btn.onclick = () => {
        if (opt.name === country.name) flagPoints++;
        round++;
        nextFlag();
      };
      optionsDiv.appendChild(btn);
    });
  }

  nextFlag();
}

// ======== CAPITAL CHALLENGE ========
function startCapitalChallenge() {
  const challengeCountries = getRandomItems(countries, capitalRounds);
  const capitalSection = document.getElementById("capital-challenge");
  capitalSection.style.display = "block";
  let round = 0;

  function nextCapital() {
    if (round >= capitalRounds) {
      capitalSection.style.display = "none";
      gameOver();
      return;
    }

    const country = challengeCountries[round];
    document.getElementById("capital-question").textContent =
      `Which country has the capital ${country.capital}?`;

    const optionsDiv = document.getElementById("capital-options");
    const options = getRandomItems(countries, 3);
    options.push(country);
    options.sort(() => 0.5 - Math.random());

    optionsDiv.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt.name;
      btn.className = "px-4 py-2 m-1 bg-accentPurple text-white font-bold rounded-lg shadow-md hover:bg-purple-600 transition-all";
      btn.onclick = () => {
        if (opt.name === country.name) capitalPoints++;
        round++;
        nextCapital();
      };
      optionsDiv.appendChild(btn);
    });
  }

  nextCapital();
}

// ======== GAME OVER ========
function gameOver() {
  const total = flagPoints + capitalPoints;
  alert(`Game over! You scored ${total} points.`);

  // Submit score if logged in
  if (user) submitScore(total);

  // Show "Play Again" button
  const playAgainSection = document.getElementById("play-again-section");
  playAgainSection.classList.remove("hidden");

  const playAgainBtn = document.getElementById("play-again-btn");
  playAgainBtn.onclick = () => {
    restartGame();
  };
}

// ======== RESTART GAME ========
function restartGame() {
  // Reset scores
  flagPoints = 0;
  capitalPoints = 0;

  // Hide play again button
  document.getElementById("play-again-section").classList.add("hidden");

  // Hide challenge sections
  document.getElementById("flag-challenge").style.display = "none";
  document.getElementById("capital-challenge").style.display = "none";

  // Start again
  startFlagChallenge();
}


// ======== LEADERBOARD ========
function showLeaderboard() {
  const div = document.getElementById("top-scores");
  listenToTopScores((scores) => {
    div.innerHTML = "";

    if (!scores.length) {
      div.innerHTML = "<p>No scores yet. Play and be the first!</p>";
      return;
    }

    scores.forEach((s, i) => {
      const entry = document.createElement("div");
      entry.className = "w-full flex justify-between bg-gray-100 px-4 py-2 rounded-lg shadow border mb-1 transition-all";

      if (i === 0)
        entry.classList.add("border-accentGreen", "text-accentGreen", "font-bold");
      else if (i === 1)
        entry.classList.add("border-accentBlue", "text-accentBlue");
      else if (i === 2)
        entry.classList.add("border-accentPurple", "text-accentPurple");

      if (user && s.name === user.displayName) {
        entry.classList.add("bg-yellow-100", "border-yellow-500", "font-semibold");
      }

      entry.innerHTML = `<span>${i + 1}. ${s.name}</span><span>${s.score}</span>`;
      div.appendChild(entry);
    });
  });
}

// ======== INIT ========
async function initGame() {
  countries = await fetchCountries();
  if (!countries.length) return alert("Failed to load country data.");
  document.getElementById("flag-challenge").style.display = "none";
  document.getElementById("capital-challenge").style.display = "none";
  startFlagChallenge();
  showLeaderboard();
}

window.onload = initGame;
