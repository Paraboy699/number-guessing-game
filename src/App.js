import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const API_URL = "https://marcconrad.com/uob/tomato/api.php?out=json";

const TomatoGame = () => {
  const [gameData, setGameData] = useState({ imageUrl: "", solution: "" });
  const [guess, setGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hint, setHint] = useState("");

  // Fetches the game data from the API when the component mounts
  useEffect(() => {
    fetchGameData();
  }, []);

  // Handles the countdown timer
  useEffect(() => {
    if (!timeLeft) {
      fetchGameData();
      setScore(0);
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const fetchGameData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setGameData({ imageUrl: data.question, solution: data.solution });
      setIsCorrect(false);
      setTimeLeft(30);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  const handleGuess = () => {
    if (parseInt(guess, 10) === gameData.solution) {
      toast.success("YOU GUESSED CORRECTLY!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      toast.error("WRONG ANSWER, TRY AGAIN", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    }
  };

  const handleNextLevel = () => {
    fetchGameData();
    setGuess("");
    setHint(""); // Reset the hint
  };

  const handleHint = () => {
    const randomNum1 = Math.floor(Math.random() * 10);
    const randomNum2 = Math.floor(Math.random() * 10);
    const hintOptions = [gameData.solution, randomNum1, randomNum2];
    setHint(`The correct answer is one of these: ${hintOptions.join(", ")}`);
  };

  return (
    <div className="container">
      <h1>The Tomato Game</h1>
      <h2>Score: {score}</h2>
      <h2>Time left: {timeLeft}</h2>
      <img src={gameData.imageUrl} alt="Tomato Game" />
      <div className="label-input-button-container">
        <label htmlFor="guessInput">Enter the missing digit:</label>
        <input
          type="number"
          id="guessInput"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button onClick={handleGuess}>Enter</button>
      </div>
      {isCorrect && <button onClick={handleNextLevel}>Next Level</button>}
      <button onClick={handleHint}>Get Hint</button>
      <p>{hint}</p>
      <ToastContainer />
    </div>
  );
};

export default TomatoGame;
