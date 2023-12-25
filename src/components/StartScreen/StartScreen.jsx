import "./StartScreen.css"
import React from 'react'

const StartScreen = ({ startGame, numTentativas, setNumTentativas }) => {
  return (
    <div className='start'>
        <h1>Advinhe a palavra</h1>
        <p>Escolha o número de tentativas:</p>
        <select
          value={numTentativas}
          onChange={(e) => setNumTentativas(Number(e.target.value))}
        >
          {[3, 4, 5, 6, 7, 8, 9].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <p>Clique no botão abaixo para começar a jogar.</p>
        <button onClick={startGame}>Começar o jogo</button>
    </div>
  )
}

export default StartScreen
