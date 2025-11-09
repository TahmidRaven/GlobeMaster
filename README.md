# GlobeMaster 🌐

**Play the game in your browser: Test Your Knowledge** [GlobeMaster Game](https://tahmidraven.github.io/GlobeMaster/)

---

## Overview

**GlobeMaster** is an interactive geography quiz game where players test their knowledge of world **flags** and **capitals**. Compete against others on the **leaderboard**, earn points, and see where you stand globally!

## TIP FOR THOSE WHO WOULD USE FIREBASE & GITHUB PAGES HOSTING: 
make sure you add the github domain to your authorized firebase domains 
```Firebase Console → Authentication → Settings → Authorized Domains```

Players can:

- Identify flags in the **Flag Challenge**.
- Match capitals to countries in the **Capital Challenge**.
- Track their scores and compare with others on the **Leaderboard**.
- Login with Google to save scores in **real-time**.
<img width="1871" height="996" alt="Screenshot 2025-11-09 165208" src="https://github.com/user-attachments/assets/8ea2e7c9-4569-4356-8568-0cd962bc2db6" />

---

## Features

- **Two Fun Challenges**
  - **Flag Challenge:** Guess the country by its flag.
  - **Capital Challenge:** Guess the country by its capital city.
- **Points & Leaderboard**
  - Scores are tracked in **real-time** using Firebase.
  - See top players and your own ranking instantly.
- **Google Authentication**
  - Login using Google to save scores.
  - Personalized profile picture and name displayed.
- **Responsive & Dark Mode**
  - Fully responsive design.
  - Supports **dark/light mode** with smooth transitions.
- **Interactive UI**
  - Dynamic buttons and animations for challenge options.
  - Play again button to restart the game immediately.

---

## Technologies Used

- **Frontend**
  - HTML5 & CSS3
  - Tailwind CSS (for styling and responsive design)
  - JavaScript (ES6 Modules)
  - Font Awesome (icons)
- **Backend / Services**
  - Firebase Realtime Database (for leaderboard & score storage)
  - Firebase Authentication (Google login)
- **APIs**
  - [REST Countries API](https://restcountries.com/) for fetching flags, country names, and capitals

---

## How to Play

1. Open the game: [GlobeMaster](https://tahmidraven.github.io/GlobeMaster/)
2. Click **Login** to save your score (optional).
3. Start the **Flag Challenge**: Identify the country from the flag.
4. Move on to the **Capital Challenge**: Match capitals with countries.
5. View your score and see your ranking on the **Leaderboard**.
6. Click **Play Again** to retry and improve your score.

---

## License

This project is open-source and available under the MIT License.
