import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  query,
  orderByChild,
  limitToLast,
  onValue,
  get
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDhTA-6S-40eJtpoIZttCSnGnNc7af6g-M",
  authDomain: "globemaster-webgame.firebaseapp.com",
  databaseURL: "https://globemaster-webgame-default-rtdb.firebaseio.com",
  projectId: "globemaster-webgame",
  storageBucket: "globemaster-webgame.firebasestorage.app",
  messagingSenderId: "665300855478",
  appId: "1:665300855478:web:fdd7fd540627b2623a5417",
  measurementId: "G-HD53ML4SB2",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google login
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed. Please try again.");
    return null;
  }
}

export function logout() {
  signOut(auth);
}

// Submit score
export function submitScore(score) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to submit your score.");
    return;
  }

  const newScoreRef = push(ref(db, "scores"));
  return newScoreRef.then(() =>
    push(ref(db, "scores"), {
      name: user.displayName || "Anonymous",
      email: user.email || "",
      score,
      timestamp: Date.now(),
    })
  );
}

// Fetch top 10 scores (async once)
export async function getTopScores() {
  try {
    const scoresQuery = query(ref(db, "scores"), orderByChild("score"), limitToLast(10));
    const snapshot = await get(scoresQuery);

    const allScores = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      if (data && typeof data.score === "number") {
        allScores.push(data);
      }
    });

    return allScores.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return [];
  }
}

// Real-time listener for top 10 scores
export function listenToTopScores(callback) {
  const scoresQuery = query(ref(db, "scores"), orderByChild("score"), limitToLast(10));

  onValue(scoresQuery, (snapshot) => {
    const scores = [];
    snapshot.forEach((childSnapshot) => {
      const val = childSnapshot.val();
      if (val && typeof val.score === "number") {
        scores.push(val);
      }
    });

    const sorted = scores.sort((a, b) => b.score - a.score).slice(0, 10);
    callback(sorted);
  });
}
