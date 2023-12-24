import './App.css'
import { useState, useEffect, useCallback } from 'react'
import { wordsList } from './data/palavras'
import StartScreen from './components/StartScreen/StartScreen'
import Game from './components/Game/Game'
import GameOver from './components/GameOver/GameOver'
import CongratsModal from './components/CongratsModal/CongratsModal'

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

const guessesQty = 3 //número de tentativas

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const normalizeLetter = (letter) => {
    return letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
  }

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    return { word, category }
  }, [words])

  const startGame = useCallback(() => {
    clearLetterStates()
    const { word, category } = pickWordAndCategory()
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((letter) => normalizeLetter(letter))
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    setGuesses(guessesQty)
    setGameStage(stages[1].name)
    setShowModal(false)
  }, [pickWordAndCategory])

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
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  return (
    <div>
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" &&
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
        />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
      {showModal && <CongratsModal onClose={closeModal} />}
    </div>
  )
}

export default App
