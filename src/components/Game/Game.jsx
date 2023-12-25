import './Game.css'
import React, { useState, useRef } from 'react'

function formatCategoryName(category) {
  return category
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toUpperCase();
}

const Game = ({
    verifyLetter,
    pickedWord,
    pickedCategory,
    letters,
    guessedLetters,
    wrongLetters,
    guesses,
    score,
    normalizeLetter
}) => {

    const [letter, setLetter] = useState("")
    const letterInputRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        verifyLetter(letter)

        setLetter("")

        letterInputRef.current.focus()
    }

    const formattedCategory = formatCategoryName(pickedCategory);

    const renderLetterBoxes = () => {
        return letters.map((letter, i) => {
            if (letter === ' ') {
                return <div key={i} className="space"></div>;
            } else {
                return guessedLetters.includes(normalizeLetter(letter)) ? (
                    <span key={i} className='letter'>{letter}</span>
                ) : (
                    <span key={i} className='blankSquare'></span>
                );
            }
        });
    };

    return (
        <div className="game">
            <p className="points">
                <span>Pontuação: {score}</span>
            </p>
            <h1>Advinhe a palavra:</h1>
            <h3 className="tip">
                Dica sobre a palavra: <span>{formattedCategory}</span>
            </h3>
            <p>Você ainda tem {guesses} tentativa(s).</p>
            <div className="wordContainer">
                {renderLetterBoxes()}
            </div>
            <div className="letterContainer">
                <p>Tente advinhar uma letra da palavra:</p>
                <form onSubmit={handleSubmit}>
                    <input className='letterInput' type="text" name="letter" placeholder='digite' maxLength="1" required onChange={(e) =>
                        setLetter(e.target.value)}
                        value={letter}
                        ref={letterInputRef}
                    />
                    <button>Jogar</button>
                </form>
            </div>
            <div className="wrongLettersContainer">
                <p>Letras já utilizadas:</p>
                {wrongLetters.map((letter, i) => (
                    <span key={i}>{letter}, </span>
                ))}
            </div>
        </div>
    )
}

export default Game
