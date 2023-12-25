import './App.css'
import { useState, useEffect, useCallback } from 'react'
import { wordsList } from './data/palavras'
import StartScreen from './components/StartScreen/StartScreen'
import Game from './components/Game/Game'
import GameOver from './components/GameOver/GameOver'
import CongratsModal from './components/CongratsModal/CongratsModal'
import Scoreboard from './components/Scoreboard/Scoreboard'

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [availableWords, setAvailableWords] = useState(wordsList)
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [numTentativas, setNumTentativas] = useState(3)
  const [score, setScore] = useState(0)
  const [scorePlayer1, setScorePlayer1] = useState(0)
  const [scorePlayer2, setScorePlayer2] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const normalizeLetter = (letter) => {
    return letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
  }

  const increaseScorePlayer1 = () => {
    setScorePlayer1(scorePlayer1 + 1)
  }
  
  const decreaseScorePlayer1 = () => {
    if (scorePlayer1 > 0) {
      setScorePlayer1(scorePlayer1 - 1)
    }
  }
  
  const increaseScorePlayer2 = () => {
    setScorePlayer2(scorePlayer2 + 1)
  }
  
  const decreaseScorePlayer2 = () => {
    if (scorePlayer2 > 0) {
      setScorePlayer2(scorePlayer2 - 1)
    }
  }
  

  const pickWordAndCategory = useCallback(() => {
    if (Object.keys(availableWords).length === 0) {
      setAvailableWords(wordsList)
    }

    const categories = Object.keys(availableWords)
    const category = categories[Math.floor(Math.random() * categories.length)]
    const wordIndex = Math.floor(Math.random() * availableWords[category].length)
    const word = availableWords[category][wordIndex]

    const newWordsList = { ...availableWords }
    newWordsList[category].splice(wordIndex, 1)
    if (newWordsList[category].length === 0) {
      delete newWordsList[category]
    }
    setAvailableWords(newWordsList)

    return { word, category }
  }, [availableWords])

  const startGame = useCallback(() => {
    clearLetterStates()
    const { word, category } = pickWordAndCategory()
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((letter) => normalizeLetter(letter))
    const spaceGuessed = wordLetters.includes(' ') ? [' '] : []
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    setGuessedLetters(spaceGuessed)
    setGuesses(numTentativas)
    setGameStage(stages[1].name)
  }, [pickWordAndCategory, numTentativas])

  const verifyLetter = (letter) => {
    const normalizedLetter = normalizeLetter(letter)
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }
    if (letters.some(l => normalizeLetter(l) === normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {
    if (letters.length > 0 && gameStage === "game") {
      const uniqueLetters = new Set(letters)
      const hasGuessedAllLetters = [...uniqueLetters].every(normalizedLetter => 
        guessedLetters.includes(normalizedLetter)
      )
      if (hasGuessedAllLetters) {
        setScore((actualScore) => (actualScore += 100))
        setShowModal(true)
      }
    }
  }, [guessedLetters, letters, gameStage])

  const closeModal = () => {
    setShowModal(false)
    startGame()
  }

  const retry = () => {
    setScore(0)
    setGuesses(numTentativas)
    setGameStage(stages[0].name)
  }

  return (
    <div>
      {gameStage === "start" && <StartScreen startGame={startGame} numTentativas={numTentativas} setNumTentativas={setNumTentativas} />}
      
      {gameStage === "game" &&
        <>
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
            normalizeLetter={normalizeLetter}
          />
          <div className="scoreboards">
            <Scoreboard score={scorePlayer1} onIncrease={increaseScorePlayer1} onDecrease={decreaseScorePlayer1} />
            <Scoreboard score={scorePlayer2} onIncrease={increaseScorePlayer2} onDecrease={decreaseScorePlayer2} />
          </div>
        </>
      }

      {gameStage === "end" && <GameOver retry={retry} score={score} />}
      {showModal && <CongratsModal onClose={closeModal} />}
    </div>
  )
}

export default App;
