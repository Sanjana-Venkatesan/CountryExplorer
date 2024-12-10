import React, { useState, useEffect } from "react";
import { Trophy, Clock, Star, RefreshCw } from 'lucide-react';
import './FlagQuiz.css';

const FlagQuiz = ({ countries }) => {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("not-started");
  const [questionTimeLeft, setQuestionTimeLeft] = useState(10);
  const [gameTimeLeft, setGameTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState("medium");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let timer;
    if (gameStatus === "playing" && questionTimeLeft > 0) {
      timer = setInterval(() => setQuestionTimeLeft((prev) => prev - 1), 1000);
    } else if (questionTimeLeft === 0) {
      handleTimeOut();
    }
    return () => clearInterval(timer);
  }, [gameStatus, questionTimeLeft]);

  useEffect(() => {
    let gameTimer;
    if (gameStatus === "playing" && gameTimeLeft > 0) {
      gameTimer = setInterval(() => setGameTimeLeft((prev) => prev - 1), 1000);
    } else if (gameTimeLeft === 0) {
      endGame();
    }
    return () => clearInterval(gameTimer);
  }, [gameStatus, gameTimeLeft]);

  const startQuiz = (selectedDifficulty = "medium") => {
    setDifficulty(selectedDifficulty);
    setGameStatus("playing");
    setScore(0);
    setStreak(0);
    setGameTimeLeft(30);
    setQuestionTimeLeft(getDifficultyTimer(selectedDifficulty));
    generateQuestion();
  };

  const getDifficultyTimer = (difficulty) => {
    switch (difficulty) {
      case "easy": return 15;
      case "medium": return 10;
      case "hard": return 5;
      default: return 10;
    }
  };

  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const country = countries[randomIndex];
    const correctOption = {
      name: country.name.common,
      flag: country.flags.png
    };
    const incorrectOptions = countries
      .filter((c) => c.cca3 !== country.cca3)
      .slice(0, 3)
      .map((c) => ({
        name: c.name.common,
        flag: c.flags.png
      }));
    setOptions([correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5));
    setCurrentCountry(correctOption);
  };

  const handleAnswer = (selectedOption) => {
    if (selectedOption.name === currentCountry.name) {
      setMessage("Correct!");
      setScore((prevScore) => prevScore + 1);
      setStreak((prevStreak) => prevStreak + 1);
    } else {
      setMessage(`Wrong! The correct answer was ${currentCountry.name}`);
      setStreak(0);
    }
    setTimeout(() => {
      setMessage("");
      generateQuestion();
      setQuestionTimeLeft(getDifficultyTimer(difficulty));
    }, 1000);
  };

  const handleTimeOut = () => {
    setMessage(`Time's up! The correct answer was ${currentCountry.name}`);
    setStreak(0);
    setTimeout(() => {
      setMessage("");
      generateQuestion();
      setQuestionTimeLeft(getDifficultyTimer(difficulty));
    }, 1000);
  };

  const endGame = () => {
    setGameStatus("ended");
    setMessage(`Game Over! Your final score: ${score}`);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="flag-quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-title">Global Flag Challenge</h2>
        {gameStatus !== "not-started" && (
          <div className="quiz-stats">
            <div className="stat-item">
              <Trophy className="stat-icon" />
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <Star className="stat-icon" color="#ffd700" />
              <span>{streak}</span>
            </div>
            <div className="stat-item">
              <Clock className="stat-icon" />
              <span>{gameTimeLeft}s</span>
            </div>
          </div>
        )}
      </div>

      {gameStatus === "not-started" && (
        <div className="difficulty-selection">
          {["easy", "medium", "hard"].map((diff) => (
            <button 
              key={diff} 
              onClick={() => startQuiz(diff)}
              className={`difficulty-btn ${getDifficultyColor(diff)}`}
            >
              Start {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      )}

      {gameStatus === "playing" && currentCountry && (
        <div className="game-area">
          <div className="flag-container">
            <img 
              src={currentCountry.flag} 
              alt={`Flag of ${currentCountry.name}`} 
              className="flag-image"
            />
            <p className="question-text">Which country does this flag belong to?</p>
          </div>

          <div className="options-grid">
            {options.map((option) => (
              <button 
                key={option.name} 
                onClick={() => handleAnswer(option)}
                className="option-btn"
              >
                {option.name}
              </button>
            ))}
          </div>

          {message && (
            <div className={`message ${message.includes("Correct") ? "correct" : "incorrect"}`}>
              {message}
            </div>
          )}

          <div className="timer-bar" style={{width: `${(questionTimeLeft / getDifficultyTimer(difficulty)) * 100}%`}}></div>
        </div>
      )}

      {gameStatus === "ended" && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p className="final-score">{message}</p>
          <button 
            onClick={() => startQuiz(difficulty)} 
            className="play-again-btn"
          >
            <RefreshCw className="mr-2" /> Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FlagQuiz;